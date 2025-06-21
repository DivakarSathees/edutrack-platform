const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use Mailgun, SendGrid, SES
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendTrainerEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Welcome to EduTrack Platform',
    html: `<p>Hello ${name},</p><p>You have been registered as a trainer. Please log in using your email credentials.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}: ${err.message}`);
  }
};

const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>
      <p>This link expires in 30 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Reset email failed: ${err.message}`);
  }
};

module.exports = { sendTrainerEmail, sendPasswordResetEmail };

