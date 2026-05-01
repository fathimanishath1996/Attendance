import { LayoutDashboard, LogOut, Clock, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const HomePage = ({ user }) => {
  const [stats, setStats] = useState({ normal: 0, target: 180, overtime: 0 });
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, statusRes] = await Promise.all([
        api.get('/attendance/summary'),
        api.get('/attendance/today')
      ]);
      setStats({
        normal: summaryRes.data.total_normal_hours || 0,
        target: 180,
        overtime: summaryRes.data.total_overtime_hours || 0
      });
      setTodayStatus(statusRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const progress = Math.min((stats.normal / stats.target) * 100, 100);

  return (
    <>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Welcome, {user.name || 'Employee'}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Here is your attendance overview for today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Hours</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{Math.round(stats.normal)} / {stats.target}</div>
          <div style={{ 
            height: '10px', 
            background: 'var(--border)', 
            borderRadius: '5px', 
            marginTop: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)' }}></div>
          </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overtime</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.overtime.toFixed(1)} h</div>
          <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: '600' }}>
            {stats.overtime > 0 ? 'Good job on the extra hours!' : 'On track for bonus'}
          </p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</h3>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              padding: '0.5rem 1rem', 
              background: todayStatus ? (todayStatus.check_out_time ? '#e2e8f0' : '#dcfce7') : '#fee2e2', 
              color: todayStatus ? (todayStatus.check_out_time ? 'var(--text-muted)' : '#166534') : 'var(--danger)',
              borderRadius: '2rem',
              fontSize: '1rem',
              fontWeight: '700'
            }}>
              {!todayStatus ? 'Not Checked In' : (todayStatus.check_out_time ? 'Shift Completed' : 'Present')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent History</h2>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No records found for this month.
        </div>
      </div>
    </>
  );
};

export default HomePage;
