import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      setError('All fields are required!');
      return;
    }
    if (phone.length !== 10) {
      setError('Enter valid 10 digit mobile number!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role, phone
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  const features = [
    { icon: '💰', label: 'Track Contributions' },
    { icon: '📄', label: 'View Statements' },
    { icon: '📝', label: 'Apply Claims' },
    { icon: '🪪', label: 'Manage KYC' },
    { icon: '👥', label: 'Nominations' },
    { icon: '🏦', label: 'PF Account' },
  ];

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      {/* Left Side */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        color: 'white', padding: '60px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '20px', padding: '40px',
          textAlign: 'center', maxWidth: '400px', width: '100%'
        }}>
          <div style={{ fontSize: '55px', marginBottom: '15px' }}>🏦</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            PF Management System
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.6', marginBottom: '25px' }}>
            Your complete solution for managing Provident Fund accounts
          </p>

          {/* Feature Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '14px 10px',
                fontSize: '13px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={{
        width: '450px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '50px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px 0 0 30px',
        borderLeft: '1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{ width: '60px', height: '5px', backgroundColor: 'white', borderRadius: '5px', marginBottom: '25px' }} />

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>
              Registration Successful!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', fontSize: '15px' }}>
              Your account has been created.<br />You can now login.
            </p>
            <button onClick={() => window.location.href = '/'} style={{
              padding: '15px 40px', backgroundColor: 'white', color: '#764ba2',
              border: 'none', borderRadius: '12px', fontSize: '16px',
              fontWeight: 'bold', cursor: 'pointer'
            }}>
              Go to Login →
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '5px' }}>
              Create Account
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '25px', fontSize: '14px' }}>
              Fill your details to register
            </p>

            {error && (
              <div style={{ backgroundColor: 'rgba(255,0,0,0.2)', color: 'white', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid rgba(255,100,100,0.8)' }}>
                ❌ {error}
              </div>
            )}

            {[
              { label: 'FULL NAME', value: name, set: setName, type: 'text', placeholder: 'Enter full name' },
              { label: 'EMAIL ADDRESS', value: email, set: setEmail, type: 'email', placeholder: 'Enter your email' },
              { label: 'PASSWORD', value: password, set: setPassword, type: 'password', placeholder: 'Min 6 characters' },
              { label: 'MOBILE NUMBER', value: phone, set: setPhone, type: 'tel', placeholder: '10 digit mobile number' },
            ].map((field, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input
                  style={{ padding: '13px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  type={field.type} placeholder={field.placeholder}
                  value={field.value} onChange={(e) => field.set(e.target.value)}
                />
              </div>
            ))}

            <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>ROLE</label>
            <select
              style={{ padding: '13px 16px', marginBottom: '25px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', outline: 'none', width: '100%' }}
              value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee" style={{ color: '#333' }}>Employee</option>
              <option value="employer" style={{ color: '#333' }}>Employer</option>
            </select>

            <button onClick={handleRegister} disabled={loading} style={{
              padding: '15px', backgroundColor: 'white', color: '#764ba2',
              border: 'none', borderRadius: '12px', fontSize: '16px',
              fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', width: '100%'
            }}>
              {loading ? '⏳ Registering...' : 'Register →'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
              Already have account?{' '}
              <a href="/" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>Login Here</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;