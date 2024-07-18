const nodemailer = require('nodemailer');

const sendEmail = (emailId) => {

    const transporter = nodemailer.createTransport({

        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
            user: 'd01bc19b926111',
            pass: '35bf8469b34a06'
        }
    });
    
    const mailOptions = {
        from: 'hellruler80@gmail.com',
        to: emailId,
        subject: 'Regarding Your Dentist Appointment',
        text: 'Your Appoinment has been confirmed! Please, Be on Time.'
    }

    transporter.sendMail(mailOptions, function (error, info){
        if (error) {
            console.log('Error!!!', error)
        }else{
            console.log('Email sent:', info.response)
        }
    })
}

module.exports = sendEmail;