import nodemailer from "nodemailer";
import "dotenv/config";

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "valuadum1@meta.ua",
        pass: META_PASSWORD,
    }
};
const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//     to: "kinedav149@huvacliq.com",
//     from: "valuadum1@meta.ua",
//     subject: "Test email",
//     html: "<p><strong>Test email</strong> from localhost:3000</p>"
// };
// transport.sendMail(email)
//     .then(() => console.log("Email send success"))
//     .catch((error) => console.log(error.message));

const sendEmail = data => {
    const email = { ...data, from: "valuadum1@meta.ua" };
    return transport.sendMail(email);
}

export {sendEmail};