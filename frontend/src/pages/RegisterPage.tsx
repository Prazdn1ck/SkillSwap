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

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      navigate("/profile");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full name",
      type: "text",
      placeholder: "Jane Smith",
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Minimum 6 characters",
      minLength: 6,
    },
  ];

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
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "5%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
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
        {/* Features strip */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          {["Find skill partners", "Share knowledge", "Grow together"].map(
            (f) => (
              <span
                key={f}
                style={{
                  background: "rgba(45,212,191,0.08)",
                  border: "1px solid rgba(45,212,191,0.18)",
                  color: tokens.teal,
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ✓ {f}
              </span>
            ),
          )}
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
          Create your
          <br />
          <span style={{ color: tokens.teal }}>account</span>
        </h1>
        <p style={{ color: tokens.textSec, fontSize: 15, marginBottom: 32 }}>
          Join SkillSwap and start exchanging knowledge.
        </p>

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
            {fields.map(({ name, label, type, placeholder, minLength }) => (
              <div key={name} style={{ marginBottom: 20 }}>
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
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === name)}
                  placeholder={placeholder}
                  minLength={minLength}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? tokens.border : tokens.teal,
                color: loading ? tokens.textMuted : "#000",
                border: "none",
                borderRadius: 12,
                padding: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s",
                marginTop: 8,
              }}
            >
              {loading ? "Creating account…" : "Join SkillSwap →"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: tokens.amber,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
