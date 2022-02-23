import nodemailer, { SendMailOptions } from 'nodemailer';

const sendEmail = async (mailData: SendMailOptions) => {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass, // generated ethereal password
    },
  });

  const mailOptions: SendMailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>',
    ...mailData,
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;
