'use strict';

const nodemailer = require('nodemailer');

const hasMailConfig = () => {
  return Boolean(
    process.env.MAIL_HOST &&
    process.env.MAIL_PORT &&
    process.env.MAIL_USER &&
    process.env.MAIL_PASS
  );
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE || 'false') === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

const sendResetPasswordEmail = async ({ to, fullName, resetLink }) => {
  if (!hasMailConfig()) {
    console.warn('[MAIL] Chua cau hinh MAIL_HOST/MAIL_PORT/MAIL_USER/MAIL_PASS');
    console.log('[MAIL][DEV] Reset link:', resetLink);
    return {
      sent: false,
      skipped: true,
      reason: 'MAIL_NOT_CONFIGURED',
    };
  }

  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>Đặt lại mật khẩu</h2>
      <p>Xin chào ${fullName || 'bạn'},</p>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản E-Learning.</p>
      <p>Nhấn vào nút bên dưới để đặt lại mật khẩu. Link có hiệu lực trong <strong>15 phút</strong>.</p>

      <p style="margin: 24px 0;">
        <a 
          href="${resetLink}"
          style="
            background: #4f46e5;
            color: #fff;
            text-decoration: none;
            padding: 12px 18px;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
          "
        >
          Đặt lại mật khẩu
        </a>
      </p>

      <p>Nếu nút không hoạt động, bạn có thể copy link sau:</p>
      <p>${resetLink}</p>

      <p>Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email này.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject: 'Đặt lại mật khẩu tài khoản E-Learning',
    html,
  });

  return {
    sent: true,
    messageId: info.messageId,
  };
};

module.exports = {
  sendResetPasswordEmail,
  hasMailConfig,
};