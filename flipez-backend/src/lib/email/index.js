const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sendEmail = async (email, subject, templateName, data) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!

  const transporter = nodemailer.createTransport({
    // host: `smtp.gmail.com`,
    // port: 587,
    service: 'gmail',
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASS
    },
  });

  // Configure handlebars options
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve(__dirname, "templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "templates"),
    extName: ".hbs",
  };

  // Use a template file with nodemailer
  transporter.use("compile", hbs(handlebarOptions));

  const info = await transporter.sendMail({
    from: `"InvestPair"`,
    to: email,
    subject: subject,
    template: templateName,
    context: data,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = {
  sendEmail,
};
