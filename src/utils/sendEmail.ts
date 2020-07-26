"use strict";
import fs from 'fs';
import { JSDOM } from 'jsdom';
import nodemailer from 'nodemailer';
import path from 'path';
const env = require('../env.conf')

export const sendEmail = async (email: string, url: string) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.emailLogin,
            pass: env.emailPassword,
        },
    })

    let htmlDOM = new JSDOM(await fs.promises.readFile(path.join(__dirname, '../public/confEmail.html'), 'utf8'))

    let atag = htmlDOM.window.document.getElementById('button_link') as HTMLAnchorElement
    let ptag = htmlDOM.window.document.getElementById('text_link') as HTMLParagraphElement

    atag.href = url
    ptag.textContent = url

    const options = {
        from: env.emailLogin,
        to: email,
        subject: "Confirm Email ✔",
        html: htmlDOM.window.document.body.innerHTML
    }

    await transporter.sendMail(options, async (err) => {
        if (err) throw err
        // Loggin info
        // console.log("Message sent: %s", info.messageId)
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    })
}