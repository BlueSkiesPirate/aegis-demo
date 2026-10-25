import {
  BookOpen,
  ChevronDown,
  CircleCheck,
  CircleDot,
  Clock3,
  FileText,
  Menu,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { Analysis } from "../types";
interface Props {
  analyses: Analysis[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onLogout: () => void;
}
export default function Sidebar({
  analyses,
  activeId,
  onSelect,
  onNew,
  onLogout,
}: Props) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const filtered = analyses.filter((a) =>
    a.repository.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="brand">
        <ShieldCheck size={19} strokeWidth={1.8} className="text-emerald-700" />
        {!collapsed && <b>aegis</b>}
        <button
          className="icon-button ml-auto"
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={15} />
        </button>
      </div>
      {!collapsed && (
        <>
          <div className="sidebar-actions">
            <button className="sidebar-btn" onClick={onNew}>
              <Plus size={14} />
              New analysis <span className="ml-auto muted">⌘ K</span>
            </button>
            <div className="sidebar-search">
              <Search size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search analyses"
                aria-label="Search analyses"
              />
            </div>
          </div>
          <div className="history scrollbars">
            {(["Today", "Yesterday", "Previous 7 days"] as const).map(
              (group) => (
                <section key={group}>
                  <div className="section-label">{group}</div>
                  {filtered
                    .filter((a) => a.created === group)
                    .map((a) => (
                      <button
                        key={a.id}
                        className={`history-entry ${activeId === a.id ? "history-active" : ""}`}
                        onClick={() => onSelect(a.id)}
                      >
                        <span className="history-icon">
                          {a.status === "running" ? (
                            <CircleDot size={15} />
                          ) : a.status === "warning" ? (
                            <Clock3 size={15} />
                          ) : (
                            <FileText size={15} />
                          )}
                        </span>
                        <span className="history-copy">
                          <strong>{a.repository}</strong>
                          <small
                            className={
                              a.status === "warning"
                                ? "text-red-600"
                                : a.status === "running"
                                  ? "text-emerald-700"
                                  : ""
                            }
                          >
                            {a.status === "running"
                              ? "Analyzing · Agents working"
                              : a.status === "warning"
                                ? "4 critical, 10 warnings · Issues"
                                : "No findings · main"}
                          </small>
                        </span>
                      </button>
                    ))}
                </section>
              ),
            )}
            {filtered.length === 0 && (
              <p className="p-3 muted text-xs">No matching analyses.</p>
            )}
          </div>
          <div className="sidebar-bottom">
            <button
              className="footer-link"
              onClick={() =>
                window.open(
                  "https://github.com",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <BookOpen size={15} />
              Help & documentation
            </button>
            <button className="profile" onClick={onLogout}>
              <span className="avatar">JL</span>
              <span className="profile-text">
                <strong>Jamie Lee</strong>
                <small>Active workspace</small>
              </span>
              <ChevronDown size={14} />
            </button>
          </div>
        </>
      )}
      {collapsed && (
        <div className="mt-5 flex flex-col items-center gap-4">
          <button aria-label="New analysis" onClick={onNew}>
            <Plus size={18} />
          </button>
          <button aria-label="History" onClick={() => setCollapsed(false)}>
            <Clock3 size={18} />
          </button>
          <button aria-label="Log out" onClick={onLogout}>
            <CircleCheck size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
