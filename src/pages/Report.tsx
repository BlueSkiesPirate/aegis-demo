import {
  Check,
  ChevronDown,
  Clipboard,
  Download,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { AgentId } from "../types";
interface Props {
  repository: string;
  enabled: AgentId[];
  onNew: () => void;
}
const snippet = `import React, { useState, useEffect } from 'react';\nimport { defineProperties } from 'figma:react';\n\nexport default function AnalogClock({\n  updateInterval = 1000,\n  secondHandColor = 'red',\n  minuteHandColor = 'black',\n  hourHandColor = 'black',\n}) {\n  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });\n\n  useEffect(() => {\n    const updateClock = () => {\n      // Get London's local time using en-GB format\n      const londonTimeString = new Date().toLocaleTimeString('en-GB', {\n        timeZone: 'Europe/London',\n        hour12: false\n      });\n      const [hourStr, minuteStr, secondStr] = londonTimeString.split(':');\n      setTime({\n        hours: parseInt(hourStr, 10),\n        minutes: parseInt(minuteStr, 10),\n        seconds: parseInt(secondStr, 10)\n      });\n    };\n    updateClock();\n    const timerId = setInterval(updateClock, updateInterval);\n    return () => clearInterval(timerId);\n  }, [updateInterval]);`;
export default function Report({ repository, enabled, onNew }: Props) {
  const [closed, setClosed] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [resolved, setResolved] = useState(false);
  const toggle = (key: string) =>
    setClosed((s) =>
      s.includes(key) ? s.filter((x) => x !== key) : [...s, key],
    );
  function download() {
    const summary = `Aegis demo security report\nRepository: ${repository}\n\nCRITICAL\nCVE-2026-1234567 - Vulnerable transitive dependency (simulated)\nCVE-2026-1234568 - Vulnerable transitive dependency (simulated)\n\nWARNING\n20 packages out of date\nLine 35 in index.js has unsafe return\n\nThis is simulated sample data, not a real scan.`;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aegis-demo-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="content-page report-page">
      <div className="page-heading">
        <div>
          <h1>Report: {repository}</h1>
          <p>Our findings from the analysis</p>
        </div>
        <span className="status-badge">
          <span className="green-dot" />
          {enabled.length} agents active
        </span>
      </div>
      <div className="report-tools">
        <button onClick={download}>
          <Download size={14} />
          Export report
        </button>
        <button onClick={onNew}>+ New analysis</button>
      </div>
      <section className="report-section">
        <h2>Critical</h2>
        {[1, 2].map((item) => (
          <div className="finding" key={item}>
            <button
              className="finding-title critical"
              onClick={() => toggle("critical" + item)}
            >
              CVE-2026-123456{item === 1 ? "7" : "8"} <ChevronDown size={14} />
            </button>
            {!closed.includes("critical" + item) && (
              <>
                <p>Description from NIST CVE</p>
                <strong>Remediation:</strong>
                <p>• Update React</p>
              </>
            )}
            {item === 2 && (
              <>
                <div className="finding-subtitle">Preliminary finding</div>
                <p>
                  <span className="green-dot inline-block mr-1" />3 known CVEs
                  detected in transitive dependencies.
                </p>
                <div className="finding-subtitle">Working...</div>
              </>
            )}
          </div>
        ))}
      </section>
      <section className="report-section">
        <h2>Warning</h2>
        <div className="finding">
          <button
            className="finding-title warning"
            onClick={() => toggle("outdated")}
          >
            20 Packages Out Of Date <ChevronDown size={14} />
          </button>
          {!closed.includes("outdated") && (
            <>
              <p>• Tailwind CSS (20.0.0 → 20.0.1)</p>
              <p>• Next.js</p>
            </>
          )}
        </div>
        <div className="finding">
          <button
            className="finding-title warning"
            onClick={() => toggle("return")}
          >
            Line 35 in Index.js has unsafe return <ChevronDown size={14} />
          </button>
          {!closed.includes("return") && (
            <div className="code-shell">
              <button
                aria-label="Copy code"
                className="copy-code"
                onClick={() => {
                  navigator.clipboard?.writeText(snippet);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
              </button>
              <pre>
                <code>
                  {snippet.split("\n").map((line, i) => (
                    <span className="code-line" key={i}>
                      <span className="line-number">{i + 1}</span>
                      {line}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          )}
        </div>
        <div className="finding">
          <div className="finding-subtitle">Preliminary finding</div>
          <p>
            <span className="green-dot inline-block mr-1" />3 known CVEs
            detected in transitive dependencies.
          </p>
        </div>
      </section>
      <button className="resolve-btn" onClick={() => setResolved(!resolved)}>
        {resolved ? "✓ Marked as reviewed" : "Mark findings reviewed"}
      </button>
      <div className="ai-disclaimer">
        <ShieldCheck size={12} /> Example findings only. No actual repository
        security scan was performed.
      </div>
    </div>
  );
}
