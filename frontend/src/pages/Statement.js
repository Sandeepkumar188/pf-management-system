import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Statement() {
  const user = JSON.parse(localStorage.getItem('user'));
  const pfAccountId = user ? user.pf_account_id : 1;
  const [statement, setStatement] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/statement/${pfAccountId}`)
      .then(res => {
        setStatement(res.data);
        const t = res.data.reduce((sum, s) => sum + parseFloat(s.total), 0);
        setTotal(t);
      }).catch(err => console.log(err));
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('PF Management System', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('PF Statement Report', 105, 25, { align: 'center' });
    doc.text(`Employee: ${user ? user.name : 'N/A'}`, 105, 33, { align: 'center' });

    // Balance
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Total PF Balance: Rs ${total.toFixed(2)}`, 14, 55);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 65);

    // Table
    autoTable(doc, {
      startY: 75,
      head: [['Month', 'Year', 'Employee Share', 'Employer Share', 'Interest', 'Total']],
      body: statement.map(s => [
        s.month, s.year,
        `Rs ${parseFloat(s.employee_share).toFixed(2)}`,
        `Rs ${parseFloat(s.employer_share).toFixed(2)}`,
        `Rs ${parseFloat(s.interest).toFixed(2)}`,
        `Rs ${parseFloat(s.total).toFixed(2)}`
      ]),
      headStyles: { fillColor: [102, 126, 234] },
      alternateRowStyles: { fillColor: [240, 238, 255] }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system generated statement.', 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save(`PF_Statement_${user ? user.name : 'User'}_${new Date().getFullYear()}.pdf`);
  };

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'Segoe UI, sans-serif'}}>
      <Sidebar />
      <div style={{flex:1,backgroundColor:'#f0f2f5',overflowY:'auto'}}>
        <div style={{
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding:'30px 40px',color:'white',
          display:'flex',justifyContent:'space-between',alignItems:'center'
        }}>
          <div>
            <h1 style={{fontSize:'26px',fontWeight:'bold',margin:0}}>📄 PF Statement</h1>
            <p style={{margin:'5px 0 0',opacity:0.85,fontSize:'15px'}}>Your complete PF statement</p>
          </div>
          <button onClick={downloadPDF} style={{
            padding:'12px 25px',
            backgroundColor:'white',
            color:'#764ba2',
            border:'none',borderRadius:'12px',
            fontSize:'14px',fontWeight:'bold',
            cursor:'pointer',
            boxShadow:'0 4px 15px rgba(0,0,0,0.2)',
            display:'flex',alignItems:'center',gap:'8px'
          }}>
            🖨️ Download PDF
          </button>
        </div>

        <div style={{padding:'30px 40px'}}>
          {/* Balance Cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',marginBottom:'25px'}}>
            {[
              {label:'Total PF Balance', value:`₹${total.toFixed(2)}`, color:'#667eea', icon:'💰'},
              {label:'Total Contributions', value:statement.length, color:'#34a853', icon:'📊'},
              {label:'Interest Earned', value:`₹${statement.reduce((sum,s) => sum + parseFloat(s.interest), 0).toFixed(2)}`, color:'#764ba2', icon:'📈'},
            ].map((s, i) => (
              <div key={i} style={{backgroundColor:'white',borderRadius:'16px',padding:'25px',boxShadow:'0 2px 15px rgba(0,0,0,0.08)',borderTop:`4px solid ${s.color}`}}>
                <p style={{color:'#888',fontSize:'13px',margin:'0 0 8px',fontWeight:'600'}}>{s.icon} {s.label}</p>
                <h2 style={{color:s.color,fontSize:'28px',margin:0,fontWeight:'bold'}}>{s.value}</h2>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{backgroundColor:'white',borderRadius:'16px',padding:'25px',boxShadow:'0 2px 15px rgba(0,0,0,0.08)'}}>
            <h3 style={{margin:'0 0 20px',color:'#333',fontSize:'18px'}}>📋 Statement History</h3>
            {statement.length > 0 ? (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{backgroundColor:'#f8f8ff'}}>
                    {['Month','Year','Employee Share','Employer Share','Interest','Total'].map((h,i) => (
                      <th key={i} style={{padding:'12px',textAlign:'left',color:'#666',fontSize:'13px',fontWeight:'600'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statement.map((s, i) => (
                    <tr key={i} style={{borderTop:'1px solid #f0f0f0'}}>
                      <td style={{padding:'12px',color:'#333',fontWeight:'500'}}>{s.month}</td>
                      <td style={{padding:'12px',color:'#333'}}>{s.year}</td>
                      <td style={{padding:'12px',color:'#667eea',fontWeight:'600'}}>₹{parseFloat(s.employee_share).toFixed(2)}</td>
                      <td style={{padding:'12px',color:'#34a853',fontWeight:'600'}}>₹{parseFloat(s.employer_share).toFixed(2)}</td>
                      <td style={{padding:'12px',color:'#ea4335',fontWeight:'600'}}>₹{parseFloat(s.interest).toFixed(2)}</td>
                      <td style={{padding:'12px',color:'#764ba2',fontWeight:'bold'}}>₹{parseFloat(s.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{textAlign:'center',padding:'30px',color:'#888'}}>
                <p style={{fontSize:'40px'}}>📭</p>
                <p>No statement data yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statement;
