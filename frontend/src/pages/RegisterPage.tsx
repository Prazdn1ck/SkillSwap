import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { styles } from '../components/styles';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      navigate('/profile');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.page, maxWidth: 420 }}>
      <h1 style={styles.h1}>Create Account</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Join SkillSwap and start exchanging knowledge.</p>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="Your name" required />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="you@example.com" required />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Minimum 6 characters" minLength={6} required />
        </div>
        <button type="submit" style={{ ...styles.btn, width: '100%' }} disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
