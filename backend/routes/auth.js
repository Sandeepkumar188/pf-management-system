const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required!' });
  }

  db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error!' });
    if (results && results.length > 0)
      return res.status(400).json({ message: 'Email already exists!' });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `INSERT INTO users (name, email, password, role, phone, is_email_verified) 
                 VALUES (?, ?, ?, ?, ?, TRUE)`;

    db.query(sql, [name, email, hashedPassword, role, phone || null], (err, result) => {
      if (err) return res.status(500).json({ message: 'Registration failed! ' + err.message });

      const userId = result.insertId;
      const pfNumber = 'PF' + String(userId).padStart(4, '0');

      db.query(
        'INSERT INTO pf_accounts (user_id, pf_number, basic_salary, status) VALUES (?, ?, 0, "active")',
        [userId, pfNumber]
      );

      res.json({ message: 'Registration successful!', user_id: userId });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ message: 'User not found!' });

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: 'Wrong password!' });

    db.query('SELECT id FROM pf_accounts WHERE user_id = ?', [user.id], (err2, pfResults) => {
      const pfAccountId = pfResults && pfResults.length > 0 ? pfResults[0].id : null;
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.json({
        token,
        user: { id: user.id, name: user.name, role: user.role, pf_account_id: pfAccountId }
      });
    });
  });
});

// Update Password
router.put('/update-password', (req, res) => {
  const { user_id, current_password, new_password } = req.body;
  db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ message: 'User not found!' });
    if (!bcrypt.compareSync(current_password, results[0].password))
      return res.status(401).json({ message: 'Wrong password!' });
    const hashedPassword = bcrypt.hashSync(new_password, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user_id], (err) => {
      if (err) return res.status(500).json({ message: 'Error' });
      res.json({ message: 'Password updated!' });
    });
  });
});

// Update Profile
router.put('/update-profile', (req, res) => {
  const { user_id, name, email, basic_salary } = req.body;
  db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, user_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error' });
    if (basic_salary) {
      db.query('UPDATE pf_accounts SET basic_salary = ? WHERE user_id = ?', [basic_salary, user_id]);
    }
    res.json({ message: 'Profile updated!' });
  });
});

module.exports = router;
