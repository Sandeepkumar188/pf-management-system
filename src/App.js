import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PFAccount from './pages/PFAccount';
import Contributions from './pages/Contributions';
import Claims from './pages/Claims';
import Statement from './pages/Statement';
import Nomination from './pages/Nomination';
import KYC from './pages/KYC';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Employer from './pages/Employer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pfaccount" element={<PFAccount />} />
        <Route path="/contributions" element={<Contributions />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/nomination" element={<Nomination />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employer" element={<Employer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
