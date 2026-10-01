const transporter = require('../config/mailer');
const { env } = require('../config/env');

const sendWelcomeEmail = async ({ username, email }) => {
  await transporter.sendMail({
    from: `"E-Commerce API" <${env.email.user}>`,
    to: email,
    subject: 'Welcome to our store!',
    html: `
      <h2>Welcome, ${username}!</h2>
      <p>Your account has been created successfully. You can now log in and start exploring.</p>
      <p>Happy shopping!</p>
    `,
  });
};

module.exports = { sendWelcomeEmail };
