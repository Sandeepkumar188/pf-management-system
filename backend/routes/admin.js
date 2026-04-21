const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, message) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER, to, subject,
      html: `<div style="font-family:Arial;padding:20px;background:#f0f2f5">
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

router.get('/users', (req, res) => {
  const sql = `SELECT u.id, u.name, u.email, u.role, u.created_at,
    p.pf_number, p.basic_salary, p.status
    FROM users u LEFT JOIN pf_accounts p ON u.id = p.user_id`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(results);
  });
});

router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT role FROM users WHERE id = ?', [userId], (err, results) => {
    if (results[0].role === 'admin')
      return res.status(403).json({ message: 'Admin cannot be deleted!' });
    db.query('DELETE FROM kyc WHERE user_id = ?', [userId], () => {
      db.query('SELECT id FROM pf_accounts WHERE user_id = ?', [userId], (err, accounts) => {
        if (accounts && accounts.length > 0) {
          const pfId = accounts[0].id;
          db.query('DELETE FROM nominations WHERE pf_account_id = ?', [pfId], () => {
            db.query('DELETE FROM contributions WHERE pf_account_id = ?', [pfId], () => {
              db.query('DELETE FROM claims WHERE pf_account_id = ?', [pfId], () => {
                db.query('DELETE FROM pf_accounts WHERE user_id = ?', [userId], () => {
                  db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
                    if (err) return res.status(500).json({ message: 'Error' });
                    res.json({ message: 'User deleted!' });
                  });
                });
              });
            });
          });
        } else {
          db.query('DELETE FROM users WHERE id = ?', [userId], () => {
            res.json({ message: 'User deleted!' });
          });
        }
      });
    });
  });
});

router.put('/users/:id/make-admin', (req, res) => {
  db.query('UPDATE users SET role = "admin" WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json({ message: 'User is now Admin!' });
  });
});

router.put('/users/:id/remove-admin', (req, res) => {
  db.query('UPDATE users SET role = "employee" WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json({ message: 'Admin role removed!' });
  });
});

router.get('/claims', (req, res) => {
  const sql = `SELECT c.*, u.name, u.email, u.id as user_id, p.pf_number
    FROM claims c
    JOIN pf_accounts p ON c.pf_account_id = p.id
    JOIN users u ON p.user_id = u.id`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(results);
  });
});

router.put('/claims/:id', (req, res) => {
  const { status } = req.body;
  const sql = `SELECT c.*, u.email, u.name, u.id as user_id
    FROM claims c
    JOIN pf_accounts p ON c.pf_account_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE c.id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (results && results.length > 0) {
      const claim = results[0];
      db.query('UPDATE claims SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Error' });
        const emoji = status === 'approved' ? '' : '❌';
        const msg = `Your ${claim.claim_type} claim of ₹${claim.amount} has been ${status}!`;
        sendEmail(claim.email, `${emoji} PF Claim ${status.toUpperCase()}`,
          `Dear ${claim.name}, ${msg}`);
        addNotification(claim.user_id, msg, status === 'approved' ? 'success' : 'error');
        res.json({ message: `Claim ${status}!` });
      });
    }
  });
});

router.get('/contributions', (req, res) => {
  const sql = `SELECT c.*, u.name, p.pf_number
    FROM contributions c
    JOIN pf_accounts p ON c.pf_account_id = p.id
    JOIN users u ON p.user_id = u.id`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(results);
  });
});

router.get('/stats', (req, res) => {
  const stats = {};
  db.query('SELECT COUNT(*) as total FROM users', (err, r1) => {
    stats.totalUsers = r1[0].total;
    db.query('SELECT COUNT(*) as total FROM claims WHERE status="pending"', (err, r2) => {
      stats.pendingClaims = r2[0].total;
      db.query('SELECT COUNT(*) as total FROM pf_accounts', (err, r3) => {
        stats.totalAccounts = r3[0].total;
        db.query('SELECT SUM(employee_share + employer_share + interest) as total FROM contributions', (err, r4) => {
          stats.totalFund = r4[0].total || 0;
          res.json(stats);
        });
      });
    });
  });
});

module.exports = router;
