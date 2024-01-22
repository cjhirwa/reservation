import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()
sgMail.setApiKey(process.env.SEND_GRID_API)
class Email{
static sendWelcomeEmail = (email, name,password) => {
    const message = {
        to: email,
        from: 'hicode250@gmail.com',
        subject: 'Welcome To La Posh Hotel',
        html: `<b>Hello ${name}</b>, thank you for registering on your La Posh hotel app!, use the credentials below to login.<br><br> 
        <u><b>Credentials:</b></u>
        <br><br>
        <b>username</b>: <b>${email}<b><br>
        <b>Password</b>: <b>${password}<b><br><br>Regards,`
    }
    sgMail.send(message)
}
static sendCancelationEmail = (email, name) => {
    const message = {
        to: email,
        from: 'hicode250@gmail.com',
        subject: 'Account deletion confirmed',
        text: `GoodBye ${name}, We hope to see you back sometime soon!`,
        html: `GoodBye ${name}, We hope to see you back sometime soon!`,
    }
    sgMail.send(message)
}
}
export default Email