import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Claims() {
  const user = JSON.parse(localStorage.getItem('user'));
  const pfAccountId = user ? user.pf_account_id : 1;
  const [claimType, setClaimType] = useState('withdrawal');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState('');

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/claims/${pfAccountId}`);
      setClaims(res.data);
    } catch (err) { console.log(err); }
  };

  const addClaim = async () => {
    try {
      await axios.post('http://localhost:5000/api/claims/add', {
        pf_account_id: pfAccountId, claim_type: claimType, amount, reason
      });
      setMessage('success');
      setAmount(''); setReason('');
      fetchClaims();
    } catch (err) { setMessage('error'); }
  };

  useEffect(() => { fetchClaims(); }, []);

  const pending = claims.filter(c => c.status === 'pending').length;
  const approved = claims.filter(c => c.status === 'approved').length;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px 40px', color: 'white'
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>📝 Claims</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.85, fontSize: '15px' }}>Apply and track your PF claims</p>
        </div>

        <div style={{ padding: '30px 40px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '25px' }}>
            {[
              { label: 'Total Claims', value: claims.length, color: '#667eea', icon: '📋' },
              { label: 'Pending', value: pending, color: '#f57c00', icon: '⏳' },
              { label: 'Approved', value: approved, color: '#34a853', icon: '✅' },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', borderTop: `4px solid ${s.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#888', fontSize: '13px', margin: '0 0 5px', fontWeight: '600' }}>{s.label}</p>
                  <h2 style={{ color: s.color, fontSize: '28px', margin: 0, fontWeight: 'bold' }}>{s.value}</h2>
                </div>
                <span style={{ fontSize: '35px' }}>{s.icon}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', marginBottom: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>➕ Submit New Claim</h3>
            {message === 'success' && (
              <div style={{ backgroundColor: '#f0fff4', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                ✅ Claim Submitted Successfully!
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>CLAIM TYPE</label>
                <select style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="advance">Advance</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>AMOUNT</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="number" placeholder="Enter amount"
                  value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>REASON</label>
              <textarea style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none', resize: 'vertical' }}
                placeholder="Enter reason for claim" rows="3"
                value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <button style={{
              padding: '13px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
            }} onClick={addClaim}>Submit Claim →</button>
          </div>

          {/* Claims Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>📋 Claims History</h3>
            {claims.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f8ff' }}>
                    {['Type', 'Amount', 'Reason', 'Applied Date', 'Status'].map((h, i) => (
                      <th key={i} style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333', fontWeight: '500', textTransform: 'capitalize' }}>{c.claim_type}</td>
                      <td style={{ padding: '12px', color: '#667eea', fontWeight: '600' }}>₹{c.amount}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{c.reason}</td>
                      <td style={{ padding: '12px', color: '#888', fontSize: '13px' }}>
                        {c.applied_date ? new Date(c.applied_date).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: c.status === 'approved' ? '#f0fff4' : c.status === 'rejected' ? '#fff0f0' : '#fff8f0',
                          color: c.status === 'approved' ? '#2e7d32' : c.status === 'rejected' ? '#c62828' : '#f57c00'
                        }}>{c.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                <p style={{ fontSize: '40px' }}>📭</p>
                <p>No claims yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Claims;