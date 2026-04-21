const express = require('express');
const router = express.Router();
const db = require('../db');

// Contributions fetch karo
router.get('/:pf_account_id', (req, res) => {
  const sql = 'SELECT * FROM contributions WHERE pf_account_id = ?';
  db.query(sql, [req.params.pf_account_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching contributions' });
    res.json(results);
  });
});

// Manual contribution add karo
router.post('/add', (req, res) => {
  const { pf_account_id, month, year, basic_salary } = req.body;
  const employee_share = basic_salary * 0.12;
  const employer_share = basic_salary * 0.12;
  const interest = (employee_share + employer_share) * 0.0825 / 12;

  // Check karo same month/year ka contribution already hai kya
  db.query(
    'SELECT id FROM contributions WHERE pf_account_id = ? AND month = ? AND year = ?',
    [pf_account_id, month, year], (err, existing) => {
      if (existing && existing.length > 0)
        return res.status(400).json({ message: 'Contribution for this month already exists!' });

      const sql = 'INSERT INTO contributions (pf_account_id, month, year, employee_share, employer_share, interest) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [pf_account_id, month, year, employee_share, employer_share, interest], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding contribution' });
        res.json({ message: 'Contribution added successfully!' });
      });
    });
});

// ✅ Auto Payroll — Sab employees ka ek saath contribution add karo
router.post('/payroll', (req, res) => {
  const { month, year } = req.body;

  // Saare active employees fetch karo
  const sql = `SELECT p.id as pf_account_id, p.basic_salary, u.name
    FROM pf_accounts p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = 'active' AND u.role = 'employee' AND p.basic_salary > 0`;

  db.query(sql, (err, employees) => {
    if (err) return res.status(500).json({ message: 'Error fetching employees' });
    if (employees.length === 0)
      return res.status(400).json({ message: 'No active employees found!' });

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    employees.forEach((emp) => {
      const employee_share = emp.basic_salary * 0.12;
      const employer_share = emp.basic_salary * 0.12;
      const interest = (employee_share + employer_share) * 0.0825 / 12;

      // Check duplicate
      db.query(
        'SELECT id FROM contributions WHERE pf_account_id = ? AND month = ? AND year = ?',
        [emp.pf_account_id, month, year], (err, existing) => {
          if (existing && existing.length > 0) {
            skipped++;
          } else {
            db.query(
              'INSERT INTO contributions (pf_account_id, month, year, employee_share, employer_share, interest) VALUES (?, ?, ?, ?, ?, ?)',
              [emp.pf_account_id, month, year, employee_share, employer_share, interest],
              (err) => { if (err) errors++; else processed++; }
            );
          }

          if (processed + skipped + errors === employees.length) {
            res.json({
              message: `Payroll processed! ✅ ${processed} added, ${skipped} skipped, ${errors} errors`,
              processed, skipped, errors
            });
          }
        }
      );
    });
  });
});

module.exports = router;