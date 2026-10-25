import { ChevronDown, Github, ShieldCheck } from "lucide-react";
export default function Header({ onNew }: { onNew: () => void }) {
  return (
    <header className="topbar">
      <button onClick={onNew} className="topbar-title">
        New analysis <ChevronDown size={13} />
      </button>
      <div className="connected">
        <Github size={13} />
        GitHub connected <span className="green-dot" />
      </div>
    </header>
  );
}
