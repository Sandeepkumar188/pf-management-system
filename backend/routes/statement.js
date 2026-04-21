const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:pf_account_id', (req, res) => {
  const sql = `SELECT c.month, c.year, c.employee_share, c.employer_share, c.interest,
    (c.employee_share + c.employer_share + c.interest) as total
    FROM contributions c WHERE c.pf_account_id = ? ORDER BY c.year, c.month`;
  db.query(sql, [req.params.pf_account_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching statement' });
    res.json(results);
  });
});

module.exports = router;
