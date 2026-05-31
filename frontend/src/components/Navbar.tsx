import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tokens } from "./styles";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? tokens.amber : tokens.textSec,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: 8,
    background: isActive ? "rgba(245,158,11,0.1)" : "transparent",
    transition: "color 0.2s, background 0.2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }

        .nav-logout:hover { border-color: ${tokens.textSec} !important; color: ${tokens.textPrimary} !important; }
        .nav-link:hover { color: ${tokens.textPrimary} !important; background: rgba(255,255,255,0.05) !important; }
        .nav-brand-dot { display: inline-block; width: 8px; height: 8px; background: ${tokens.amber}; border-radius: 50%; margin-right: 2px; }
      `}</style>

      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          height: 60,
          background: "rgba(13,17,23,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${tokens.border}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          to="/"
          style={{
            color: tokens.textPrimary,
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span className="nav-brand-dot" />
          SkillSwap
        </Link>

        {isLoggedIn ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <NavLink
              to="/users"
              className="nav-link"
              style={({ isActive }) => linkStyle(isActive)}
            >
              Browse
            </NavLink>
            <NavLink
              to="/requests"
              className="nav-link"
              style={({ isActive }) => linkStyle(isActive)}
            >
              Requests
            </NavLink>
            <NavLink
              to="/profile"
              className="nav-link"
              style={({ isActive }) => linkStyle(isActive)}
            >
              Profile
            </NavLink>
            <div
              style={{
                width: 1,
                height: 20,
                background: tokens.border,
                margin: "0 6px",
              }}
            />
            <span
              style={{ fontSize: 13, color: tokens.textMuted, fontWeight: 500 }}
            >
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="nav-logout"
              style={{
                background: "transparent",
                color: tokens.textMuted,
                border: `1px solid ${tokens.border}`,
                borderRadius: 8,
                padding: "5px 14px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                marginLeft: 8,
                transition: "border-color 0.2s, color 0.2s",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <NavLink
              to="/login"
              className="nav-link"
              style={({ isActive }) => linkStyle(isActive)}
            >
              Login
            </NavLink>
            <Link
              to="/register"
              style={{
                background: tokens.amber,
                color: "#000",
                textDecoration: "none",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                marginLeft: 4,
              }}
            >
              Get started
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
