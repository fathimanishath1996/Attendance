import { LayoutDashboard, Clock, Calendar, LogOut, User, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';

const Sidebar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStatus] = useState({ normal: 0, target: 180, overtime: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/attendance/summary');
      if (data) {
        setStatus({
          normal: data.total_normal_hours || 0,
          target: 180,
          overtime: data.total_overtime_hours || 0
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Clock, label: 'Attendance', path: '/attendance' },
    { icon: Calendar, label: 'Leaves', path: '/leaves' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (user.role === 'admin') {
    navItems.splice(1, 0, { icon: Shield, label: 'Admin Panel', path: '/admin' });
  }

  const progress = Math.min((stats.normal / stats.target) * 100, 100);

  return (
    <aside style={{ 
      width: 'var(--sidebar-width)', 
      background: 'var(--bg-card)', 
      borderRight: '1px solid var(--border)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
        AttendX
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <button 
            key={item.path}
            className="btn" 
            onClick={() => navigate(item.path)}
            style={{ 
              justifyContent: 'flex-start', 
              background: location.pathname === item.path ? 'var(--bg-main)' : 'transparent',
              color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-main)',
              padding: '0.75rem 1rem'
            }}
          >
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </nav>

      {/* Progress Section */}
      <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Monthly Target</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
          <div><strong>{Math.round(stats.normal)}h</strong> / {stats.target}h</div>
        </div>
      </div>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
          <div style={{ width: '36px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        </div>
        <button className="btn" style={{ justifyContent: 'flex-start', color: 'var(--danger)', padding: '0.5rem 1rem' }} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
