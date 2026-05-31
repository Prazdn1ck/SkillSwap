import { CSSProperties } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Theme: Dark editorial — deep navy + warm amber accent
// Fonts: 'Syne' (display), 'DM Sans' (body)  — loaded via index.html

export const tokens = {
  bg: "#0d1117", // page background
  surface: "#161b27", // card / panel background
  surfaceHov: "#1c2333", // hovered surface
  border: "#2a3348", // default border
  borderHov: "#3d4f6e", // hovered / focused border
  amber: "#f59e0b", // primary accent
  amberLight: "#fef3c7", // amber tint
  amberDark: "#92400e", // amber deep
  teal: "#2dd4bf", // secondary accent
  tealLight: "#0d3d38", // teal tint
  textPrimary: "#f1f5f9",
  textSec: "#8892a4",
  textMuted: "#4b5a72",
  red: "#f87171",
  redBg: "#2d1515",
  green: "#4ade80",
  greenBg: "#0d2b1a",
  yellow: "#fbbf24",
  yellowBg: "#2b1f05",
};

export const styles: Record<string, CSSProperties> = {
  // ── Layout ──────────────────────────────────────────────────────────────────
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "36px 24px 80px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: tokens.textPrimary,
    minHeight: "100vh",
  },

  // ── Navigation ──────────────────────────────────────────────────────────────
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    height: 60,
    background: "rgba(13,17,23,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${tokens.border}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    color: tokens.textPrimary,
    textDecoration: "none",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navLinks: {
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  navLink: {
    color: tokens.textSec,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: 8,
    transition: "color 0.2s, background 0.2s",
  },

  // ── Cards ───────────────────────────────────────────────────────────────────
  card: {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 16,
    padding: "24px",
    marginBottom: 16,
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 20,
    color: tokens.textPrimary,
    marginBottom: 4,
    letterSpacing: "-0.02em",
  },
  cardSub: {
    color: tokens.textSec,
    fontSize: 13,
    marginBottom: 14,
    fontWeight: 400,
  },

  // ── Skill tags ───────────────────────────────────────────────────────────────
  tagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginBottom: 10,
  },
  tagSkill: {
    background: "rgba(245,158,11,0.12)",
    color: tokens.amber,
    border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
  tagWants: {
    background: "rgba(45,212,191,0.10)",
    color: tokens.teal,
    border: "1px solid rgba(45,212,191,0.22)",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
  tagLabel: {
    fontSize: 10,
    color: tokens.textMuted,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 6,
    marginTop: 4,
  },

  // ── Buttons ─────────────────────────────────────────────────────────────────
  btn: {
    background: tokens.amber,
    color: "#000",
    border: "none",
    borderRadius: 10,
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.01em",
    transition: "opacity 0.15s, transform 0.1s",
  },
  btnSmall: {
    background: "transparent",
    color: tokens.textSec,
    border: `1px solid ${tokens.border}`,
    borderRadius: 8,
    padding: "5px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, color 0.2s",
  },
  btnOutline: {
    background: "transparent",
    color: tokens.textSec,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, color 0.2s",
  },
  btnGreen: {
    background: tokens.green,
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "7px 16px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    marginRight: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
  btnDanger: {
    background: tokens.red,
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "7px 16px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
  },

  // ── Forms ───────────────────────────────────────────────────────────────────
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: 7,
    fontSize: 13,
    color: tokens.textSec,
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: tokens.bg,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    fontSize: 14,
    color: tokens.textPrimary,
    boxSizing: "border-box" as const,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "11px 14px",
    background: tokens.bg,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    fontSize: 14,
    color: tokens.textPrimary,
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    minHeight: 90,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  },
  hint: {
    fontSize: 12,
    color: tokens.textMuted,
    marginTop: 5,
  },

  // ── Badges ──────────────────────────────────────────────────────────────────
  badgePending: {
    background: tokens.yellowBg,
    color: tokens.yellow,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  badgeAccepted: {
    background: tokens.greenBg,
    color: tokens.green,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  badgeRejected: {
    background: tokens.redBg,
    color: tokens.red,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },

  // ── Alerts ──────────────────────────────────────────────────────────────────
  error: {
    background: tokens.redBg,
    color: tokens.red,
    border: `1px solid rgba(248,113,113,0.2)`,
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 500,
  },
  success: {
    background: tokens.greenBg,
    color: tokens.green,
    border: `1px solid rgba(74,222,128,0.2)`,
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 500,
  },

  // ── Typography ──────────────────────────────────────────────────────────────
  h1: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 6,
    letterSpacing: "-0.02em",
    color: tokens.textPrimary,
    lineHeight: 1.15,
    fontStretch: "normal" as const,
  },
  h2: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 16,
    letterSpacing: "-0.01em",
    color: tokens.textPrimary,
    lineHeight: 1.25,
    fontStretch: "normal" as const,
  },

  // ── Misc ─────────────────────────────────────────────────────────────────────
  filterRow: {
    display: "flex",
    gap: 10,
    marginBottom: 28,
    flexWrap: "wrap" as const,
    alignItems: "center",
  },
  contactLine: {
    fontSize: 13,
    color: tokens.amber,
    marginTop: 4,
    fontWeight: 500,
  },
  divider: {
    border: "none",
    borderTop: `1px solid ${tokens.border}`,
    margin: "24px 0",
  },
};
