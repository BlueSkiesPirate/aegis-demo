import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Processing from "./pages/Processing";
import Report from "./pages/Report";
import { initialAnalyses } from "./data/mock";
import type { AgentId, Analysis } from "./types";
import { scanUrl, getFallbackReport } from "./services/api";
import {
  getReportFromCookie,
  getReportsFromCookies,
  saveReportToCookie,
  setActiveReportCookie,
} from "./utils/cookies";

function getSaved(): Analysis[] {
  try {
    const raw = localStorage.getItem("aegis-analyses");
    return raw ? (JSON.parse(raw) as Analysis[]) : initialAnalyses;
  } catch {
    return initialAnalyses;
  }
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("aegis-login") === "yes",
  );
  const [analyses, setAnalyses] = useState<Analysis[]>(getSaved);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(4);

  // Initialize cookies with sample.json if cookies are completely empty
  useEffect(() => {
    const cookieReports = getReportsFromCookies();
    if (cookieReports.length === 0) {
      const initialReport = getFallbackReport("https://www.tonycui.online/");
      saveReportToCookie(initialReport);
    }
  }, []);

  useEffect(
    () => localStorage.setItem("aegis-analyses", JSON.stringify(analyses)),
    [analyses],
  );

  const active = analyses.find((a) => a.id === activeId);
  const activeReport = activeId ? getReportFromCookie(activeId) : null;

  useEffect(() => {
    if (active?.stage !== "processing") return;
    const timer = window.setInterval(
      () => setProgress((p) => Math.min(100, p + 2)),
      500,
    );
    return () => clearInterval(timer);
  }, [active?.stage, activeId]);

  function login() {
    localStorage.setItem("aegis-login", "yes");
    setLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("aegis-login");
    setLoggedIn(false);
  }

  async function start(repository: string, enabled: AgentId[], context: string) {
    const nextId = crypto.randomUUID();
    const next: Analysis = {
      id: nextId,
      repository,
      status: "running",
      created: "Today",
      stage: "processing",
      enabled,
      context,
    };

    setAnalyses((prev) => [next, ...prev]);
    setActiveId(next.id);
    setProgress(4);

    // Call the API on route /scan/url with a 10s timeout (falls back to sample.json)
    try {
      const report = await scanUrl(repository);
      setActiveReportCookie(report.id);
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === nextId
            ? {
                ...a,
                id: report.id, // align analysis ID with report ID
                reportId: report.id,
                status:
                  report.summary.nist_score >= 5 ? "warning" : "complete",
              }
            : a,
        ),
      );
      setActiveId(report.id);
    } catch (err) {
      console.warn("Scan failed, fallback handled in api service:", err);
    }
  }

  function finish() {
    if (!activeId) return;
    setAnalyses((prev) =>
      prev.map((a) =>
        a.id === activeId
          ? {
              ...a,
              stage: "report",
              status: a.status === "running" ? "warning" : a.status,
            }
          : a,
      ),
    );
  }

  function select(id: string) {
    setActiveId(id);
    setActiveReportCookie(id);
    setProgress(100);

    setAnalyses((prev) => {
      const found = prev.find((a) => a.id === id);
      if (found) {
        return prev.map((a) =>
          a.id === id
            ? {
                ...a,
                stage: a.stage === "processing" ? "processing" : "report",
              }
            : a,
        );
      }

      // If selected from cookies but not yet in memory list, add it
      const cookieRep = getReportFromCookie(id);
      if (cookieRep) {
        const item: Analysis = {
          id: cookieRep.id,
          repository: cookieRep.target.url,
          status:
            cookieRep.summary.nist_score >= 5 ? "warning" : "complete",
          created: cookieRep.createdGroup || "Today",
          stage: "report",
          enabled: ["dependency", "secrets", "access", "logic"],
          context: "",
          reportId: cookieRep.id,
        };
        return [item, ...prev];
      }

      return prev;
    });
  }

  if (!loggedIn) return <Login onLogin={login} />;

  const isShowingReport =
    active?.stage === "report" || (!active && activeReport !== null);

  return (
    <div className="app-shell">
      <Sidebar
        analyses={analyses}
        activeId={activeId}
        onSelect={select}
        onNew={() => setActiveId(null)}
        onLogout={logout}
      />
      <div className="main-column">
        <main className="main-area">
          {!active && !activeReport ? (
            <Setup onStart={start} />
          ) : active?.stage === "processing" ? (
            <Processing
              repository={active.repository}
              enabled={active.enabled}
              progress={progress}
              onFinish={finish}
            />
          ) : isShowingReport ? (
            <Report
              repository={active?.repository || activeReport?.target.url || "Target URL"}
              enabled={active?.enabled || []}
              reportId={activeId || undefined}
              report={activeReport}
              onNew={() => setActiveId(null)}
            />
          ) : (
            <Setup onStart={start} />
          )}
        </main>
      </div>
    </div>
  );
}
