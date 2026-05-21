const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:user_id', (req, res) => {
  const sql = 'SELECT * FROM kyc WHERE user_id = ?';
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching KYC' });
    res.json(results);
  });
});

router.post('/add', (req, res) => {
  const { user_id, aadhaar_number, pan_number, bank_account, ifsc_code } = req.body;
  const sql = 'INSERT INTO kyc (user_id, aadhaar_number, pan_number, bank_account, ifsc_code, status) VALUES (?, ?, ?, ?, ?, "pending")';
  db.query(sql, [user_id, aadhaar_number, pan_number, bank_account, ifsc_code], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding KYC' });
    res.json({ message: 'KYC submitted successfully!' });
  });
});

module.exports = router;
