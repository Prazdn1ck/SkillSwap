import { CSSProperties } from 'react';

const BLUE = '#2563eb';
const BLUE_LIGHT = '#eff6ff';
const GREEN = '#16a34a';
const ORANGE = '#ea580c';
const GRAY = '#6b7280';
const BORDER = '#e5e7eb';

export const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#111827' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 56, background: '#1e293b', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 20 },
  navLinks: { display: 'flex', gap: 16, alignItems: 'center' },
  navLink: { color: '#cbd5e1', textDecoration: 'none', fontSize: 14 },
  card: { border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 16 },
  cardTitle: { fontWeight: 600, fontSize: 18, marginBottom: 4 },
  cardSub: { color: GRAY, fontSize: 13, marginBottom: 12 },
  tagRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 8 },
  tagSkill: { background: BLUE_LIGHT, color: BLUE, borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 500 },
  tagWants: { background: '#fef9c3', color: '#854d0e', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 500 },
  tagLabel: { fontSize: 11, color: GRAY, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4 },
  btn: { background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  btnSmall: { background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13 },
  btnGreen: { background: GREEN, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginRight: 8 },
  btnDanger: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  btnOutline: { background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 14 },
  input: { width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, outline: 'none' },
  textarea: { width: '100%', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 80 },
  hint: { fontSize: 12, color: GRAY, marginTop: 4 },
  badgePending:  { background: '#fef9c3', color: '#854d0e', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  badgeAccepted: { background: '#dcfce7', color: GREEN,     borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  badgeRejected: { background: '#fee2e2', color: '#dc2626', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  error:   { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  success: { background: '#dcfce7', color: GREEN,    padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  h1: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  h2: { fontSize: 22, fontWeight: 700, marginBottom: 16 },
  filterRow: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' as const },
  contactLine: { fontSize: 13, color: ORANGE, marginTop: 4, fontWeight: 500 },
};
