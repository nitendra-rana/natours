const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  //1. create a transporter.
  // Looking to send emails in production? Check out our Email API/SMTP product!
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //!Activate in gmail 'less secure app' option
  //2. define the eamil options
  const mailOptions = {
    from: 'Nik Rana<support@nik.dev',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  //3. Actually send the email
  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
