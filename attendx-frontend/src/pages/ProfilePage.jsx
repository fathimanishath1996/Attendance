import { User, Mail, Shield, DollarSign, Calendar } from 'lucide-react';

const ProfilePage = ({ user }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Your Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal account details</p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '3rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'var(--primary)', 
            color: 'white', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.name || 'Employee'}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-main)', borderRadius: '1rem', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                {user.role}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Member since 2026</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--text-muted)" />
                <span>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={18} color="var(--text-muted)" />
                <span style={{ textTransform: 'capitalize' }}>{user.role} Access</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Employment Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <DollarSign size={18} color="var(--text-muted)" />
                <span>Salary: Hidden</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={18} color="var(--text-muted)" />
                <span>Shift: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn" style={{ border: '1px solid var(--border)', alignSelf: 'flex-start' }}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
