const nodemailer = require("nodemailer");
const User = require('../models/usermodel');

exports.sendMail = async (data)=>{
    const transporter = nodemailer.createTransport({
        service:process.env.MAIL_SERVICE,
        auth:{
            user:process.env.MAIL_AUTH_USER,
            pass:process.env.MAIL_AUTH_PASSWORD
        },
    });

    const mailData = {
        from:process.env.MAIL_FROM_NAME,
        to:data.email,
        subject:"Verify Your Email Address",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #4CAF50;">Email Verification</h2>
                <p>Dear User,</p>
                <p>Thank you for registering with us. To complete your registration, please use the verification code below:</p>
                <div style="margin: 20px 0; padding: 10px; background-color: #f2f2f2; border-radius: 5px; display: inline-block;">
                    <h3 style="margin: 0; color: #000; text-align: center;">${data.code}</h3>
                </div>
                <p>Please enter this code in the verification form to confirm your email address.</p>
                <p style="color: #888;">For your security, do not share this code with anyone.</p>
                <p>Best regards,<br><strong>${process.env.APP_NAME}</strong></p>
            </div>
        `
    }
    await transporter.sendMail(mailData);
}