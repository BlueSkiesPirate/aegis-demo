import {
  ArrowRight,
  CirclePlus,
  Github,
  Link2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import Dropdown from "../components/Dropdown";
import type { DropdownOption } from "../components/Dropdown";
import { agents } from "../data/mock";
import type { AgentId } from "../types";

const availableModels = ["Claude", "Gemini", "GPT-4", "Llama"];

interface ConfiguredAgent {
  instanceId: string;
  id: AgentId;
  name: string;
  description: string;
  model: string;
}

interface Props {
  onStart: (repository: string, enabled: AgentId[], context: string) => void;
}

// ── Setup page ───────────────────────────────────────────────────────────────

export default function Setup({ onStart }: Props) {
  const [configuredAgents, setConfiguredAgents] = useState<ConfiguredAgent[]>([
    {
      instanceId: "agent-1",
      id: agents[0].id,
      name: agents[0].name,
      description: agents[0].description,
      model: agents[0].model,
    },
  ]);
  const [repo, setRepo] = useState("https://github.com/acme/payment-service");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");

  const handleTypeChange = (instanceId: string, newId: string) => {
    const agentDef = agents.find((a) => a.id === newId);
    if (!agentDef) return;
    setConfiguredAgents((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, id: agentDef.id, name: agentDef.name, description: agentDef.description }
          : item,
      ),
    );
  };

  const handleModelChange = (instanceId: string, newModel: string) => {
    setConfiguredAgents((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId ? { ...item, model: newModel } : item,
      ),
    );
  };

  const handleRemoveAgent = (instanceId: string) => {
    setConfiguredAgents((prev) =>
      prev.filter((item) => item.instanceId !== instanceId),
    );
  };

  const handleAddAgent = () => {
    const nextFromPool =
      agents.find((a) => !configuredAgents.some((ca) => ca.id === a.id)) ||
      agents[configuredAgents.length % agents.length];

    const newAgent: ConfiguredAgent = {
      instanceId: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      id: nextFromPool.id,
      name: nextFromPool.name,
      description: nextFromPool.description,
      model: nextFromPool.model,
    };

    setConfiguredAgents((prev) => [...prev, newAgent]);
    setError("");
  };

  function submit() {
    if (
      !repo.trim() ||
      !repo.includes("github.com/") ||
      !repo.split("github.com/")[1]?.includes("/")
    ) {
      setError(
        "Enter a GitHub repository URL, such as https://github.com/acme/payment-service",
      );
      return;
    }
    if (configuredAgents.length === 0) {
      setError("Select at least one agent.");
      return;
    }
    setError("");
    onStart(
      repo
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/\/$/, "")
        .trim(),
      configuredAgents.map((a) => a.id),
      context,
    );
  }

  const agentTypeOptions: DropdownOption[] = agents.map((a) => ({
    value: a.id,
    label: a.name,
    sub: a.description,
  }));

  const modelOptions: DropdownOption[] = availableModels.map((m) => ({
    value: m,
    label: m,
  }));

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
        <div className="eyebrow">AI model configuration</div>
        <p className="helper">
          Choose the model for each agent independently. These selections apply
          only to this analysis run.
        </p>
        <div className="agent-selectors">
          {configuredAgents.map((agent) => (
            <div className="agent-select" key={agent.instanceId}>
              <span className="agent-main">
                <Dropdown
                  value={agent.id}
                  options={agentTypeOptions}
                  onChange={(val) => handleTypeChange(agent.instanceId, val)}
                  variant="type"
                  aria-label="Select agent type"
                />
                <span>{agent.description}</span>
                <small>Models: Gemini · Claude · GPT-4 · Llama</small>
              </span>
              <Dropdown
                value={agent.model}
                options={modelOptions}
                onChange={(val) => handleModelChange(agent.instanceId, val)}
                variant="model"
                aria-label={`Model for ${agent.name}`}
              />
              <button
                type="button"
                className="agent-remove-btn"
                title="Remove agent"
                aria-label={`Remove ${agent.name}`}
                onClick={() => handleRemoveAgent(agent.instanceId)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {configuredAgents.length === 0 && (
            <div className="agent-empty">
              No agents configured. Click &quot;Add agent&quot; below to add one.
            </div>
          )}
        </div>
        <button
          type="button"
          className="add-agent"
          onClick={handleAddAgent}
          aria-label="Add agent"
        >
          <CirclePlus size={18} />
          Add agent
        </button>
        <div className="field-label">
          <Github size={14} /> GitHub repository
        </div>
        <div className="repository-input">
          <Github size={16} />
          <input
            aria-label="GitHub repository"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/organization/repository"
          />
          <Link2 size={14} />
        </div>
        <div className="field-label">
          Extra context <span className="muted">Optional</span>
        </div>
        <div className="textarea-wrap">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value.slice(0, 5000))}
            placeholder="What should the agents know? Share areas to focus on, your tech stack, or any specific security concerns..."
          />
          <span>{context.length} / 5,000</span>
        </div>
        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}
        <div className="setup-actions">
          <div className="tiny-policy">
            <Sparkles size={13} />
            Default branch · Full security review
          </div>
          <button className="primary-btn" onClick={submit}>
            Start analysis <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <div className="setup-footer">
        ♧ Multi-agent code review &nbsp;&nbsp;&nbsp; ♧ Verified vulnerabilities
        &nbsp;&nbsp;&nbsp; ♧ Actionable report
      </div>
      <div className="ai-disclaimer">
        AI can make mistakes. Review findings before making changes.
      </div>
    </div>
  );
}
