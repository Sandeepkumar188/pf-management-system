const express = require('express');
const router = express.Router();
const db = require('../db');

// Employee PF account details
router.get('/account/:user_id', (req, res) => {
  const sql = `SELECT u.name, u.email, u.role, u.created_at,
    p.pf_number, p.basic_salary, p.status, p.id as pf_account_id
    FROM users u
    JOIN pf_accounts p ON u.id = p.user_id
    WHERE u.id = ?`;
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching account' });
    if (results.length === 0) return res.status(404).json({ message: 'Account not found' });
    res.json(results[0]);
  });
});

// Employer ke saare employees
router.get('/all', (req, res) => {
  const sql = `SELECT u.id, u.name, u.email, u.role, u.created_at,
    p.id as pf_account_id, p.pf_number, p.basic_salary, p.status
    FROM users u
    LEFT JOIN pf_accounts p ON u.id = p.user_id
    WHERE u.role = 'employee'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching employees' });
    res.json(results);
  });
});

// Employee ki salary update karo
router.put('/salary/:user_id', (req, res) => {
  const { basic_salary } = req.body;
  db.query('UPDATE pf_accounts SET basic_salary = ? WHERE user_id = ?',
    [basic_salary, req.params.user_id], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating salary' });
      res.json({ message: 'Salary updated!' });
    });
});

module.exports = router;