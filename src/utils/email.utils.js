const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "phamkhiemhust2001@gmail.com",
        pass: process.env.GG_PASSWORD
    }
});

class EmailUtils {
    sendForgotPasswordCode = async (email, code) => {
        const option = {
            from: process.env.EMAIL_APP,
            to: email,
            subject: "Reset password",
            html: `<div><p>Yêu cầu đặt lại mật khẩu thành công. Vui lòng nhập code sau để đặt lại mật khẩu<p><h4>${code}</h4></div>`
        };
        await transporter.sendMail(option, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        })
    }
}

module.exports = new EmailUtils();