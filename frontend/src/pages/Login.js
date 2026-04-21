import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password!');
    }
  };

  return (
    <div style={{
      display:'flex',
      height:'100vh',
      background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily:'Segoe UI, sans-serif'
    }}>
      {/* Left Side */}
      <div style={{
        flex:1,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        color:'white',
        padding:'60px'
      }}>
        <div style={{
          backgroundColor:'rgba(255,255,255,0.15)',
          borderRadius:'20px',
          padding:'40px',
          backdropFilter:'blur(10px)',
          textAlign:'center',
          maxWidth:'400px'
        }}>
          <div style={{fontSize:'70px',marginBottom:'20px'}}>🏦</div>
          <h1 style={{fontSize:'30px',fontWeight:'bold',marginBottom:'10px'}}>PF Management System</h1>
          <p style={{fontSize:'15px',opacity:0.9,lineHeight:'1.6'}}>
            Your complete solution for managing Provident Fund accounts
          </p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'15px',marginTop:'30px'}}>
            {[
              {icon:'💰', text:'Track Contributions'},
              {icon:'📄', text:'View Statements'},
              {icon:'📝', text:'Apply Claims'},
              {icon:'🪪', text:'Manage KYC'},
              {icon:'👨‍👩‍👧', text:'Nominations'},
              {icon:'👤', text:'PF Account'},
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor:'rgba(255,255,255,0.2)',
                borderRadius:'10px',
                padding:'12px',
                display:'flex',
                alignItems:'center',
                gap:'8px',
                fontSize:'13px'
              }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Purple Glass */}
      <div style={{
        width:'450px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        padding:'60px',
        background:'rgba(255,255,255,0.15)',
        backdropFilter:'blur(20px)',
        borderRadius:'30px 0 0 30px',
        boxShadow:'-20px 0 60px rgba(0,0,0,0.2)',
        borderLeft:'1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{
          width:'60px',
          height:'5px',
          backgroundColor:'white',
          borderRadius:'5px',
          marginBottom:'30px'
        }}/>

        <h2 style={{color:'white',fontSize:'32px',fontWeight:'bold',marginBottom:'5px'}}>
          Welcome Back!
        </h2>
        <p style={{color:'rgba(255,255,255,0.8)',marginBottom:'35px',fontSize:'15px'}}>
          Sign in to your PF account
        </p>

        {error && (
          <div style={{
            backgroundColor:'rgba(255,0,0,0.2)',
            color:'white',
            padding:'12px 15px',
            borderRadius:'10px',
            marginBottom:'20px',
            fontSize:'14px',
            borderLeft:'4px solid rgba(255,100,100,0.8)'
          }}>❌ {error}</div>
        )}

        <label style={{color:'rgba(255,255,255,0.9)',fontSize:'13px',fontWeight:'600',marginBottom:'8px',letterSpacing:'0.5px'}}>
          EMAIL ADDRESS
        </label>
        <input
          style={{
            padding:'14px 16px',
            marginBottom:'20px',
            borderRadius:'12px',
            border:'2px solid rgba(255,255,255,0.3)',
            fontSize:'14px',
            backgroundColor:'rgba(255,255,255,0.2)',
            color:'white',
            outline:'none'
          }}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={{color:'rgba(255,255,255,0.9)',fontSize:'13px',fontWeight:'600',marginBottom:'8px',letterSpacing:'0.5px'}}>
          PASSWORD
        </label>
        <input
          style={{
            padding:'14px 16px',
            marginBottom:'30px',
            borderRadius:'12px',
            border:'2px solid rgba(255,255,255,0.3)',
            fontSize:'14px',
            backgroundColor:'rgba(255,255,255,0.2)',
            color:'white',
            outline:'none'
          }}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{
            padding:'15px',
            backgroundColor:'white',
            color:'#764ba2',
            border:'none',
            borderRadius:'12px',
            fontSize:'16px',
            fontWeight:'bold',
            cursor:'pointer',
            marginBottom:'25px',
            boxShadow:'0 5px 20px rgba(0,0,0,0.2)',
            letterSpacing:'0.5px'
          }}
          onClick={handleLogin}
        >
          LOGIN →
        </button>

        <div style={{
          textAlign:'center',
          padding:'15px',
          backgroundColor:'rgba(255,255,255,0.1)',
          borderRadius:'12px',
          fontSize:'14px',
          color:'rgba(255,255,255,0.9)',
          border:'1px solid rgba(255,255,255,0.2)'
        }}>
          Don't have account?{' '}
          <a href="/register" style={{color:'white',fontWeight:'bold',textDecoration:'none'}}>
            Register Here
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
