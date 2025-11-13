import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: Map, of: String, default: {} },
    description: { type: Map, of: String, default: {} },
    photo: { type: String, default: "" },
    place: { type: String, default: "" },
  },
  { timestamps: true }
);

const newsModel = mongoose.models.News || mongoose.model("News", newsSchema);

export default newsModel;
