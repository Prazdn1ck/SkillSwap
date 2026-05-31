import { useState, useEffect } from 'react';
import { requestsAPI, SkillRequest } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { styles } from '../components/styles';

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await requestsAPI.getAll(); setRequests(data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try { await requestsAPI.updateStatus(id, status); load(); }
    catch { alert('Failed to update request'); }
  };

  const StatusBadge = ({ status }: { status: SkillRequest['status'] }) => {
    const styleMap = { pending: styles.badgePending, accepted: styles.badgeAccepted, rejected: styles.badgeRejected };
    return <span style={styleMap[status]}>{status}</span>;
  };

  const incoming = requests.filter((r) => r.to._id === user?._id);
  const outgoing = requests.filter((r) => r.from._id === user?._id);

  if (loading) return <div style={styles.page}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Requests</h1>

      <h2 style={{ ...styles.h2, marginTop: 8 }}>Incoming ({incoming.length})</h2>
      {incoming.length === 0 ? <p style={{ color: '#9ca3af', marginBottom: 32 }}>No incoming requests yet.</p> : incoming.map((r) => (
        <div key={r._id} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.cardTitle}>From: {r.from.name}</div>
              <div style={styles.cardSub}>{r.from.contact || r.from.email}</div>
              {r.message && <p style={{ fontSize: 14, color: '#374151', margin: '8px 0' }}>"{r.message}"</p>}
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <StatusBadge status={r.status} />
          </div>
          {r.status === 'pending' && (
            <div style={{ marginTop: 12 }}>
              <button style={styles.btnGreen} onClick={() => handleStatus(r._id, 'accepted')}>✓ Accept</button>
              <button style={styles.btnDanger} onClick={() => handleStatus(r._id, 'rejected')}>✕ Reject</button>
            </div>
          )}
          {r.status === 'accepted' && <div style={{ ...styles.contactLine, marginTop: 8 }}>Contact: {r.from.contact || r.from.email}</div>}
        </div>
      ))}

      <h2 style={{ ...styles.h2, marginTop: 8 }}>Sent ({outgoing.length})</h2>
      {outgoing.length === 0 ? <p style={{ color: '#9ca3af' }}>You haven't sent any requests yet.</p> : outgoing.map((r) => (
        <div key={r._id} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.cardTitle}>To: {r.to.name}</div>
              {r.message && <p style={{ fontSize: 14, color: '#374151', margin: '8px 0' }}>"{r.message}"</p>}
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <StatusBadge status={r.status} />
          </div>
          {r.status === 'accepted' && <div style={{ ...styles.contactLine, marginTop: 8 }}>Contact: {r.to.contact || r.to.email}</div>}
        </div>
      ))}
    </div>
  );
}
