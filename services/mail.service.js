const config = require("../config/index");
const nodemailer = require("nodemailer");
// sgMail.setApiKey('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');

// const sendEmail = async (to, html) => {
//   try {
//     const msg = {
//       to,
//       from: 'sivakrishnavegi.lpu@gmail.com', // sender address Change to your verified sender
//       subject: 'verify your crm noreply', // Subject line
//       text: 'please do verify', // plain text body
//       html,
//     };
//     await sgMail.send(msg);
//     console.log(`Mail Has Been Sent To ${to}`)
//     return false;
//   } catch (e) {
//     console.error('Mail Service Error => ', e);
//     return false;
//   }
// };

//node mailer

const sendEmail = async (to, html) => {
  let transporter = nodemailer.createTransport({
    host: "payoman.com",
      port: 587, // port for secure SMTP
      secure: false,
    auth: {
      user: "noreply@payoman.com",
      pass: "Codesoftic@08",
    },
    tls: {
      rejectUnauthorized: false
  }
  // logger: true,
  // debug: false,
  });

  // verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("verfication error",error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

  let mailOptions = {
    from: "noreply@payoman.com",
    to,
    subject: "Email verfication ",
    text: "few steps !",
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);

    } else {
      console.log("Message sent: " + info.response);
    }
  });
};

const sendEmailOtpLink = async (to, token) => {
  let transporter = nodemailer.createTransport({
    port: 587,
    secure: false,
    auth: {
      user: "noreply@payoman.com",
      pass: "Codesoftic@08",
    },
    tls: {
      rejectUnauthorized: false
  }
  });

  let mailOptions = {
    from: "noreply@payoman.com",
    to,
    subject: "Email verfication ",
    text: "few steps !",
    html: `
        <h3>You have requested link for password reseting  </h3>
        <h4>Click in this <a href="${process.env.SERVER}/reset/:${token}">link to</a> to Reset Your Password</h4>
        <p>your token </p>
        <p> ${token} </p>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendEmailLink = async (to, token) => {
  let transporter = nodemailer.createTransport({
    port: 587,
    secure: false,
    auth: {
      user: "noreply@payoman.com",
      pass: "Codesoftic@08",
    },
    tls: {
      rejectUnauthorized: false
  }
  });

  let mailOptions = {
    from: "noreply@payoman.com",
    to,
    subject: "Email verfication ",
    text: "few steps !",
    html: `
      <h3>email for noreply activation  </h3>
      <h4>Click in this <a href="${process.env.SERVER}/reset/:${token}">link to</a> to Reset Your Password</h4>
      <p>your token </p>
      <p> ${token} </p>
      `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};



///send email contact usContact

const sendEmailContactUs = async (html) => {
  let transporter = nodemailer.createTransport({
    host: "payoman.com",
      port: 587, // port for secure SMTP
      secure: false,
    auth: {
      user: "noreply@payoman.com",
      pass: "Codesoftic@08",
    },
    tls: {
      rejectUnauthorized: false
  }
  // logger: false,
  // debug: false,
  });

  // verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

  let mailOptions = {
    from: "noreply@payoman.com",
    to:"care@payoman.com",
    subject: "Contact us Details ",
    text: "response !",
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);

    } else {
      console.log("Message sent: " + info.response);
    }
  });
};


exports.sendEmailOtpLink = sendEmailOtpLink;
exports.sendEmail = sendEmail;
exports.sendEmailLink = sendEmailLink;
exports.sendEmailContactUs = sendEmailContactUs;
