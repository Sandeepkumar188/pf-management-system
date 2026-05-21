import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Contributions() {
  const user = JSON.parse(localStorage.getItem('user'));
  const pfAccountId = user ? user.pf_account_id : 1;
  const [basicSalary, setBasicSalary] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [contributions, setContributions] = useState([]);
  const [message, setMessage] = useState('');

  const addContribution = async () => {
    try {
      await axios.post('http://localhost:5000/api/contributions/add', {
        pf_account_id: pfAccountId, month, year, basic_salary: basicSalary
      });
      setMessage('success');
      fetchContributions();
      setBasicSalary(''); setMonth(''); setYear('');
    } catch (err) { setMessage('error'); }
  };

  const fetchContributions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/contributions/${pfAccountId}`);
      setContributions(res.data);
    } catch (err) { console.log(err); }
  };

  React.useEffect(() => { fetchContributions(); }, []);

  const totalBalance = contributions.reduce((sum, c) =>
    sum + parseFloat(c.employee_share) + parseFloat(c.employer_share) + parseFloat(c.interest), 0);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f0f2f5', overflowY: 'auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px 40px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>💰 Contributions</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.85, fontSize: '15px' }}>Track your monthly PF contributions</p>
        </div>

        <div style={{ padding: '30px 40px' }}>
          {/* Total Balance Card */}
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
              <p style={{ margin: '0 0 5px', opacity: 0.8, fontSize: '13px' }}>Total PF Balance</p>
              <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>₹{totalBalance.toFixed(2)}</h2>
            </div>
            <div style={{ fontSize: '50px' }}>💰</div>
          </div>

          {/* Add Contribution Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '25px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>➕ Add Monthly Contribution</h3>
            {message === 'success' && (
              <div style={{ backgroundColor: '#f0fff4', color: '#2e7d32', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                Contribution Added Successfully!
              </div>
            )}
            {message === 'error' && (
              <div style={{ backgroundColor: '#fff0f0', color: '#c62828', padding: '12px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #c62828' }}>
                ❌ Error adding contribution!
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>BASIC SALARY</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="number" placeholder="e.g. 25000"
                  value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
              </div>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>MONTH</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="text" placeholder="e.g. April"
                  value={month} onChange={(e) => setMonth(e.target.value)} />
              </div>
              <div>
                <label style={{ color: '#555', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>YEAR</label>
                <input style={{ padding: '13px', borderRadius: '10px', border: '2px solid #f0f0f0', fontSize: '14px', width: '100%', backgroundColor: '#f8f8ff', outline: 'none' }}
                  type="number" placeholder="e.g. 2026"
                  value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            </div>
            <button style={{
              padding: '13px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
            }} onClick={addContribution}>
              Add Contribution →
            </button>
          </div>

          {/* Contributions Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>📊 Contribution History</h3>
            {contributions.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f8ff' }}>
                    {['Month', 'Year', 'Employee Share', 'Employer Share', 'Interest', 'Total'].map((h, i) => (
                      <th key={i} style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((c, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>{c.month}</td>
                      <td style={{ padding: '12px', color: '#333' }}>{c.year}</td>
                      <td style={{ padding: '12px', color: '#667eea', fontWeight: '600' }}>₹{parseFloat(c.employee_share).toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#34a853', fontWeight: '600' }}>₹{parseFloat(c.employer_share).toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#ea4335', fontWeight: '600' }}>₹{parseFloat(c.interest).toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#764ba2', fontWeight: 'bold' }}>₹{(parseFloat(c.employee_share) + parseFloat(c.employer_share) + parseFloat(c.interest)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                <p style={{ fontSize: '40px' }}>📭</p>
                <p>No contributions yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contributions;
