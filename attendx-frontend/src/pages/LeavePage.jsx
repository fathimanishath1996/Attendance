import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const LeavePage = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [type, setType] = useState('Annual');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get('/leaves');
      setLeaves(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', { type, from_date: from, to_date: to, reason });
      alert("Leave request submitted!");
      setShowModal(false);
      fetchLeaves();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Leaves</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your time off requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Apply Leave
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Annual Allowance</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>20 Days</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Used</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0 Days</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Remaining</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>20 Days</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>My Requests</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem' }}>Type</th>
              <th style={{ padding: '1.25rem' }}>Duration</th>
              <th style={{ padding: '1.25rem' }}>Reason</th>
              <th style={{ padding: '1.25rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? leaves.map(leave => (
              <tr key={leave.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem' }}><strong>{leave.type}</strong></td>
                <td style={{ padding: '1.25rem' }}>{leave.from_date} to {leave.to_date}</td>
                <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{leave.reason}</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.875rem',
                    background: leave.status === 'approved' ? '#dcfce7' : (leave.status === 'rejected' ? '#fee2e2' : '#fef9c3'),
                    color: leave.status === 'approved' ? '#166534' : (leave.status === 'rejected' ? '#991b1b' : '#854d0e')
                  }}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Placeholder */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Apply for Leave</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Leave Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <option>Annual</option>
                  <option>Sick</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>From</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>To</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Reason</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minHeight: '100px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Request</button>
                <button type="button" className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
