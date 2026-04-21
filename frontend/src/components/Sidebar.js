import React from 'react';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const currentPath = window.location.pathname;

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const employeeMenu = [
    { icon:'⚙️', label:'Profile', link:'/profile' },
    { icon:'📊', label:'Dashboard', link:'/dashboard' },
    { icon:'👤', label:'PF Account', link:'/pfaccount' },
    { icon:'💰', label:'Contributions', link:'/contributions' },
    { icon:'📝', label:'Claims', link:'/claims' },
    { icon:'📄', label:'Statement', link:'/statement' },
    { icon:'👨‍👩‍👧', label:'Nomination', link:'/nomination' },
    { icon:'🪪', label:'KYC', link:'/kyc' },
  ];

  const employerMenu = [
    { icon:'🏢', label:'Dashboard', link:'/employer' },
    { icon:'👥', label:'Employees', link:'/employer' },
    { icon:'💼', label:'Run Payroll', link:'/employer' },
  ];

  const menuItems = user?.role === 'employer' ? employerMenu : employeeMenu;

  return (
    <div style={{
      width:'200px',
      background:'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      display:'flex', flexDirection:'column',
      height:'100vh',
      fontFamily:'Segoe UI, sans-serif',
      boxShadow:'4px 0 15px rgba(0,0,0,0.15)'
    }}>
      {/* Logo */}
      <div style={{
        padding:'20px 15px',
        borderBottom:'1px solid rgba(255,255,255,0.15)',
        textAlign:'center'
      }}>
        <div style={{fontSize:'28px', marginBottom:'5px'}}>🏦</div>
        <h2 style={{color:'white', margin:0, fontSize:'13px', fontWeight:'bold'}}>PF Management</h2>
        {user?.role === 'employer' && (
          <p style={{color:'rgba(255,255,255,0.7)', fontSize:'10px', margin:'4px 0 0'}}>EMPLOYER PANEL</p>
        )}
      </div>

      {/* Menu */}
      <div style={{flex:1, padding:'15px 10px', overflowY:'auto'}}>
        {menuItems.map((item, i) => {
          const isActive = currentPath === item.link;
          return (
            <a key={i} href={item.link} style={{
              display:'flex', alignItems:'center', gap:'10px',
              color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
              textDecoration:'none',
              padding:'10px 12px', marginBottom:'4px',
              borderRadius:'10px', fontSize:'13px',
              fontWeight: isActive ? '600' : '400',
              backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderLeft: isActive ? '3px solid white' : '3px solid transparent'
            }}>
              <span style={{fontSize:'16px'}}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>

      {/* User Info */}
      <div style={{padding:'12px 10px', borderTop:'1px solid rgba(255,255,255,0.15)'}}>
        <div style={{
          backgroundColor:'rgba(255,255,255,0.1)',
          borderRadius:'10px', padding:'10px 12px', marginBottom:'10px',
          display:'flex', alignItems:'center', gap:'10px'
        }}>
          <div style={{
            width:'30px', height:'30px',
            backgroundColor:'rgba(255,255,255,0.2)',
            borderRadius:'50%', display:'flex',
            alignItems:'center', justifyContent:'center', fontSize:'14px'
          }}>👤</div>
          <div>
            <p style={{color:'white', margin:0, fontSize:'12px', fontWeight:'600'}}>{user ? user.name : 'User'}</p>
            <p style={{color:'rgba(255,255,255,0.6)', margin:'2px 0 0', fontSize:'10px', textTransform:'uppercase'}}>{user ? user.role : ''}</p>
          </div>
        </div>
        <button onClick={logout} style={{
          width:'100%', padding:'10px',
          backgroundColor:'rgba(255,255,255,0.15)',
          color:'white', border:'1px solid rgba(255,255,255,0.25)',
          borderRadius:'10px', cursor:'pointer',
          fontSize:'13px', fontWeight:'600'
        }}>🚪 Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;