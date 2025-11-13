import userModel from "../module/user.module.js";
import orderModel from "../module/order.module.js";
import artsModel from "../module/arts.module.js";
import asyncHandler from "../utils/asyncHandler.js";
import { mailOrder } from "../config/nodemailer.js";
import * as fontkit from "fontkit";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find().populate("orderArt");
  res.json(orders);
});

export const getOrdersDetails = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id).populate("orderArt");
  res.json(order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { username, email, tel, idCard, address, orderArt } = req.body;
  const date = new Date().toLocaleDateString("th-TH");

  const arts = await artsModel.findById(orderArt);
  const user = await userModel.findById(arts.owner);

  const pdfPath = path.join("./template", "จองงานศิลปะ.pdf");
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.getPages()[0];
  const fontBytes = fs.readFileSync(path.join("./template/fonts", "NotoSerifThai.ttf"));
  const font = await pdfDoc.embedFont(fontBytes);
  const safeText = (value) => (value ? String(value) : "");


  page.drawText(safeText(username) || "", { x: 107, y: 695, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(tel) || "", { x: 370, y: 695, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(address) || "", { x: 85, y: 652, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(arts.artname.get('th')) || "", { x: 117, y: 478, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(user.username.get('th')) || "", { x: 355, y: 478, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(arts.size) || "", { x: 100 , y: 457, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(arts.technique.get('th')) || "", { x: 256, y: 457, size: 12, font, color: rgb(0, 0, 0) });
  page.drawText(safeText(arts.price) || "", { x: 427, y: 457, size: 12, font, color: rgb(0, 0, 0) });
  // page.drawText(safeText(date) || "", { x: 420, y: 180, size: 12, font, color: rgb(0, 0, 0) });

  const pdfBuffer = await pdfDoc.save();

  await mailOrder(email, username, pdfBuffer);
  const order = await orderModel.create(req.body);
  res.status(201).json(order);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  await orderModel.findByIdAndDelete(orderId);
  res.status(200);
});
