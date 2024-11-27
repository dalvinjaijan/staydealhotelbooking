import nodemailer from "nodemailer";

import dotenv from'dotenv'
dotenv.config()

export async function sendMail(email:string){
    const otp=generateOtp()
    console.log(otp,"otp");
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });
    await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Verify Your Account ✔",
        text: `Your OTP is ${otp}`,
        html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="">Click here</a></b>`,
      },error=>{
        if (error){
            console.log(error)
        }
      });
    
      return otp;

}

function generateOtp() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}