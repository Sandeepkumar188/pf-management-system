const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contributionRoutes = require('./routes/contributions');
const claimRoutes = require('./routes/claims');
const statementRoutes = require('./routes/statement');
const nominationRoutes = require('./routes/nomination');
const kycRoutes = require('./routes/kyc');
const employeeRoutes = require('./routes/employee');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/statement', statementRoutes);
app.use('/api/nomination', nominationRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: ' PF System API Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(' Server running on port ' + PORT);
});
