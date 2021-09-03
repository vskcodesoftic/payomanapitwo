const dotenv = require('dotenv');

dotenv.config();

const config = {
  mailOptions: {
    from: 'sivakrishnavegi.lpu@gmail.com',
    signup: {
      subject: 'Verify your CRM account',
      text: 'Verfication',
      html: '<b>Verify</b>',
    },
  },
};

exports.config = config;