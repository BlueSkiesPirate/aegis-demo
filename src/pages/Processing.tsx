import { Check, CircleDot, ShieldCheck } from "lucide-react";
import { agents, agentDetails } from "../data/mock";
import type { AgentId } from "../types";
interface Props {
  repository: string;
  enabled: AgentId[];
  progress: number;
  onFinish: () => void;
}
export default function Processing({
  repository,
  enabled,
  progress,
  onFinish,
}: Props) {
  const activeAgents = agents.filter((a) => enabled.includes(a.id));
  return (
    <div className="content-page">
      <div className="page-heading">
        <div>
          <h1>Processing {repository}</h1>
          <p>
            Four agents are reviewing your repository. Follow their progress
            below.
          </p>
        </div>
        <span className="status-badge">
          <span className="green-dot" />
          {activeAgents.length} agents active
        </span>
      </div>
      <div className="metrics">
        <div className="metric">
          <div>Overall progress</div>
          <strong>{progress}%</strong>
          <small>{progress < 100 ? "12 min left" : "Completed"}</small>
          <span className="meter">
            <span style={{ width: `${progress}%` }} />
          </span>
        </div>
        <div className="metric">
          <div>Files scanned</div>
          <strong>
            {Math.floor((3212 * progress) / 100).toLocaleString()}
          </strong>
          <small>4,320 total</small>
          <span className="meter">
            <span style={{ width: `${Math.min(100, progress * 0.75)}%` }} />
          </span>
        </div>
        <div className="metric">
          <div>Findings surfaced</div>
          <strong>{Math.floor((40 * progress) / 100)}</strong>
          <small>8 high priority</small>
          <span className="meter">
            <span style={{ width: `${Math.min(100, progress * 0.85)}%` }} />
          </span>
        </div>
      </div>
      <div className="agent-grid">
        {activeAgents.map((a, i) => {
          const agentProgress = Math.min(
            100,
            Math.max(8, progress + [4, -12, 0, -20][i]),
          );
          return (
            <div className="progress-card" key={a.id}>
              <div className="progress-head">
                <span className="agent-status">
                  <span className="green-dot" />
                  {agentProgress === 100 ? "Complete" : "Active"}
                </span>
                <strong>{a.name}</strong>
                <span className="progress-number">
                  {agentProgress}% complete
                </span>
              </div>
              <div className="agent-message">
                <small>Agent update</small>
                <p>{agentDetails[a.id].output}</p>
              </div>
              <div className="agent-message">
                <small>Preliminary finding</small>
                <p>
                  <span className="green-dot inline-block mr-1" />
                  {agentDetails[a.id].finding}
                </p>
              </div>
              <div className="agent-message">
                <small>Working...</small>
                <p>
                  {agentProgress === 100 ? (
                    <>
                      <Check size={12} className="inline mr-1" />
                      Review finished.
                    </>
                  ) : (
                    agentDetails[a.id].work
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="progress-footer">
        <CircleDot size={13} />
        {progress === 100
          ? "Analysis complete."
          : "Agents are working independently."}{" "}
        <button onClick={onFinish}>
          {progress === 100 ? "View report" : "Skip to report →"}
        </button>
      </div>
      <div className="ai-disclaimer">
        <ShieldCheck size={12} /> AI can make mistakes. Review findings before
        making changes.
      </div>
    </div>
  );
}
