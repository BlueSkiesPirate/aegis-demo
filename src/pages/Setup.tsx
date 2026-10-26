import { ArrowRight, Link2, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

// ── Setup page ───────────────────────────────────────────────────────────────

interface Props {
  onStart: (url: string) => Promise<void>;
  error?: string;
}

export default function Setup({ onStart, error: scanError }: Props) {
  const [url, setURL] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = url.trim();
    if (!input) {
      setError("Enter a website or GitHub repository URL.");
      return;
    }

    try {
      const parsed = new URL(
        /^https?:\/\//i.test(input) ? input : `https://${input}`,
      );
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Unsupported protocol");
      }
    } catch {
      setError("Enter a valid website or GitHub repository URL.");
      return;
    }

    setError("");
    await onStart(input);
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
      <form className="setup-form" onSubmit={submit}>
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
        {(error || scanError) && (
          <div role="alert" className="error-message">
            {error || scanError}
          </div>
        )}
        <div className="flex flex-row items-center justify-center">
          <button className="primary-btn" type="submit">
            Start analysis <ArrowRight size={15} />
          </button>
        </div>
      </form>
      <div className="ai-disclaimer">
        AI can make mistakes. Review findings before making changes.
      </div>
    </div>
  );
}
