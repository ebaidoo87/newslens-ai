import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/news", label: "News" },
  { to: "/search", label: "Search" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#1f2937",
        padding: "24px",
      }}
    >
      <nav>
        {links.map((link) => (
          <div key={link.to} style={{ marginBottom: "16px" }}>
            <NavLink
              to={link.to}
              style={({ isActive }) => ({
                color: isActive ? "#60a5fa" : "#f3f4f6",
                fontWeight: isActive ? 700 : 400,
              })}
            >
              {link.label}
            </NavLink>
          </div>
        ))}
      </nav>
    </aside>
  );
}