const nodemailer = require('nodemailer');
const { env } = require('./env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: env.email.user, pass: env.email.appPassword },
});

module.exports = transporter;
