import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthView, setIsAuthView] = useState(false);

  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

  useEffect(() => {
    const currentUrl = location.pathname;
    setIsAuthView(authRoutes.some(route => currentUrl.startsWith(route)));
  }, [location.pathname]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await authService.logout();
      navigate('/login');
    }
  };

  if (isAuthView) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-container">
        <div className="app-header">
          <div className="header-content">
            <div className="header-left">
              <img 
                src="/images/comply_crafter_logo.png" 
                alt="ComplyCrafter Logo" 
                className="logo" 
              />
            </div>
            <div className="header-right">
              <div className="user-info">
                <span className="user-icon">👤</span>
                <span className="user-name">{authService.getUserDisplayName()}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </div>
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;



