import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Employer() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [editSalary, setEditSalary] = useState({});

  const months = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employee/all');
      setEmployees(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const updateSalary = async (userId, name) => {
    const salary = editSalary[userId];
    if (!salary || salary <= 0) {
      setMessage('Please enter valid salary!');
      setMessageType('error');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/employee/salary/${userId}`, {
        basic_salary: salary
      });
      setMessage(`✅ Salary updated for ${name}!`);
      setMessageType('success');
      fetchEmployees();
      setEditSalary(prev => ({ ...prev, [userId]: '' }));
    } catch (err) {
      setMessage('Error updating salary!');
      setMessageType('error');
    }
  };

  const runPayroll = async () => {
    if (!window.confirm(`Run payroll for ${selectedMonth} ${selectedYear}?`)) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/contributions/payroll', {
        month: selectedMonth,
        year: selectedYear
      });
      setMessage(res.data.message);
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payroll failed!');
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', height:'100vh', fontFamily:'Segoe UI, sans-serif'}}>
      <Sidebar />
      <div style={{flex:1, backgroundColor:'#f0f2f5', overflowY:'auto'}}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding:'25px 30px', color:'white'
        }}>
          <h1 style={{fontSize:'22px', fontWeight:'bold', margin:0}}>
            🏢 Employer Dashboard
          </h1>
          <p style={{margin:'5px 0 0', opacity:0.85, fontSize:'14px'}}>
            Manage employees and run monthly payroll
          </p>
        </div>

        <div style={{padding:'25px 30px'}}>

          {/* Message */}
          {message && (
            <div style={{
              backgroundColor: messageType==='success' ? '#f0fff4' : '#fff0f0',
              color: messageType==='success' ? '#2e7d32' : '#c62828',
              padding:'15px', borderRadius:'10px', marginBottom:'20px',
              borderLeft: `4px solid ${messageType==='success' ? '#2e7d32' : '#c62828'}`,
              fontWeight:'600'
            }}>
              {message}
            </div>
          )}

          {/* Stats */}
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:'15px', marginBottom:'25px'
          }}>
            {[
              {icon:'👥', label:'Total Employees', value:employees.length, color:'#667eea'},
              {icon:'✅', label:'Active Employees', value:employees.filter(e=>e.status==='active').length, color:'#34a853'},
              {icon:'💰', label:'Total Salary', value:`₹${employees.reduce((s,e)=>s+parseFloat(e.basic_salary||0),0).toLocaleString()}`, color:'#764ba2'},
            ].map((card,i) => (
              <div key={i} style={{
                backgroundColor:'white', borderRadius:'12px', padding:'20px',
                boxShadow:'0 2px 10px rgba(0,0,0,0.08)', borderTop:`4px solid ${card.color}`
              }}>
                <div style={{fontSize:'25px', marginBottom:'8px'}}>{card.icon}</div>
                <p style={{color:'#888', fontSize:'12px', margin:'0 0 5px', fontWeight:'600'}}>{card.label}</p>
                <h2 style={{color:card.color, fontSize:'22px', margin:0, fontWeight:'bold'}}>{card.value}</h2>
              </div>
            ))}
          </div>

          {/* Payroll Section */}
          <div style={{
            backgroundColor:'white', borderRadius:'12px', padding:'25px',
            boxShadow:'0 2px 10px rgba(0,0,0,0.08)', marginBottom:'25px'
          }}>
            <h3 style={{margin:'0 0 20px', color:'#333', fontSize:'16px'}}>
              💼 Run Monthly Payroll
            </h3>
            <div style={{display:'flex', gap:'15px', alignItems:'center', flexWrap:'wrap'}}>
              <div>
                <label style={{color:'#555', fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px'}}>SELECT MONTH</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{padding:'10px 15px', borderRadius:'10px', border:'2px solid #f0f0f0', fontSize:'14px', backgroundColor:'#f8f8ff', outline:'none'}}>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:'#555', fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'6px'}}>SELECT YEAR</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{padding:'10px 15px', borderRadius:'10px', border:'2px solid #f0f0f0', fontSize:'14px', backgroundColor:'#f8f8ff', outline:'none'}}>
                  {[2023,2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div style={{marginTop:'22px'}}>
                <button
                  onClick={runPayroll}
                  disabled={loading}
                  style={{
                    padding:'11px 25px',
                    background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color:'white', border:'none', borderRadius:'10px',
                    fontSize:'14px', fontWeight:'bold', cursor:'pointer'
                  }}>
                  {loading ? '⏳ Processing...' : '🚀 Run Payroll'}
                </button>
              </div>
            </div>
            <p style={{color:'#888', fontSize:'12px', marginTop:'15px', margin:'15px 0 0'}}>
              ⚡ Yeh button sab active employees ka 12% employee + 12% employer share automatically calculate karke add karega!
            </p>
          </div>

          {/* Employees Table */}
          <div style={{
            backgroundColor:'white', borderRadius:'12px', padding:'25px',
            boxShadow:'0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{margin:'0 0 20px', color:'#333', fontSize:'16px'}}>
              👥 All Employees ({employees.length})
            </h3>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{backgroundColor:'#f8f8ff'}}>
                  {['Name','Email','PF Number','Current Salary','Update Salary','Status'].map((h,i) => (
                    <th key={i} style={{padding:'12px', textAlign:'left', color:'#666', fontSize:'13px', fontWeight:'600'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} style={{borderTop:'1px solid #f0f0f0'}}>
                    <td style={{padding:'12px', color:'#333', fontWeight:'500'}}>{emp.name}</td>
                    <td style={{padding:'12px', color:'#667eea', fontSize:'13px'}}>{emp.email}</td>
                    <td style={{padding:'12px', color:'#764ba2', fontWeight:'600'}}>{emp.pf_number || 'N/A'}</td>
                    <td style={{padding:'12px', color:'#34a853', fontWeight:'bold'}}>₹{parseFloat(emp.basic_salary||0).toLocaleString()}</td>
                    <td style={{padding:'12px'}}>
                      <div style={{display:'flex', gap:'8px'}}>
                        <input
                          type="number"
                          placeholder="New salary"
                          value={editSalary[emp.id] || ''}
                          onChange={(e) => setEditSalary(prev => ({...prev, [emp.id]: e.target.value}))}
                          style={{padding:'8px', borderRadius:'8px', border:'2px solid #f0f0f0', fontSize:'13px', width:'110px', outline:'none'}}
                        />
                        <button
                          onClick={() => updateSalary(emp.id, emp.name)}
                          style={{padding:'8px 12px', backgroundColor:'#667eea', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'bold'}}>
                          Update
                        </button>
                      </div>
                    </td>
                    <td style={{padding:'12px'}}>
                      <span style={{
                        padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold',
                        backgroundColor: emp.status==='active' ? '#f0fff4' : '#f5f5f5',
                        color: emp.status==='active' ? '#2e7d32' : '#888'
                      }}>{emp.status || 'N/A'}</span>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#888'}}>No employees found!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employer;
