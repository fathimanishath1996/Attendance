import Sidebar from './Sidebar';

const Layout = ({ children, user, setUser }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar user={user} setUser={setUser} />
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
