import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
    
  const handleLogout = () => {
    
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ width: 240, background: '#222', color: '#fff', padding: 20 }}>
        <h2>Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <NavLink to="/dashboard/products" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/projects" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })}>
              Projects
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/dashboard/items" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white' })}>
              Items
            </NavLink>
          </li> */}
          <li style={{ marginTop: 20 }}>
            <button onClick={handleLogout} style={{ background: 'red', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main style={{ flexGrow: 1, padding: 20, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
