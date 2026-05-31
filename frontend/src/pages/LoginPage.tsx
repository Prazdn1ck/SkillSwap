import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../components/styles";

const inputStyle = (focused: boolean) => ({
  width: "100%",
  padding: "12px 16px",
  background: tokens.bg,
  border: `1px solid ${focused ? tokens.amber : tokens.border}`,
  borderRadius: 12,
  fontSize: 15,
  color: tokens.textPrimary,
  boxSizing: "border-box" as const,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxShadow: focused ? "0 0 0 3px rgba(245,158,11,0.12)" : "none",
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      login(data.token, data.user);
      navigate("/users");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: tokens.amber,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Welcome back
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 38,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              color: tokens.textPrimary,
              lineHeight: 1.05,
              marginBottom: 10,
            }}
          >
            Log in to
            <br />
            <span style={{ color: tokens.amber }}>SkillSwap</span>
          </h1>
          <p style={{ color: tokens.textSec, fontSize: 15, lineHeight: 1.5 }}>
            Find your next skill exchange partner.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 20,
            padding: "32px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          }}
        >
          {error && (
            <div
              style={{
                background: tokens.redBg,
                color: tokens.red,
                border: `1px solid rgba(248,113,113,0.2)`,
                padding: "12px 16px",
                borderRadius: 10,
                marginBottom: 24,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: 8,
                  fontSize: 13,
                  color: tokens.textSec,
                  letterSpacing: "0.02em",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === "email")}
                placeholder="you@example.com"
                required
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: 8,
                  fontSize: 13,
                  color: tokens.textSec,
                  letterSpacing: "0.02em",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === "password")}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? tokens.border : tokens.amber,
                color: loading ? tokens.textMuted : "#000",
                border: "none",
                borderRadius: 12,
                padding: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
                transition: "opacity 0.2s, background 0.2s",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 14,
              color: tokens.textMuted,
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{
                color: tokens.amber,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
