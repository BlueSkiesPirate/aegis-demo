import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Processing from "./pages/Processing";
import Report from "./pages/Report";
import { initialAnalyses } from "./data/mock";
import type { AgentId, Analysis } from "./types";
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
  useEffect(
    () => localStorage.setItem("aegis-analyses", JSON.stringify(analyses)),
    [analyses],
  );
  const active = analyses.find((a) => a.id === activeId);
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
  function start(repository: string, enabled: AgentId[], context: string) {
    const next: Analysis = {
      id: crypto.randomUUID(),
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
  }
  function finish() {
    if (!activeId) return;
    setAnalyses((prev) =>
      prev.map((a) =>
        a.id === activeId ? { ...a, stage: "report", status: "warning" } : a,
      ),
    );
  }
  function select(id: string) {
    setActiveId(id);
    setProgress(34);
  }
  if (!loggedIn) return <Login onLogin={login} />;
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
        <Header onNew={() => setActiveId(null)} />
        <main className="main-area">
          {!active ? (
            <Setup onStart={start} />
          ) : active.stage === "processing" ? (
            <Processing
              repository={active.repository}
              enabled={active.enabled}
              progress={progress}
              onFinish={finish}
            />
          ) : (
            <Report
              repository={active.repository}
              enabled={active.enabled}
              onNew={() => setActiveId(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
