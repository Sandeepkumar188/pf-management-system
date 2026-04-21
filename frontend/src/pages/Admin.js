import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchData = () => {
    axios.get('http://localhost:5000/api/admin/stats').then(res => setStats(res.data));
    axios.get('http://localhost:5000/api/admin/users').then(res => setUsers(res.data));
    axios.get('http://localhost:5000/api/admin/claims').then(res => setClaims(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const updateClaim = async (id, status) => {
    await axios.put(`http://localhost:5000/api/admin/claims/${id}`, { status });
    fetchData();
  };

  const deleteUser = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
        alert('Deleted!');
        fetchData();
      } catch (err) { alert('Error!'); }
    }
  };

  const makeAdmin = async (id, name, currentRole) => {
    if (currentRole === 'admin') {
      if (window.confirm(`Remove admin from ${name}?`)) {
        await axios.put(`http://localhost:5000/api/admin/users/${id}/remove-admin`);
        alert(`${name} is now Employee!`);
        fetchData();
      }
    } else {
      if (window.confirm(`Make ${name} Admin?`)) {
        await axios.put(`http://localhost:5000/api/admin/users/${id}/make-admin`);
        alert(`${name} is now Admin!`);
        fetchData();
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const currentPath = window.location.pathname;

  const menuItems = [
    { icon: '📊', label: 'Dashboard', tab: 'dashboard' },
    { icon: '👥', label: 'Users', tab: 'users' },
    { icon: '📝', label: 'Claims', tab: 'claims' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Sidebar — Same as Employee */}
      <div style={{
        width: '200px',
        background: 'linear-gradient(180deg, #4a3f8f 0%, #6b21a8 50%, #581c87 100%)',
        display: 'flex', flexDirection: 'column',
        height: '100vh',
        boxShadow: '4px 0 15px rgba(0,0,0,0.2)'
      }}>
        {/* Logo */}
        <div style={{
          padding: '25px 15px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '35px', marginBottom: '8px' }}>⚙️</div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Admin Panel</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: '3px 0 0' }}>PF Management</p>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, padding: '15px 10px', overflowY: 'auto' }}>
          {menuItems.map((item, i) => {
            const isActive = activeTab === item.tab;
            return (
              <div key={i} onClick={() => setActiveTab(item.tab)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
                padding: '10px 12px', marginBottom: '4px',
                borderRadius: '10px', fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
                borderLeft: isActive ? '3px solid white' : '3px solid transparent',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* User Info */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '10px 12px', marginBottom: '10px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '30px', height: '30px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '14px'
            }}>⚙️</div>
            <div>
              <p style={{ color: 'white', margin: 0, fontSize: '12px', fontWeight: '600' }}>Admin</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '2px 0 0', fontSize: '10px' }}>ADMINISTRATOR</p>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '10px', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600'
          }}>🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4a3f8f 0%, #6b21a8 100%)',
          padding: '25px 40px', color: 'white'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {activeTab === 'dashboard' ? '📊 Dashboard' :
              activeTab === 'users' ? '👥 Users Management' : '📝 Claims Management'}
          </h1>
          <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '14px' }}>Manage PF System</p>
        </div>

        <div style={{ padding: '30px 40px' }}>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginBottom: '25px' }}>
                {[
                  { label: 'Total Users', value: stats.totalUsers || 0, color: '#667eea', icon: '👥' },
                  { label: 'Total Accounts', value: stats.totalAccounts || 0, color: '#34a853', icon: '🏦' },
                  { label: 'Pending Claims', value: stats.pendingClaims || 0, color: '#ea4335', icon: '⏳' },
                  { label: 'Total Fund', value: `₹${parseFloat(stats.totalFund || 0).toFixed(0)}`, color: '#764ba2', icon: '💰' },
                ].map((card, i) => (
                  <div key={i} style={{
                    backgroundColor: 'white', borderRadius: '16px', padding: '25px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)', borderTop: `4px solid ${card.color}`
                  }}>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px', fontWeight: '600' }}>{card.icon} {card.label}</p>
                    <h2 style={{ color: card.color, fontSize: '28px', margin: 0, fontWeight: 'bold' }}>{card.value}</h2>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 20px', color: '#333' }}>⏳ Pending Claims</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f8ff' }}>
                      {['Employee', 'PF No', 'Type', 'Amount', 'Action'].map((h, i) => (
                        <th key={i} style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {claims.filter(c => c.status === 'pending').map((c, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>{c.name}</td>
                        <td style={{ padding: '12px', color: '#667eea' }}>{c.pf_number}</td>
                        <td style={{ padding: '12px', textTransform: 'capitalize' }}>{c.claim_type}</td>
                        <td style={{ padding: '12px', color: '#764ba2', fontWeight: 'bold' }}>₹{c.amount}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => updateClaim(c.id, 'approved')} style={{ padding: '6px 12px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontSize: '12px' }}> Approve</button>
                          <button onClick={() => updateClaim(c.id, 'rejected')} style={{ padding: '6px 12px', backgroundColor: '#ea4335', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>❌ Reject</button>
                        </td>
                      </tr>
                    ))}
                    {claims.filter(c => c.status === 'pending').length === 0 && (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}> No pending claims!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#333' }}>👥 All Users ({users.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f8ff' }}>
                    {['Name', 'Email', 'Role', 'PF No', 'Salary', 'Status', 'Actions'].map((h, i) => (
                      <th key={i} style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>{u.name}</td>
                      <td style={{ padding: '12px', color: '#667eea', fontSize: '13px' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: u.role === 'admin' ? '#fff0f0' : '#f0eeff',
                          color: u.role === 'admin' ? '#c62828' : '#667eea'
                        }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#764ba2', fontWeight: '600' }}>{u.pf_number || 'N/A'}</td>
                      <td style={{ padding: '12px', color: '#34a853', fontWeight: '600' }}>₹{u.basic_salary || '0'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: u.status === 'active' ? '#f0fff4' : '#f5f5f5',
                          color: u.status === 'active' ? '#2e7d32' : '#888'
                        }}>{u.status || 'N/A'}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => makeAdmin(u.id, u.name, u.role)} style={{
                            padding: '6px 10px',
                            backgroundColor: u.role === 'admin' ? '#f57c00' : '#667eea',
                            color: 'white', border: 'none',
                            borderRadius: '8px', cursor: 'pointer',
                            fontSize: '11px', fontWeight: 'bold'
                          }}>
                            {u.role === 'admin' ? '👤 Remove' : '⭐ Admin'}
                          </button>
                          {u.role !== 'admin' && (
                            <button onClick={() => deleteUser(u.id, u.name)} style={{
                              padding: '6px 10px', backgroundColor: '#ea4335',
                              color: 'white', border: 'none',
                              borderRadius: '8px', cursor: 'pointer',
                              fontSize: '11px', fontWeight: 'bold'
                            }}>🗑️</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Claims */}
          {activeTab === 'claims' && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#333' }}>📝 All Claims ({claims.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f8ff' }}>
                    {['Employee', 'Type', 'Amount', 'Reason', 'Status', 'Action'].map((h, i) => (
                      <th key={i} style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>{c.name}</td>
                      <td style={{ padding: '12px', textTransform: 'capitalize' }}>{c.claim_type}</td>
                      <td style={{ padding: '12px', color: '#764ba2', fontWeight: 'bold' }}>₹{c.amount}</td>
                      <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>{c.reason}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: c.status === 'approved' ? '#f0fff4' : c.status === 'rejected' ? '#fff0f0' : '#fff8f0',
                          color: c.status === 'approved' ? '#2e7d32' : c.status === 'rejected' ? '#c62828' : '#f57c00'
                        }}>{c.status.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {c.status === 'pending' && (
                          <>
                            <button onClick={() => updateClaim(c.id, 'approved')} style={{ padding: '6px 12px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontSize: '12px' }}></button>
                            <button onClick={() => updateClaim(c.id, 'rejected')} style={{ padding: '6px 12px', backgroundColor: '#ea4335', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>❌</button>
                          </>
                        )}
                        {c.status !== 'pending' && <span style={{ color: '#888', fontSize: '13px' }}>Done </span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
