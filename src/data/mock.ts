import type { Agent, AgentId, Analysis } from "../types";
export const agents: Agent[] = [
  {
    id: "dependency",
    name: "Dependency agent",
    description: "Checks third-party libraries and transitive dependencies",
    model: "Claude",
  },
  {
    id: "secrets",
    name: "Secrets agent",
    description: "Detects hardcoded credentials, tokens, and sensitive files",
    model: "Claude",
  },
  {
    id: "access",
    name: "Access agent",
    description: "Reviews permissions, roles, and sensitive access patterns",
    model: "Llama",
  },
  {
    id: "logic",
    name: "Logic agent",
    description: "Inspects code flows, input handling, and logic weaknesses",
    model: "GPT-4",
  },
];
export const allAgentIds: AgentId[] = [
  "dependency",
  "secrets",
  "access",
  "logic",
];
export const initialAnalyses: Analysis[] = [
  {
    id: "demo-payment",
    repository: "acme/payment-service",
    status: "running",
    created: "Today",
    stage: "processing",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-customer",
    repository: "acme/customer-portal",
    status: "warning",
    created: "Today",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-api",
    repository: "acme/api",
    status: "complete",
    created: "Today",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-credential",
    repository: "credential_test",
    status: "complete",
    created: "Yesterday",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-auth",
    repository: "acme/auth-service",
    status: "complete",
    created: "Yesterday",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-gateway",
    repository: "acme/api-gateway",
    status: "complete",
    created: "Previous 7 days",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-express",
    repository: "express/express",
    status: "complete",
    created: "Previous 7 days",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
  {
    id: "demo-tools",
    repository: "acme/internal-tools",
    status: "complete",
    created: "Previous 7 days",
    stage: "report",
    enabled: allAgentIds,
    context: "",
  },
];
export const agentDetails: Record<
  AgentId,
  { finding: string; output: string; work: string }
> = {
  dependency: {
    finding: "3 known CVEs detected in transitive dependencies.",
    output:
      "Inspecting npm dependencies in payment-service/api and payment-service/web.",
    work: "Running npm audit, yarn why, and dependency graph checks.",
  },
  secrets: {
    finding: "2 hardcoded API keys were found in legacy setup scripts.",
    output:
      "Scanning configuration files, environment variables, and string literals.",
    work: "Running trufflehog, gitleaks, and regex-based secret detection.",
  },
  access: {
    finding:
      "5 admin routes are exposed without rate limiting or IP filtering.",
    output:
      "Analyzing role bindings, route permissions, and sensitive API handlers.",
    work: "Mapping IAM roles, route handlers, and permission boundaries.",
  },
  logic: {
    finding:
      "1 SQL query appears to be vulnerable to injection in the payment flow.",
    output:
      "Analyzing authentication handlers, SQL queries, and error handling paths.",
    work: "Running semantic code search, taint tracking, and logic-flow checks.",
  },
};
