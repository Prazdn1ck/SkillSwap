import { useState, useEffect } from 'react';
import { usersAPI, User } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SkillTag } from '../components/UserCard';
import { styles } from '../components/styles';

const splitSkills = (str: string) => str.split(',').map((s) => s.trim()).filter(Boolean);

export default function ProfilePage() {
  const { user: authUser, login, token } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', contact: '', skills: '', wants: '' });

  useEffect(() => {
    if (!authUser) return;
    usersAPI.getById(authUser._id).then(({ data }) => {
      setProfile(data);
      setForm({ name: data.name, contact: data.contact, skills: data.skills.join(', '), wants: data.wants.join(', ') });
    });
  }, [authUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const { data } = await usersAPI.updateProfile({ name: form.name, contact: form.contact, skills: splitSkills(form.skills), wants: splitSkills(form.wants) });
      setProfile(data);
      if (token) login(token, data);
      setEditing(false);
      setSuccess('Profile saved!');
    } catch {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div style={styles.page}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>My Profile</h1>
      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {!editing ? (
        <div style={styles.card}>
          <div style={styles.cardTitle}>{profile.name}</div>
          <div style={styles.cardSub}>{profile.email}</div>
          {profile.contact && <div style={styles.contactLine}>📬 {profile.contact}</div>}
          <div style={{ height: 16 }} />
          <div style={styles.tagLabel}>I know</div>
          <div style={styles.tagRow}>
            {profile.skills.length > 0 ? profile.skills.map((s) => <SkillTag key={s} label={s} variant="knows" />) : <span style={{ fontSize: 13, color: '#9ca3af' }}>No skills added yet</span>}
          </div>
          <div style={styles.tagLabel}>I want to learn</div>
          <div style={styles.tagRow}>
            {profile.wants.length > 0 ? profile.wants.map((w) => <SkillTag key={w} label={w} variant="wants" />) : <span style={{ fontSize: 13, color: '#9ca3af' }}>Nothing added yet</span>}
          </div>
          <button style={{ ...styles.btn, marginTop: 16 }} onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form style={styles.card} onSubmit={handleSave}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contact (email or Telegram)</label>
            <input name="contact" value={form.contact} onChange={handleChange} style={styles.input} placeholder="@username or you@example.com" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Skills I know</label>
            <input name="skills" value={form.skills} onChange={handleChange} style={styles.input} placeholder="Python, SQL, Django" />
            <div style={styles.hint}>Separate with commas</div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Skills I want to learn</label>
            <input name="wants" value={form.wants} onChange={handleChange} style={styles.input} placeholder="React, TypeScript, Docker" />
            <div style={styles.hint}>Separate with commas</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={styles.btn} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" style={styles.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
