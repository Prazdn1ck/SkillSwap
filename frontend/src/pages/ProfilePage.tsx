import { useState, useEffect, useRef } from "react";
import { usersAPI, User } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { SkillTag } from "../components/UserCard";
import { tokens } from "../components/styles";

const splitSkills = (str: string) =>
  str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const inputStyle = (focused: boolean) => ({
  width: "100%",
  padding: "11px 14px",
  background: tokens.bg,
  border: `1px solid ${focused ? tokens.amber : tokens.border}`,
  borderRadius: 10,
  fontSize: 14,
  color: tokens.textPrimary,
  boxSizing: "border-box" as const,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  fontStretch: "normal" as const,
  letterSpacing: "normal" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxShadow: focused ? "0 0 0 3px rgba(245,158,11,0.1)" : "none",
});

export default function ProfilePage() {
  const { user: authUser, login, token } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    skills: "",
    wants: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarDragging, setAvatarDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authUser) return;
    usersAPI.getById(authUser._id).then(({ data }) => {
      setProfile(data);
      setForm({
        name: data.name,
        contact: data.contact,
        skills: data.skills.join(", "),
        wants: data.wants.join(", "),
      });
      // Load saved avatar from localStorage
      const saved = localStorage.getItem(`avatar_${data._id}`);
      if (saved) setAvatarPreview(saved);
    });
  }, [authUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await usersAPI.updateProfile({
        name: form.name,
        contact: form.contact,
        skills: splitSkills(form.skills),
        wants: splitSkills(form.wants),
      });
      setProfile(data);
      if (token) login(token, data);
      setEditing(false);
      setSuccess("Profile updated!");
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
      if (profile) localStorage.setItem(`avatar_${profile._id}`, result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setAvatarDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarFile(file);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    if (profile) localStorage.removeItem(`avatar_${profile._id}`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: tokens.textMuted,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading profile…
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "'DM Sans', sans-serif",
        fontStretch: "normal",
        color: tokens.textPrimary,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: tokens.amber,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            marginBottom: 0,
          }}
        >
          My Profile
        </div>
      </div>

      {success && (
        <div
          style={{
            background: tokens.greenBg,
            color: tokens.green,
            border: `1px solid rgba(74,222,128,0.2)`,
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 24,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ✓ {success}
        </div>
      )}
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
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {!editing ? (
        <div>
          {/* Avatar + identity */}
          <div
            style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 20,
              padding: "28px",
              marginBottom: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 24,
              }}
            >
              {/* Avatar display */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: avatarPreview
                    ? "transparent"
                    : "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(45,212,191,0.2))",
                  border: `1px solid ${tokens.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 500,
                      fontSize: 22,
                      color: tokens.amber,
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 500,
                    fontSize: 20,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {profile.name}
                </div>
                <div
                  style={{ color: tokens.textSec, fontSize: 13, marginTop: 2 }}
                >
                  {profile.email}
                </div>
                {profile.contact && (
                  <div
                    style={{
                      color: tokens.amber,
                      fontSize: 13,
                      marginTop: 3,
                      fontWeight: 500,
                    }}
                  >
                    📬 {profile.contact}
                  </div>
                )}
              </div>
            </div>

            {/* Stat chips */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: 10,
                  padding: "8px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 500,
                    fontSize: 22,
                    color: tokens.amber,
                  }}
                >
                  {profile.skills.length}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: tokens.textMuted,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Skills
                </div>
              </div>
              <div
                style={{
                  background: "rgba(45,212,191,0.08)",
                  border: "1px solid rgba(45,212,191,0.18)",
                  borderRadius: 10,
                  padding: "8px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 500,
                    fontSize: 22,
                    color: tokens.teal,
                  }}
                >
                  {profile.wants.length}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: tokens.textMuted,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Wants
                </div>
              </div>
            </div>

            {/* Skills section */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: tokens.textMuted,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                I know
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                {profile.skills.length > 0 ? (
                  profile.skills.map((s) => (
                    <SkillTag key={s} label={s} variant="knows" />
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: tokens.textMuted }}>
                    No skills added yet
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: 10,
                  color: tokens.textMuted,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                I want to learn
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.wants.length > 0 ? (
                  profile.wants.map((w) => (
                    <SkillTag key={w} label={w} variant="wants" />
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: tokens.textMuted }}>
                    Nothing added yet
                  </span>
                )}
              </div>
            </div>

            <button
              style={{
                marginTop: 24,
                background: "transparent",
                color: tokens.amber,
                border: `1px solid ${tokens.amber}`,
                borderRadius: 10,
                padding: "10px 22px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = tokens.amber;
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = tokens.amber;
              }}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 20,
            padding: "28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 24,
              marginTop: 0,
            }}
          >
            Edit Profile
          </h2>

          {/* Avatar upload */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: 10,
                fontSize: 13,
                color: tokens.textSec,
                letterSpacing: "0.02em",
              }}
            >
              Profile Photo
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Current avatar preview */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: avatarPreview
                    ? "transparent"
                    : "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(45,212,191,0.2))",
                  border: `1px solid ${tokens.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 24,
                      color: tokens.amber,
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>

              {/* Drop zone / upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setAvatarDragging(true);
                }}
                onDragLeave={() => setAvatarDragging(false)}
                onDrop={handleDrop}
                style={{
                  flex: 1,
                  border: `2px dashed ${avatarDragging ? tokens.amber : tokens.border}`,
                  borderRadius: 12,
                  padding: "16px 20px",
                  cursor: "pointer",
                  textAlign: "center",
                  background: avatarDragging
                    ? "rgba(245,158,11,0.05)"
                    : "transparent",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>📷</div>
                <div
                  style={{
                    fontSize: 13,
                    color: tokens.textSec,
                    fontWeight: 500,
                  }}
                >
                  Click or drag image here
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: tokens.textMuted,
                    marginTop: 3,
                  }}
                >
                  JPG, PNG, WEBP — max 5MB
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: "none" }}
              />
            </div>

            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                style={{
                  marginTop: 10,
                  background: "transparent",
                  color: tokens.red,
                  border: `1px solid rgba(248,113,113,0.3)`,
                  borderRadius: 8,
                  padding: "5px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Remove photo
              </button>
            )}
          </div>

          <hr
            style={{
              border: "none",
              borderTop: `1px solid ${tokens.border}`,
              margin: "0 0 24px",
            }}
          />

          <form onSubmit={handleSave}>
            {[
              {
                name: "name",
                label: "Name",
                placeholder: "Your name",
                type: "text",
              },
              {
                name: "contact",
                label: "Contact (email or Telegram)",
                placeholder: "@username or you@example.com",
                type: "text",
              },
              {
                name: "skills",
                label: "Skills I know",
                placeholder: "Python, SQL, Django",
                type: "text",
              },
              {
                name: "wants",
                label: "Skills I want to learn",
                placeholder: "React, TypeScript, Docker",
                type: "text",
              },
            ].map(({ name, label, placeholder, type }) => (
              <div key={name} style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 7,
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
                />
                {(name === "skills" || name === "wants") && (
                  <div
                    style={{
                      fontSize: 12,
                      color: tokens.textMuted,
                      marginTop: 5,
                    }}
                  >
                    Separate with commas
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: saving ? tokens.border : tokens.amber,
                  color: saving ? tokens.textMuted : "#000",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 22px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                style={{
                  background: "transparent",
                  color: tokens.textSec,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 10,
                  padding: "11px 22px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
