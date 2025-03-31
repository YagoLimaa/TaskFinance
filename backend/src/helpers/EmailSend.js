import nodeMailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';
import hbs from 'nodemailer-express-handlebars';
import {fileURLToPath} from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sendEmail = async (
    emailData,
    sent_to,
    reply_to,
    template,
    send_from,
    name,
    link
) => {
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD, // Use a senha de aplicativo aqui
        },
    });


    const handleBarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve(__dirname, "../views"),
            defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, "../views"),
        extName: ".handlebars",
    };

    transporter.use("compile", hbs(handleBarOptions));

    const EmailOptions = {
        from: `TaskFinance <${send_from}>`,
        to: sent_to,
        replyTo: reply_to,
        subject: emailData,
        template: template,
        context: {
            name: name,
            link: link,
        },
    };


    try {
        const info = await transporter.sendMail(EmailOptions);
        return info;
    } catch (error) {
        console.log("Erro ao enviar o email: ", error);
        throw error;
        
    }
};


export default sendEmail;