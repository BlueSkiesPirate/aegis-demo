export type Stage = "setup" | "processing" | "report";
export type AgentId = "dependency" | "secrets" | "access" | "logic";
export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  model: string;
}
export interface Analysis {
  id: string;
  repository: string;
  status: "running" | "complete" | "warning";
  created: string;
  stage: Stage;
  enabled: AgentId[];
  context: string;
}
