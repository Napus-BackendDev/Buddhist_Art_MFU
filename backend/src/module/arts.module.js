import mongoose from "mongoose";
import userModel from "./user.module.js";

const artsSchema = new mongoose.Schema({
    artId: { type: String, default: "" },
    artname: { type: Map, of: String, default: {} },
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    size: { type: String, default: "" },
    technique: { type: Map, of: String, default: {} },
    price: { type: String, default: "" },
    concept: { type: Map, of: String, default: {} },
    type: { type: Map, of: String, default: {} },
    presentation: { type: Map, of: String, default: {} },
    artAddress: { type: Map, of: String, default: {} },
    ratio: { type: String, default: "" },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    saleStatus: { type: String, enum: ["available", "sold"], default: "available" },
    photo: { type: String, default: "" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  }, { timestamps: true }
);

artsSchema.post("save", async function (doc) {
  await userModel.findByIdAndUpdate(doc.owner, {
    $addToSet: { arts: doc._id },
  });
});

artsSchema.post("findOneAndDelete", async function(doc) {
  if (doc) {
    await userModel.findByIdAndUpdate(doc.owner, {
      $pull: { arts: doc._id },
    });
  }
});


const artsModel = mongoose.models.Arts || mongoose.model("Arts", artsSchema);

export default artsModel;