import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || 5006,
    ACCESS_VALIDITY: process.env.ACCESS_VALIDITY,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_VALIDITY: process.env.REFRESH_VALIDITY,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    DB_URI_TEST: process.env.DB_URI_TEST,
    DB_URI: process.env.DB_URI,
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASS: process.env.NODEMAILER_PASS,
    USEREMAIL: process.env.USEREMAIL,
}

export { config }