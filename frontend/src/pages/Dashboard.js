import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const pfAccountId = user ? user.pf_account_id : 1;

  const [totalBalance, setTotalBalance] = useState(0);
  const [contributions, setContributions] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      window.location.href = '/admin';
      return;
    }
    if (user && user.role === 'employer') {
      window.location.href = '/employer';
      return;
    }
    axios.get(`http://localhost:5000/api/statement/${pfAccountId}`)
      .then(res => {
        const total = res.data.reduce((sum, s) => sum + parseFloat(s.total), 0);
        setTotalBalance(total);
        setContributions(res.data);
      });
    axios.get(`http://localhost:5000/api/claims/${pfAccountId}`)
      .then(res => setClaims(res.data));
  }, []);

  const pendingClaims = claims.filter(c => c.status === 'pending').length;
  const approvedClaims = claims.filter(c => c.status === 'approved').length;
  const thisMonth = contributions.length > 0
    ? parseFloat(contributions[contributions.length-1].total).toFixed(2) : '0.00';

  const lineData = {
    labels: contributions.map(c => `${c.month} ${c.year}`),
    datasets: [
      {
        label: 'Employee Share',
        data: contributions.map(c => parseFloat(c.employee_share)),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102,126,234,0.1)',
        tension: 0.4, fill: true
      },
      {
        label: 'Employer Share',
        data: contributions.map(c => parseFloat(c.employer_share)),
        borderColor: '#764ba2',
        backgroundColor: 'rgba(118,75,162,0.1)',
        tension: 0.4, fill: true
      },
      {
        label: 'Total',
        data: contributions.map(c => parseFloat(c.total)),
        borderColor: '#34a853',
        backgroundColor: 'rgba(52,168,83,0.1)',
        tension: 0.4, fill: true
      }
    ]
  };

  const doughnutData = {
    labels: ['Employee Share', 'Employer Share', 'Interest'],
    datasets: [{
      data: [
        contributions.reduce((s,c) => s + parseFloat(c.employee_share), 0),
        contributions.reduce((s,c) => s + parseFloat(c.employer_share), 0),
        contributions.reduce((s,c) => s + parseFloat(c.interest), 0),
      ],
      backgroundColor: ['#667eea', '#764ba2', '#34a853'],
      borderWidth: 0
    }]
  };

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'Segoe UI, sans-serif'}}>
      <Sidebar />
      <div style={{flex:1,backgroundColor:'#f0f2f5',overflowY:'auto'}}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding:'25px 30px',color:'white'
        }}>
          <h1 style={{fontSize:'22px',fontWeight:'bold',margin:0}}>
            👋 Welcome back, {user ? user.name : 'User'}!
          </h1>
          <p style={{margin:'5px 0 0',opacity:0.85,fontSize:'14px'}}>
            {user ? user.role.toUpperCase() : ''} | PF Dashboard Overview
          </p>
        </div>

        <div style={{padding:'20px 30px'}}>

          {/* Stats Cards */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(4,1fr)',
            gap:'15px',
            marginBottom:'20px'
          }}>
            {[
              {icon:'💰', label:'Total PF Balance', value:`₹${totalBalance.toFixed(2)}`, color:'#667eea'},
              {icon:'📅', label:'This Month', value:`₹${thisMonth}`, color:'#34a853'},
              {icon:'📝', label:'Pending Claims', value:pendingClaims, color:'#ea4335'},
              {icon:'✅', label:'Approved Claims', value:approvedClaims, color:'#764ba2'},
            ].map((card, i) => (
              <div key={i} style={{
                backgroundColor:'white',
                borderRadius:'12px',
                padding:'20px',
                boxShadow:'0 2px 10px rgba(0,0,0,0.08)',
                borderTop:`4px solid ${card.color}`
              }}>
                <div style={{fontSize:'25px',marginBottom:'8px'}}>{card.icon}</div>
                <p style={{color:'#888',fontSize:'12px',margin:'0 0 5px',fontWeight:'600'}}>{card.label}</p>
                <h2 style={{color:card.color,fontSize:'22px',margin:0,fontWeight:'bold'}}>{card.value}</h2>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'2fr 1fr',
            gap:'15px',
            marginBottom:'20px'
          }}>
            <div style={{
              backgroundColor:'white',
              borderRadius:'12px',
              padding:'20px',
              boxShadow:'0 2px 10px rgba(0,0,0,0.08)',
              height:'280px'
            }}>
              <h3 style={{margin:'0 0 15px',color:'#333',fontSize:'16px'}}>📈 PF Growth Chart</h3>
              {contributions.length > 0 ? (
                <div style={{height:'210px'}}>
                  <Line data={lineData} options={{
                    responsive:true,
                    maintainAspectRatio:false,
                    plugins:{legend:{position:'top',labels:{font:{size:11}}}},
                    scales:{y:{beginAtZero:true,ticks:{font:{size:10}}},x:{ticks:{font:{size:10}}}}
                  }} />
                </div>
              ) : (
                <div style={{textAlign:'center',padding:'40px',color:'#888'}}>
                  <p style={{fontSize:'35px'}}>📊</p>
                  <p style={{fontSize:'13px'}}>Add contributions to see chart</p>
                </div>
              )}
            </div>

            <div style={{
              backgroundColor:'white',
              borderRadius:'12px',
              padding:'20px',
              boxShadow:'0 2px 10px rgba(0,0,0,0.08)',
              height:'280px'
            }}>
              <h3 style={{margin:'0 0 15px',color:'#333',fontSize:'16px'}}>🍩 Distribution</h3>
              {contributions.length > 0 ? (
                <div style={{height:'210px'}}>
                  <Doughnut data={doughnutData} options={{
                    responsive:true,
                    maintainAspectRatio:false,
                    plugins:{legend:{position:'bottom',labels:{font:{size:10}}}}
                  }} />
                </div>
              ) : (
                <div style={{textAlign:'center',padding:'40px',color:'#888'}}>
                  <p style={{fontSize:'35px'}}>📊</p>
                  <p style={{fontSize:'13px'}}>No data yet!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor:'white',
            borderRadius:'12px',
            padding:'20px',
            marginBottom:'20px',
            boxShadow:'0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{margin:'0 0 15px',color:'#333',fontSize:'16px'}}>⚡ Quick Actions</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
              {[
                {icon:'💰', label:'Add Contribution', link:'/contributions', color:'#667eea'},
                {icon:'📝', label:'Apply Claim', link:'/claims', color:'#ea4335'},
                {icon:'📄', label:'View Statement', link:'/statement', color:'#34a853'},
                {icon:'🪪', label:'Update KYC', link:'/kyc', color:'#764ba2'},
              ].map((action, i) => (
                <a key={i} href={action.link} style={{
                  textDecoration:'none',
                  backgroundColor:`${action.color}15`,
                  border:`2px solid ${action.color}30`,
                  borderRadius:'10px',padding:'15px',textAlign:'center'
                }}>
                  <div style={{fontSize:'25px',marginBottom:'8px'}}>{action.icon}</div>
                  <p style={{color:action.color,fontWeight:'bold',fontSize:'12px',margin:0}}>{action.label}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Contributions */}
          <div style={{
            backgroundColor:'white',
            borderRadius:'12px',
            padding:'20px',
            boxShadow:'0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{margin:'0 0 15px',color:'#333',fontSize:'16px'}}>📊 Recent Contributions</h3>
            {contributions.length > 0 ? (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{backgroundColor:'#f8f8ff'}}>
                    {['Month','Year','Employee','Employer','Total'].map((h,i) => (
                      <th key={i} style={{padding:'10px',textAlign:'left',color:'#666',fontSize:'12px',fontWeight:'600'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contributions.slice(-3).map((c, i) => (
                    <tr key={i} style={{borderTop:'1px solid #f0f0f0'}}>
                      <td style={{padding:'10px',color:'#333',fontSize:'13px'}}>{c.month}</td>
                      <td style={{padding:'10px',color:'#333',fontSize:'13px'}}>{c.year}</td>
                      <td style={{padding:'10px',color:'#667eea',fontWeight:'600',fontSize:'13px'}}>₹{parseFloat(c.employee_share).toFixed(2)}</td>
                      <td style={{padding:'10px',color:'#34a853',fontWeight:'600',fontSize:'13px'}}>₹{parseFloat(c.employer_share).toFixed(2)}</td>
                      <td style={{padding:'10px',color:'#764ba2',fontWeight:'bold',fontSize:'13px'}}>₹{parseFloat(c.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{textAlign:'center',padding:'20px',color:'#888'}}>
                <p style={{fontSize:'35px'}}>📭</p>
                <p style={{fontSize:'13px'}}>No contributions yet. <a href="/contributions" style={{color:'#667eea'}}>Add one now!</a></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;