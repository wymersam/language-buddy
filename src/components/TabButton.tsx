export const TabButton = ({
  id,
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  id: "chat" | "profile" | "exercises" | "vocabulary";
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  active: boolean;
  onClick: (id: "chat" | "profile" | "exercises" | "vocabulary") => void;
  badge?: number;
}) => (
  <button
    onClick={() => onClick(id)}
    className={`nav-button ${active ? "active" : ""}`}
  >
    <Icon size={22} className="icon" />
    <span>{label}</span>
    {badge && badge > 0 && <span className="nav-badge">{badge}</span>}
  </button>
);
