const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:pf_account_id', (req, res) => {
  const sql = 'SELECT * FROM nominations WHERE pf_account_id = ?';
  db.query(sql, [req.params.pf_account_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching nominations' });
    res.json(results);
  });
});

router.post('/add', (req, res) => {
  const { pf_account_id, nominee_name, relationship, share_percentage } = req.body;
  const sql = 'INSERT INTO nominations (pf_account_id, nominee_name, relationship, share_percentage) VALUES (?, ?, ?, ?)';
  db.query(sql, [pf_account_id, nominee_name, relationship, share_percentage], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding nomination' });
    res.json({ message: 'Nomination added successfully!' });
  });
});

module.exports = router;
