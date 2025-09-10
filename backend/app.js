const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt: expressJwt } = require('express-jwt');
const imapRoutes = require('./src/controllers/imapController');
const authController = require('./src/controllers/authController');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email_sync', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Public auth routes
app.use('/auth', authController);

// JWT protected API routes
app.use('/api/imap', expressJwt({ secret: JWT_SECRET, algorithms: ['HS256'] }));
app.use('/api/imap', imapRoutes);

module.exports = app;
