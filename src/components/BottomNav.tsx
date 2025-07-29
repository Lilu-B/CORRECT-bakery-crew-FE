import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠', ariaLabel: 'Home' },
    { path: '/events', label: '📅', ariaLabel: 'Events' },
    { path: '/donations', label: '🐷', ariaLabel: 'Donations' },
    { path: '/messages', label: '💬', ariaLabel: 'Messages' }
  ];

  return (
    <nav 
      className="bottom-nav"
      role="navigation" 
      aria-label="Bottom navigation"
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          aria-label={item.ariaLabel} 
          style={{
            background: location.pathname === item.path ? '#eee' : 'transparent'
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;