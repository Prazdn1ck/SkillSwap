import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import RequestsPage from './pages/RequestsPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users"    element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/profile"  element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/requests" element={<PrivateRoute><RequestsPage /></PrivateRoute>} />
          <Route path="*"         element={<Navigate to="/users" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
