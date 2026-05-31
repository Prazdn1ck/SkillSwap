import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styles } from './styles';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.navBrand}>⚡ SkillSwap</Link>
      {isLoggedIn ? (
        <div style={styles.navLinks}>
          <Link to="/users" style={styles.navLink}>Browse Users</Link>
          <Link to="/requests" style={styles.navLink}>Requests</Link>
          <Link to="/profile" style={styles.navLink}>My Profile ({user?.name})</Link>
          <button onClick={handleLogout} style={styles.btnSmall}>Logout</button>
        </div>
      ) : (
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" style={styles.navLink}>Register</Link>
        </div>
      )}
    </nav>
  );
}
