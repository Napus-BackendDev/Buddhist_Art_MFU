import nodemiler from "nodemailer";
import "dotenv/config.js";

const transporter = nodemiler.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const mailOrder = async (email, username, pdfBuffer) => {
  const mailOptions = {
    to: email,
    subject: "แจ้งยืนยันการสั่งซื้อผลงานศิลปะ",
    text: `เรียนคุณ ${username}\n\nท่านได้ทำการสั่งจองผลงานศิลปะเรียบร้อยแล้ว.\nขอขอบคุณที่ใช้บริการจากเรา\nมหาวิทยาลัยแม่ฟ้าหลวง`,
    attachments: [
      {
        filename: `booking-${username}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const mailArtApproval = async (email, username, artname) => {
  const mailOptions = {
    to: email,
    subject: "แจ้งผลการอนุมัติผลงานศิลปะ",
    text: `เรียนคุณ ${username}\n\nผลงานศิลปะชื่อ "${artname}" ของท่านได้รับการอนุมัติเรียบร้อยแล้ว.\nขอขอบคุณที่ใช้บริการจากเรา\nมหาวิทยาลัยแม่ฟ้าหลวง`,
  };
  await transporter.sendMail(mailOptions);
};

export const mailArtRejection = async (email, username, artname, reason) => {
  const mailOptions = {
    to: email,
    subject: "แจ้งผลการไม่อนุมัติผลงานศิลปะ",
    text: `เรียนคุณ ${username}\n\nผลงานศิลปะชื่อ "${artname}" ของท่านไม่ได้รับการอนุมัติเนื่องจากเหตุผลดังต่อไปนี้:\n${reason}\nขอขอบคุณที่ใช้บริการจากเรา\nมหาวิทยาลัยแม่ฟ้าหลวง`,
  };
  await transporter.sendMail(mailOptions);
};