import type { Report, ToolCheck, Finding, Severity } from "../types";
import { saveReportToCookie } from "../utils/cookies";
import sampleJson from "../data/sample.json";

export const API_URL = "/";

/**
 * Creates a unique identifier.
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "rep_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Deep clone helper.
 */
function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

/**
 * Generates a complete fallback Report object using sample.json,
 * customized with the user's requested target URL and current timestamp.
 */
export function getFallbackReport(requestedUrl: string): Report {
  const base = clone(sampleJson as unknown as Report);
  const cleanUrl = requestedUrl.trim() || base.target?.url || "https://example.com";
  const id = generateId();
  const now = new Date().toISOString();

  const report: Report = {
    ...base,
    id,
    timestamp: now,
    createdGroup: "Today",
    target: {
      ...base.target,
      url: cleanUrl,
      company: cleanUrl,
    },
    // Replace hardcoded sample url in findings evidence if matching
    findings: (base.findings || []).map((f) => ({
      ...f,
      evidence: f.evidence === "https://www.tonycui.online/" ? cleanUrl : f.evidence,
    })),
    tools: (base.tools || []).map((t) => ({
      ...t,
      findings: (t.findings || []).map((f) => ({
        ...f,
        evidence: f.evidence === "https://www.tonycui.online/" ? cleanUrl : f.evidence,
      })),
    })),
  };

  return report;
}

/**
 * TypeScript parser that validates, parses, and fills in any missing/empty
 * information from sample.json to construct a robust, fully-typed Report object.
 */
export function parseReport(apiOutput: unknown, requestedUrl: string): Report {
  const fallback = getFallbackReport(requestedUrl);

  if (!apiOutput || typeof apiOutput !== "object") {
    return fallback;
  }

  const raw = apiOutput as Record<string, any>;
  const cleanUrl = requestedUrl.trim() || raw.target?.url || fallback.target.url;

  // Helper to safely extract tool checks
  const sanitizeToolChecks = (arr: unknown, fallbackArr: ToolCheck[]): ToolCheck[] => {
    if (!Array.isArray(arr) || arr.length === 0) return fallbackArr;
    return arr.map((item) => ({
      tool: String(item.tool || "unknown_tool"),
      status: String(item.status || "info"),
      finding_count: typeof item.finding_count === "number" ? item.finding_count : undefined,
      findings: Array.isArray(item.findings) ? item.findings : undefined,
    }));
  };

  // Helper to safely extract findings
  const sanitizeFindings = (arr: unknown, fallbackArr: Finding[]): Finding[] => {
    if (!Array.isArray(arr) || arr.length === 0) return fallbackArr;
    return arr.map((item) => ({
      tool: String(item.tool || "general"),
      severity: (item.severity || "info") as Severity,
      title: String(item.title || "Untitled finding"),
      detail: String(item.detail || ""),
      evidence: String(item.evidence || ""),
    }));
  };

  const parsedReport: Report = {
    id: raw.id || generateId(),
    timestamp: raw.timestamp || new Date().toISOString(),
    createdGroup: "Today",
    target: {
      kind: raw.target?.kind || "url",
      url: cleanUrl,
      file_count: typeof raw.target?.file_count === "number" ? raw.target.file_count : fallback.target.file_count,
      company: raw.target?.company || cleanUrl,
    },
    summary: {
      tool_count: typeof raw.summary?.tool_count === "number" ? raw.summary.tool_count : fallback.summary.tool_count,
      finding_count: typeof raw.summary?.finding_count === "number" ? raw.summary.finding_count : fallback.summary.finding_count,
      severity: {
        critical: raw.summary?.severity?.critical ?? fallback.summary.severity.critical ?? 0,
        high: raw.summary?.severity?.high ?? fallback.summary.severity.high ?? 0,
        medium: raw.summary?.severity?.medium ?? fallback.summary.severity.medium ?? 0,
        low: raw.summary?.severity?.low ?? fallback.summary.severity.low ?? 0,
        info: raw.summary?.severity?.info ?? fallback.summary.severity.info ?? 0,
      },
      matched_cve_count: typeof raw.summary?.matched_cve_count === "number" ? raw.summary.matched_cve_count : fallback.summary.matched_cve_count,
      cves_tried_count: typeof raw.summary?.cves_tried_count === "number" ? raw.summary.cves_tried_count : fallback.summary.cves_tried_count,
      council_rounds: typeof raw.summary?.council_rounds === "number" ? raw.summary.council_rounds : fallback.summary.council_rounds,
      nist_score: typeof raw.summary?.nist_score === "number" ? raw.summary.nist_score : fallback.summary.nist_score,
      nist_rating: raw.summary?.nist_rating || fallback.summary.nist_rating,
      score_standard: raw.summary?.score_standard || fallback.summary.score_standard,
      local_cve_knowledge_count: typeof raw.summary?.local_cve_knowledge_count === "number" ? raw.summary.local_cve_knowledge_count : fallback.summary.local_cve_knowledge_count,
    },
    nist: {
      score: typeof raw.nist?.score === "number" ? raw.nist.score : fallback.nist.score,
      scale: raw.nist?.scale || fallback.nist.scale,
      standard: raw.nist?.standard || fallback.nist.standard,
      rating: raw.nist?.rating || fallback.nist.rating,
      explanation: raw.nist?.explanation || fallback.nist.explanation,
      passed: sanitizeToolChecks(raw.nist?.passed, fallback.nist.passed),
      failed: sanitizeToolChecks(raw.nist?.failed, fallback.nist.failed),
      informational: sanitizeToolChecks(raw.nist?.informational, fallback.nist.informational),
      tools_used: Array.isArray(raw.nist?.tools_used) && raw.nist.tools_used.length > 0 ? raw.nist.tools_used : fallback.nist.tools_used,
    },
    cves: {
      matched: Array.isArray(raw.cves?.matched) ? raw.cves.matched : fallback.cves.matched,
      tried: Array.isArray(raw.cves?.tried) ? raw.cves.tried : fallback.cves.tried,
      sources: Array.isArray(raw.cves?.sources) ? raw.cves.sources : fallback.cves.sources,
      cross_check: raw.cves?.cross_check || fallback.cves.cross_check,
      fetched_at: raw.cves?.fetched_at || fallback.cves.fetched_at,
      local_knowledge: Array.isArray(raw.cves?.local_knowledge) && raw.cves.local_knowledge.length > 0
        ? raw.cves.local_knowledge
        : fallback.cves.local_knowledge,
    },
    after_action_report: {
      summary: raw.after_action_report?.summary || fallback.after_action_report.summary,
      next_steps: Array.isArray(raw.after_action_report?.next_steps) && raw.after_action_report.next_steps.length > 0
        ? raw.after_action_report.next_steps
        : fallback.after_action_report.next_steps,
    },
    tools: sanitizeToolChecks(raw.tools, fallback.tools),
    findings: sanitizeFindings(raw.findings, fallback.findings),
    council: raw.council || fallback.council,
    narrative: raw.narrative || fallback.narrative,
  };

  return parsedReport;
}

/**
 * Calls the API located in API_URL on the route "/scan/url".
 *
 * Payload: { "url": "URL_HERE" }
 * Timeout: 10 seconds (10,000ms)
 *
 * If the API doesn't respond or times out in 10s, sample.json is used to fill in the info.
 * The resulting Report object is automatically saved into a cookie and returned.
 */
export async function scanUrl(inputUrl: string): Promise<Report> {
  let targetUrl = inputUrl.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  const endpoint = `${API_URL.replace(/\/$/, "")}/scan/url`;
  console.log(`[Aegis API] Calling ${endpoint} with url: ${targetUrl}`);

  const controller = new AbortController();
  const timeoutMs = 10000; // 10 seconds timeout as requested
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.warn(`[Aegis API] Request timed out after ${timeoutMs / 1000}s, using sample.json`);
  }, timeoutMs);

  let report: Report;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url: targetUrl }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[Aegis API] Response received successfully, parsing report...");
    report = parseReport(data, targetUrl);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      console.warn("[Aegis API] 10-second timeout reached. Falling back to sample.json");
    } else {
      console.warn("[Aegis API] Error connecting to API, using sample.json:", err?.message || err);
    }
    report = getFallbackReport(targetUrl);
  }

  // Store Report object in cookie
  saveReportToCookie(report);

  return report;
}
