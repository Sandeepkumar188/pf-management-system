import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function KYC() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : 1;
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [kycData, setKycData] = useState(null);
  const [message, setMessage] = useState('');

  const fetchKYC = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/kyc/${userId}`);
      if (res.data.length > 0) setKycData(res.data[0]);
    } catch (err) { console.log(err); }
  };

  const submitKYC = async () => {
    try {
      await axios.post('http://localhost:5000/api/kyc/add', {
        user_id: userId,
        aadhaar_number: aadhaar,
        pan_number: pan,
        bank_account: bankAccount,
        ifsc_code: ifsc
      });
      setMessage('success');
      fetchKYC();
    } catch (err) { setMessage('error'); }
  };

  useEffect(() => { fetchKYC(); }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px 40px', color: 'white'
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>🪪 KYC Details</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.85, fontSize: '15px' }}>Know Your Customer verification</p>
        </div>

        <div style={{ padding: '30px 40px' }}>
          {kycData ? (
            <>
              {/* KYC Status Card */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '25px',
                color: 'white',
                marginBottom: '25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px', opacity: 0.8, fontSize: '13px' }}>KYC Status</p>
                  <h2 style={{ margin: 0, fontSize: '24px' }}> KYC Submitted!</h2>
                </div>
                <span style={{
                  backgroundColor: kycData.status === 'verified' ? 'rgba(100,255,100,0.3)' : 'rgba(255,200,0,0.3)',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  border: '2px solid rgba(255,255,255,0.4)'
                }}>
                  {kycData.status.toUpperCase()}
                </span>
              </div>

              {/* KYC Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
                {[
                  { label: 'Aadhaar Number', value: kycData.aadhaar_number, icon: '🪪', color: '#667eea' },
                  { label: 'PAN Number', value: kycData.pan_number, icon: '📄', color: '#764ba2' },
                  { label: 'Bank Account', value: kycData.bank_account, icon: '🏦', color: '#34a853' },
                  { label: 'IFSC Code', value: kycData.ifsc_code, icon: '🔢', color: '#ea4335' },
                ].map((item, i) => (
                  <div key={i} style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                    borderLeft: `4px solid ${item.color}`
                  }}>
                    <p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px', fontWeight: '600' }}>{item.icon} {item.label}</p>
                    <p style={{ color: '#333', fontSize: '18px', margin: 0, fontWeight: 'bold' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>📋 Submit KYC</h3>
              {message === 'success' && (
                <div style={{ backgroundColor: '#f0fff4', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                  KYC Submitted Successfully!
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '15px', marginBottom: '20px' }}>
                {[
                  { label: 'AADHAAR NUMBER', placeholder: '12-digit Aadhaar', value: aadhaar, set: setAadhaar },
                  { label: 'PAN NUMBER', placeholder: '10-digit PAN', value: pan, set: setPan },
                  { label: 'BANK ACCOUNT NUMBER', placeholder: 'Account number', value: bankAccount, set: setBankAccount },
                  { label: 'IFSC CODE', placeholder: 'e.g. SBI0001234', value: ifsc, set: setIfsc },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                    <input
                      style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                      type="text" placeholder={field.placeholder}
                      value={field.value} onChange={(e) => field.set(e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button style={{
                padding: '13px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
              }} onClick={submitKYC}>Submit KYC →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KYC;
