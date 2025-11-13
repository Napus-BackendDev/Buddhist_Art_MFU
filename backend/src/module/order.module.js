import mongoose from "mongoose";
import artsModel from "./arts.module.js";

const orderSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, default: "" },
  tel: { type: String, default: "" },
  idCard: { type: String, default: "" },
  address: { type: String, default: "" },
  orderArt: {type: mongoose.Schema.Types.ObjectId, ref: 'Arts', required: true },
}, { timestamps: true });

orderSchema.post("save", async function (doc) {
  await artsModel.findByIdAndUpdate(doc.orderArt, {
    $addToSet: { orders: doc._id },
  });
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
