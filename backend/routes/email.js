

var express = require('express')
var nodemailer = require('nodemailer');
var router = express.Router();
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
    console.log(error+" halla balla");
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
    to: process.env.EMAIL,  // Change to email address that you want to receive messages on
    subject: 'Portefølje Kontakt meg epost',
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
      transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Submission was successful",
        text: `Thank you for contacting us!\n\nForm details\nName: ${name}\n Email: ${email}\n Message: ${message}`
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