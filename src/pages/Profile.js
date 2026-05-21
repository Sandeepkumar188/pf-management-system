import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
      window.location.href = '/';
      return;
    }
    setUser(savedUser);
    setName(savedUser.name || '');

    axios.get(`http://localhost:5000/api/employee/account/${savedUser.id}`)
      .then(res => {
        setBasicSalary(res.data.basic_salary || '');
        setEmail(res.data.email || '');
      }).catch(err => console.log(err));
  }, []);

  const updateProfile = async () => {
    if (!user) return;
    try {
      await axios.put('http://localhost:5000/api/auth/update-profile', {
        user_id: user.id, name, email, basic_salary: basicSalary
      });
      const updatedUser = { ...user, name, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfileMsg('success');
      setProfileError('');
    } catch (err) {
      setProfileError('Error updating profile!');
    }
  };

  const updatePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters!');
      return;
    }
    try {
      await axios.put('http://localhost:5000/api/auth/update-password', {
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword
      });
      setPasswordMsg('success');
      setPasswordError('');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPasswordError('Current password is incorrect!');
    }
  };

  if (!user) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px 40px', color: 'white'
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>👤 Profile Settings</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.85, fontSize: '15px' }}>Manage your account</p>
        </div>

        <div style={{ padding: '30px 40px' }}>
          {/* Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px', padding: '25px', color: 'white',
            marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <div style={{
              width: '80px', height: '80px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '35px', flexShrink: 0
            }}>👤</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{user.name}</h2>
              <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '14px' }}>{user.role.toUpperCase()}</p>
              <p style={{ margin: '3px 0 0', opacity: 0.7, fontSize: '13px' }}>ID: {user.id}</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            {[
              { tab: 'profile', label: '✏️ Edit Profile' },
              { tab: 'password', label: '🔒 Change Password' },
            ].map((item, i) => (
              <button key={i} onClick={() => setActiveTab(item.tab)} style={{
                padding: '10px 20px',
                background: activeTab === item.tab
                  ? 'linear-gradient(135deg, #667eea, #764ba2)'
                  : 'white',
                color: activeTab === item.tab ? 'white' : '#666',
                border: activeTab === item.tab ? 'none' : '2px solid #e0e0e0',
                borderRadius: '10px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600'
              }}>{item.label}</button>
            ))}
          </div>

          {/* Edit Profile */}
          {activeTab === 'profile' && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>✏️ Edit Profile</h3>
              {profileMsg === 'success' && (
                <div style={{ backgroundColor: '#f0fff4', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                  Profile Updated Successfully!
                </div>
              )}
              {profileError && (
                <div style={{ backgroundColor: '#fff0f0', color: '#c62828', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #c62828' }}>
                  ❌ {profileError}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px', marginBottom: '20px' }}>
                {[
                  { label: 'FULL NAME', value: name, set: setName, type: 'text', placeholder: 'Enter full name' },
                  { label: 'EMAIL ADDRESS', value: email, set: setEmail, type: 'email', placeholder: 'Enter email' },
                  { label: 'BASIC SALARY', value: basicSalary, set: setBasicSalary, type: 'number', placeholder: 'Enter basic salary' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                    <input
                      style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                      type={field.type} placeholder={field.placeholder}
                      value={field.value} onChange={(e) => field.set(e.target.value)}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>ROLE</label>
                  <input
                    style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f0f0f0', outline: 'none' }}
                    type="text" value={user.role.toUpperCase()} disabled
                  />
                </div>
              </div>
              <button onClick={updateProfile} style={{
                padding: '13px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
              }}>Update Profile →</button>
            </div>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>🔒 Change Password</h3>
              {passwordMsg === 'success' && (
                <div style={{ backgroundColor: '#f0fff4', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                  Password Updated Successfully!
                </div>
              )}
              {passwordError && (
                <div style={{ backgroundColor: '#fff0f0', color: '#c62828', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #c62828' }}>
                  ❌ {passwordError}
                </div>
              )}
              <div style={{ maxWidth: '400px' }}>
                {[
                  { label: 'CURRENT PASSWORD', value: currentPassword, set: setCurrentPassword, placeholder: 'Enter current password' },
                  { label: 'NEW PASSWORD', value: newPassword, set: setNewPassword, placeholder: 'Enter new password' },
                  { label: 'CONFIRM PASSWORD', value: confirmPassword, set: setConfirmPassword, placeholder: 'Confirm new password' },
                ].map((field, i) => (
                  <div key={i} style={{ marginBottom: '15px' }}>
                    <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                    <input
                      style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                      type="password" placeholder={field.placeholder}
                      value={field.value} onChange={(e) => field.set(e.target.value)}
                    />
                  </div>
                ))}
                <button onClick={updatePassword} style={{
                  padding: '13px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
                }}>Update Password →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
