import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Nomination() {
  const user = JSON.parse(localStorage.getItem('user'));
  const pfAccountId = user ? user.pf_account_id : 1;
  const [nomineeName, setNomineeName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [sharePercentage, setSharePercentage] = useState('');
  const [nominations, setNominations] = useState([]);
  const [message, setMessage] = useState('');

  const fetchNominations = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/nomination/${pfAccountId}`);
      setNominations(res.data);
    } catch (err) { console.log(err); }
  };

  const addNomination = async () => {
    try {
      await axios.post('http://localhost:5000/api/nomination/add', {
        pf_account_id: pfAccountId,
        nominee_name: nomineeName,
        relationship,
        share_percentage: sharePercentage
      });
      setMessage('success');
      setNomineeName(''); setRelationship(''); setSharePercentage('');
      fetchNominations();
    } catch (err) { setMessage('error'); }
  };

  useEffect(() => { fetchNominations(); }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px 40px', color: 'white'
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>👨‍👩‍👧 Nomination</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.85, fontSize: '15px' }}>Manage your PF nominees</p>
        </div>

        <div style={{ padding: '30px 40px' }}>
          {/* Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', marginBottom: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>➕ Add Nominee</h3>
            {message === 'success' && (
              <div style={{ backgroundColor: '#f0fff4', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                Nominee Added Successfully!
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>NOMINEE NAME</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="text" placeholder="Full Name"
                  value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} />
              </div>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>RELATIONSHIP</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="text" placeholder="e.g. Wife, Son"
                  value={relationship} onChange={(e) => setRelationship(e.target.value)} />
              </div>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>SHARE %</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="number" placeholder="e.g. 100"
                  value={sharePercentage} onChange={(e) => setSharePercentage(e.target.value)} />
              </div>
            </div>
            <button style={{
              padding: '13px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
            }} onClick={addNomination}>Add Nominee →</button>
          </div>

          {/* Nominees List */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>👥 Nominees List</h3>
            {nominations.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px' }}>
                {nominations.map((n, i) => (
                  <div key={i} style={{
                    backgroundColor: '#f8f8ff',
                    borderRadius: '12px',
                    padding: '20px',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <p style={{ fontSize: '24px', margin: '0 0 10px' }}>👤</p>
                    <h3 style={{ color: '#333', margin: '0 0 5px', fontSize: '16px' }}>{n.nominee_name}</h3>
                    <p style={{ color: '#667eea', margin: '0 0 5px', fontSize: '14px', fontWeight: '600' }}>{n.relationship}</p>
                    <p style={{ color: '#764ba2', margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{n.share_percentage}% Share</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                <p style={{ fontSize: '40px' }}>👤</p>
                <p>No nominees added yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nomination;
