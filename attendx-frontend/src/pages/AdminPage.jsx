import { useState, useEffect } from 'react';
import { Users, FileText, Check, X, Eye, Calendar } from 'lucide-react';
import api from '../utils/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'employees') {
        const { data } = await api.get('/admin/users');
        setEmployees(data || []);
      } else if (activeTab === 'attendance') {
        const { data } = await api.get('/admin/attendance');
        setAttendance(data || []);
      } else {
        const { data } = await api.get('/admin/leaves');
        console.log('ADMIN LEAVES DATA:', data);
        setLeaves(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await api.post('/admin/leaves/manage', { leaveId, status });
      alert(`Leave ${status} successfully!`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Admin Control Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your workforce and review attendance</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('employees')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'employees' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'employees' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Users size={18} style={{ marginRight: '0.5rem' }} /> Employees
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'attendance' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'attendance' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FileText size={18} style={{ marginRight: '0.5rem' }} /> All Attendance
        </button>
        <button 
          onClick={() => setActiveTab('leaves')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'leaves' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'leaves' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Calendar size={18} style={{ marginRight: '0.5rem' }} /> Leave Requests
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>
        ) : activeTab === 'employees' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-main)' }}>
              <tr>
                <th style={{ padding: '1.25rem' }}>Employee</th>
                <th style={{ padding: '1.25rem' }}>Role</th>
                <th style={{ padding: '1.25rem' }}>Joined</th>
                <th style={{ padding: '1.25rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: '600' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem', textTransform: 'capitalize' }}>{emp.role}</td>
                  <td style={{ padding: '1.25rem' }}>{new Date(emp.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '1rem', fontSize: '0.75rem' }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'attendance' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-main)' }}>
              <tr>
                <th style={{ padding: '1.25rem' }}>Employee</th>
                <th style={{ padding: '1.25rem' }}>Check In</th>
                <th style={{ padding: '1.25rem' }}>Check Out</th>
                <th style={{ padding: '1.25rem' }}>Total Hours</th>
                <th style={{ padding: '1.25rem' }}>Photo</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(rec => (
                <tr key={rec.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem' }}>{rec.users?.name || 'Unknown'}</td>
                  <td style={{ padding: '1.25rem' }}>{new Date(rec.check_in_time).toLocaleTimeString()}</td>
                  <td style={{ padding: '1.25rem' }}>{rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString() : '---'}</td>
                  <td style={{ padding: '1.25rem' }}>{rec.normal_hours || 0}h + {rec.overtime_hours || 0}h OT</td>
                  <td style={{ padding: '1.25rem' }}>
                    {rec.check_in_photo_url && (
                        <a href={rec.check_in_photo_url} target="_blank" rel="noreferrer">
                            <Eye size={18} color="var(--primary)" />
                        </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-main)' }}>
              <tr>
                <th style={{ padding: '1.25rem' }}>Employee</th>
                <th style={{ padding: '1.25rem' }}>Type</th>
                <th style={{ padding: '1.25rem' }}>Dates</th>
                <th style={{ padding: '1.25rem' }}>Reason</th>
                <th style={{ padding: '1.25rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem' }}>{leave.users?.name}</td>
                  <td style={{ padding: '1.25rem' }}>{leave.type}</td>
                  <td style={{ padding: '1.25rem' }}>{leave.from_date} to {leave.to_date} ({leave.days} days)</td>
                  <td style={{ padding: '1.25rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{leave.reason}</td>
                  <td style={{ padding: '1.25rem' }}>
                    {leave.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleLeaveAction(leave.id, 'approved')} className="btn" style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem' }}><Check size={16} /></button>
                        <button onClick={() => handleLeaveAction(leave.id, 'rejected')} className="btn" style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem' }}><X size={16} /></button>
                      </div>
                    ) : (
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem',
                        background: leave.status === 'approved' ? '#dcfce7' : '#fee2e2',
                        color: leave.status === 'approved' ? '#166534' : '#991b1b',
                        textTransform: 'capitalize'
                      }}>{leave.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
