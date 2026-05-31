import { styles } from './styles';
import { User } from '../api/client';

interface SkillTagProps { label: string; variant: 'knows' | 'wants'; }
export function SkillTag({ label, variant }: SkillTagProps) {
  return <span style={variant === 'knows' ? styles.tagSkill : styles.tagWants}>{label}</span>;
}

interface UserCardProps { user: User; currentUserId?: string; onSendRequest: (user: User) => void; }
export function UserCard({ user, currentUserId, onSendRequest }: UserCardProps) {
  const isOwnCard = user._id === currentUserId;
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{user.name}</div>
      {user.contact && <div style={styles.contactLine}>📬 {user.contact}</div>}
      <div style={{ height: 12 }} />
      <div style={styles.tagLabel}>Knows</div>
      <div style={styles.tagRow}>
        {user.skills.length > 0
          ? user.skills.map((s) => <SkillTag key={s} label={s} variant="knows" />)
          : <span style={{ fontSize: 13, color: '#9ca3af' }}>—</span>}
      </div>
      <div style={styles.tagLabel}>Wants to learn</div>
      <div style={styles.tagRow}>
        {user.wants.length > 0
          ? user.wants.map((w) => <SkillTag key={w} label={w} variant="wants" />)
          : <span style={{ fontSize: 13, color: '#9ca3af' }}>—</span>}
      </div>
      {!isOwnCard && (
        <button style={{ ...styles.btn, marginTop: 12 }} onClick={() => onSendRequest(user)}>
          Send Request
        </button>
      )}
    </div>
  );
}
