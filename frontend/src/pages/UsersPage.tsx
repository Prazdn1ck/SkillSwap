import { useState, useEffect } from 'react';
import { usersAPI, requestsAPI, User } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { UserCard } from '../components/UserCard';
import { styles } from '../components/styles';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [wantsFilter, setWantsFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: { skill?: string; wants?: string } = {};
      if (skillFilter) params.skill = skillFilter;
      if (wantsFilter) params.wants = wantsFilter;
      const { data } = await usersAPI.getAll(params);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSendRequest = async () => {
    if (!selectedUser) return;
    setSending(true); setRequestMsg('');
    try {
      await requestsAPI.send({ to: selectedUser._id, message });
      setRequestMsg('✅ Request sent!');
      setTimeout(() => { setSelectedUser(null); setMessage(''); setRequestMsg(''); }, 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send request';
      setRequestMsg(`❌ ${msg}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Browse Users</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Find someone to exchange skills with.</p>

      <div style={styles.filterRow}>
        <input style={{ ...styles.input, width: 200 }} placeholder="They know (e.g. Python)" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} />
        <input style={{ ...styles.input, width: 200 }} placeholder="They want (e.g. React)" value={wantsFilter} onChange={(e) => setWantsFilter(e.target.value)} />
        <button style={styles.btn} onClick={loadUsers}>Filter</button>
        <button style={styles.btnOutline} onClick={() => { setSkillFilter(''); setWantsFilter(''); setTimeout(loadUsers, 0); }}>Clear</button>
      </div>

      {loading ? <p>Loading users...</p> : users.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No users found. Try different filters.</p>
      ) : users.map((u) => (
        <UserCard key={u._id} user={u} currentUserId={currentUser?._id} onSendRequest={setSelectedUser} />
      ))}

      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ ...styles.card, width: 420, margin: 0 }}>
            <h2 style={styles.h2}>Send Request to {selectedUser.name}</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message (optional)</label>
              <textarea style={styles.textarea} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi! I know Python and I'd love to learn React from you..." />
            </div>
            {requestMsg && <div style={requestMsg.startsWith('✅') ? styles.success : styles.error}>{requestMsg}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={styles.btn} onClick={handleSendRequest} disabled={sending}>{sending ? 'Sending...' : 'Send Request'}</button>
              <button style={styles.btnOutline} onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
