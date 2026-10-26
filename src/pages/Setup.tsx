import { ArrowRight, Github, Link2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

// ── Setup page ───────────────────────────────────────────────────────────────

export default function Setup() {
  const [url, setURL] = useState("");
  const [error, setError] = useState("");
  const [context, setContext] = useState("");
  function submit() {
    //TODO: this should accept more than just Github URLs, this can accept normal urls as well
    if (
      !url.trim() ||
      !url.includes("github.com/") ||
      !url.split("github.com/")[1]?.includes("/")
    ) {
      setError(
        "Enter a GitHub repository URL, such as https://github.com/acme/payment-service",
      );
      return;
    }
    setError("");
  }
  return (
    <div className="setup-page">
      <span className="large-brand">
        <ShieldCheck size={22} />
      </span>
      <h1>What are we securing today?</h1>
      <p className="intro">
        Give our AI agents a repository. Get a clear picture of its
        vulnerabilities, with verified findings and
        <br className="desktop-only" /> actionable fixes.
      </p>
      <div className="setup-form">
        <div className="field-label">
          <Link2 size={14} /> GitHub repository or URL
        </div>
        <div className="repository-input">
          <Link2 size={16} />
          <input
            aria-label="GitHub repository or URL"
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="https://github.com/organization/repository"
          />
          <Link2 size={14} />
        </div>
        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}
        <div className="flex flex-row items-center justify-center">
          <button className="primary-btn" onClick={submit}>
            Start analysis <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <div className="ai-disclaimer">
        AI can make mistakes. Review findings before making changes.
      </div>
    </div>
  );
}
