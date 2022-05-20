const express = require('express')
const nodemailer = require('nodemailer');
const router = express.Router();

/**
 * Setsup the Nodemailer to receive information from the client and then generate an email and send it
 * Refrence: https://mailtrap.io/blog/react-contact-form/#Script-for-Expressjs-Nodejs-auto-reply-email
 */

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log("email setup went wrong "+error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `

  var mail = {
    from: name,
    to: process.env.EMAIL,  
    subject: 'Portefølje Nettsiden, epost',
    text: content
  }
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
      transporter.sendMail({ // If the first email was sendt successfully it will send a confirmation email to the original sender.
        from: process.env.EMAIL,
        to: email,
        subject: "Melding var vellykket",
        text: `Takk for at du kontaktet meg!\n\nMelding detaljer\nNavn: ${name}\n Epost: ${email}\n Melding: ${message}`
      }, function(error, info){
        if(error) {
          console.log(error);
        } else{
          console.log('Message sent: ' + info.response);
        }
      });
    }
  })
})
module.exports = router;