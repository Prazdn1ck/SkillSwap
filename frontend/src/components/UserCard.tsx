import { useState } from "react";
import { tokens } from "./styles";
import { User } from "../api/client";

interface SkillTagProps {
  label: string;
  variant: "knows" | "wants";
}
export function SkillTag({ label, variant }: SkillTagProps) {
  return (
    <span
      style={
        variant === "knows"
          ? {
              background: "rgba(245,158,11,0.12)",
              color: tokens.amber,
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.01em",
            }
          : {
              background: "rgba(45,212,191,0.10)",
              color: tokens.teal,
              border: "1px solid rgba(45,212,191,0.22)",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.01em",
            }
      }
    >
      {label}
    </span>
  );
}

const tagLabel = {
  fontSize: 10,
  color: tokens.textMuted,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  marginBottom: 6,
  marginTop: 12,
};

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onSendRequest: (user: User) => void;
}

export function UserCard({
  user,
  currentUserId,
  onSendRequest,
}: UserCardProps) {
  const isOwnCard = user._id === currentUserId;
  const [hovered, setHovered] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatar = localStorage.getItem(`avatar_${user._id}`);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.surface,
        border: `1px solid ${hovered ? tokens.borderHov : tokens.border}`,
        borderRadius: 16,
        padding: "22px 24px",
        marginBottom: 14,
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
        boxShadow: hovered
          ? "0 6px 24px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              overflow: "hidden",
              background: avatar
                ? "transparent"
                : "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(45,212,191,0.2))",
              border: `1px solid ${tokens.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={user.name}
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
                  fontSize: 15,
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
                fontWeight: 700,
                fontSize: 18,
                color: tokens.textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              {user.name}
            </div>

            {user.contact && (
              <div
                style={{
                  fontSize: 12,
                  color: tokens.amber,
                  marginTop: 2,
                  fontWeight: 500,
                }}
              >
                📬 {user.contact}
              </div>
            )}
          </div>
        </div>

        {!isOwnCard && (
          <button
            onClick={() => onSendRequest(user)}
            style={{
              background: hovered ? tokens.amber : "transparent",
              color: hovered ? "#000" : tokens.amber,
              border: `1px solid ${tokens.amber}`,
              borderRadius: 10,
              padding: "8px 18px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s, color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            Connect →
          </button>
        )}
      </div>

      <div style={{ marginTop: 6 }}>
        <div style={tagLabel}>Knows</div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 2 }}
        >
          {user.skills.length > 0 ? (
            user.skills.map((s) => (
              <SkillTag key={s} label={s} variant="knows" />
            ))
          ) : (
            <span style={{ fontSize: 12, color: tokens.textMuted }}>—</span>
          )}
        </div>

        <div style={tagLabel}>Wants to learn</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {user.wants.length > 0 ? (
            user.wants.map((w) => (
              <SkillTag key={w} label={w} variant="wants" />
            ))
          ) : (
            <span style={{ fontSize: 12, color: tokens.textMuted }}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}
