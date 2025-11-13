import normalizeMapFields from "../utils/normalizeMapFields.js";
import generateImageUrl from "../utils/generateImageUrl.js";
import asyncHandler  from "../utils/asyncHandler.js";
import newsModel from "../module/news.module.js";
// Helper: Normalize Map fields
const newsMapFields = ["title", "description"];

export const getNews = asyncHandler(async (req, res) => {
  const news = await newsModel.find();
  res.json(news);
});

export const getNewsById = asyncHandler(async (req, res) => {
  const news = await newsModel.findById(req.params.id);
  res.json(news);
});

export const createNews = asyncHandler(async (req, res) => {
  normalizeMapFields(req.body, newsMapFields);
  req.body.photo = generateImageUrl(null,"news", req.file.filename);
  const news = await newsModel.create(req.body);
  res.status(201).json({ message: "News created successfully", news });
});

export const updateNews = asyncHandler(async (req, res) => {
  normalizeMapFields(req.body, newsMapFields);
  if (req.file) {
    req.body.photo = generateImageUrl(null,"news", req.file.filename);
  }
  const news = await newsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "News updated successfully", news });
});

export const deleteNews = asyncHandler(async (req, res) => {
  await newsModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "News deleted successfully" });
});