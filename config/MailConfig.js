import nodemailer from 'nodemailer';

const account = {
    email: "vlwc7zedyyrqexwf@ethereal.email",
    password: "TadjRuZJY4KDrZ7nRY"
}

const EmailTransport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: account.email,
        pass: account.password
    }
});

export default EmailTransport;