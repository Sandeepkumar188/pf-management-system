import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function PFAccount() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : 1;
  const [account, setAccount] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/employee/account/${userId}`)
      .then(res => setAccount(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'Segoe UI, sans-serif'}}>
      <Sidebar />
      <div style={{flex:1,backgroundColor:'#f0f2f5',overflowY:'auto'}}>
        <div style={{
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding:'30px 40px',
          color:'white'
        }}>
          <h1 style={{fontSize:'26px',fontWeight:'bold',margin:0}}>👤 PF Account Details</h1>
          <p style={{margin:'5px 0 0',opacity:0.85,fontSize:'15px'}}>Your complete PF account information</p>
        </div>

        <div style={{padding:'30px 40px'}}>
          {account ? (
            <>
              {/* PF Number Card */}
              <div style={{
                background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius:'16px',
                padding:'25px',
                color:'white',
                marginBottom:'25px',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center'
              }}>
                <div>
                  <p style={{margin:'0 0 5px',opacity:0.8,fontSize:'13px'}}>PF Account Number</p>
                  <h2 style={{margin:0,fontSize:'28px',letterSpacing:'2px'}}>{account.pf_number}</h2>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{margin:'0 0 5px',opacity:0.8,fontSize:'13px'}}>Status</p>
                  <span style={{
                    backgroundColor:'rgba(255,255,255,0.2)',
                    padding:'5px 15px',
                    borderRadius:'20px',
                    fontSize:'14px',
                    fontWeight:'bold'
                  }}>{account.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Info Cards */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'20px',marginBottom:'25px'}}>
                {[
                  {label:'Employee Name', value:account.name, icon:'👤', color:'#667eea'},
                  {label:'Email', value:account.email, icon:'📧', color:'#764ba2'},
                  {label:'Basic Salary', value:`₹${account.basic_salary}`, icon:'💵', color:'#34a853'},
                  {label:'Role', value:account.role.toUpperCase(), icon:'🎯', color:'#ea4335'},
                ].map((item, i) => (
                  <div key={i} style={{
                    backgroundColor:'white',
                    borderRadius:'16px',
                    padding:'20px',
                    boxShadow:'0 2px 15px rgba(0,0,0,0.08)',
                    borderLeft:`4px solid ${item.color}`
                  }}>
                    <p style={{color:'#888',fontSize:'12px',margin:'0 0 8px',fontWeight:'600'}}>{item.icon} {item.label}</p>
                    <p style={{color:'#333',fontSize:'18px',margin:0,fontWeight:'bold'}}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Contribution Info */}
              <div style={{
                backgroundColor:'white',
                borderRadius:'16px',
                padding:'25px',
                boxShadow:'0 2px 15px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{margin:'0 0 20px',color:'#333'}}>💰 Monthly Contribution Breakdown</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'15px'}}>
                  {[
                    {label:'Employee Share (12%)', value:`₹${(account.basic_salary * 0.12).toFixed(2)}/month`, color:'#667eea', bg:'#f0eeff'},
                    {label:'Employer Share (12%)', value:`₹${(account.basic_salary * 0.12).toFixed(2)}/month`, color:'#34a853', bg:'#f0fff4'},
                    {label:'Total Monthly', value:`₹${(account.basic_salary * 0.24).toFixed(2)}/month`, color:'#764ba2', bg:'#faf0ff'},
                  ].map((item, i) => (
                    <div key={i} style={{
                      backgroundColor:item.bg,
                      borderRadius:'12px',
                      padding:'20px',
                      textAlign:'center'
                    }}>
                      <p style={{color:'#888',fontSize:'12px',margin:'0 0 8px',fontWeight:'600'}}>{item.label}</p>
                      <p style={{color:item.color,fontSize:'18px',margin:0,fontWeight:'bold'}}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{textAlign:'center',padding:'50px',color:'#888'}}>
              <p style={{fontSize:'50px'}}>⏳</p>
              <p>Loading account details...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PFAccount;
