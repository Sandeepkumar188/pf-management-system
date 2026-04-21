const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, message) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{ user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER, to, subject,
      html:`<div style="font-family:Arial;padding:20px;background:#f0f2f5">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;border-radius:10px;color:white;text-align:center">
          <h2>🏦 PF Management System</h2>
        </div>
        <div style="background:white;padding:20px;border-radius:10px;margin-top:15px">
          <p>${message}</p>
        </div>
      </div>`
    });
  } catch (err) { console.log('Email error:', err.message); }
};

const addNotification = (user_id, message, type) => {
  db.query('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
    [user_id, message, type]);
};

router.get('/:pf_account_id', (req, res) => {
  db.query('SELECT * FROM claims WHERE pf_account_id = ?',
    [req.params.pf_account_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(results);
  });
});

router.post('/add', (req, res) => {
  const { pf_account_id, claim_type, amount, reason } = req.body;
  const sql = 'INSERT INTO claims (pf_account_id, claim_type, amount, reason, applied_date, status) VALUES (?, ?, ?, ?, CURDATE(), "pending")';
  db.query(sql, [pf_account_id, claim_type, amount, reason], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error' });
    db.query('SELECT u.email, u.name, u.id FROM users u JOIN pf_accounts p ON u.id = p.user_id WHERE p.id = ?',
      [pf_account_id], (err, users) => {
      if (users && users.length > 0) {
        sendEmail(users[0].email, '🏦 PF Claim Submitted',
          `Dear ${users[0].name}, your ${claim_type} claim of ₹${amount} has been submitted! Status: Pending`);
        addNotification(users[0].id,
          `Your ${claim_type} claim of ₹${amount} has been submitted successfully!`, 'info');
      }
    });
    res.json({ message: 'Claim submitted!' });
  });
});

module.exports = router;
