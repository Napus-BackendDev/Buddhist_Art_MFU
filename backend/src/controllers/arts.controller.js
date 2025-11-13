import asyncHandler from "../utils/asyncHandler.js";
import generateImageUrl from "../utils/generateImageUrl.js";
import artsModel from "../module/arts.module.js";
import userModel from "../module/user.module.js";
import { mailArtApproval, mailArtRejection } from "../config/nodemailer.js";
import normalizeMapFields from "../utils/normalizeMapFields.js";
// Helper: Normalize Map fields
const artMapFields = ["artname", "technique", "concept", "type", "presentation", "artAddress"];

export const getArts = asyncHandler(async (req, res) => {
  const arts = await artsModel.find().populate("owner");
  res.status(200).json(arts);
});

export const getArtsDetails = asyncHandler(async (req, res) => {
  const art = await artsModel.findById(req.params.id).populate("owner");
  if (!art) return res.status(404).json({ message: "Art not found" });
  res.status(200).json(art);
});

export const getArtsByOwner = asyncHandler(async (req, res) => {
  if (req.user?.id ){
    const arts = await artsModel.find({ owner: req.user.id }).populate("owner");
    return res.status(200).json(arts);
  }
  const arts = await artsModel.find({ owner: req.params.id }).populate("owner");
  res.status(200).json(arts);
});

export const getArtsAdmin = asyncHandler(async (req, res) => {
  const arts = await artsModel.find().populate("owner").populate("orders");
  res.status(200).json(arts);
});

export const createArts = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    req.body.owner = req.user.id;
  }
  if (req.body.artId) {
    const existingArt = await artsModel.findOne({ artId: req.body.artId });
    if (existingArt) {
      return res.status(400).json({ message: 'Art ID นี้มีอยู่แล้ว' });
    }
  }
  const user = await userModel.findById(req.body.owner);
  normalizeMapFields(req.body, artMapFields);
  req.body.photo = generateImageUrl(user.studentId, "art", req.file.filename);
  
  const newArt = await artsModel.create(req.body);
  res.status(200).json({ message: 'Art created', art: newArt });
});

export const updateArts = asyncHandler(async (req, res) => {
  if (req.file) {
    const art = await artsModel.findById(req.params.id);
    const user = await userModel.findById(art.owner);
    if (user) {
      req.body.photo = generateImageUrl(user.studentId, "art", req.file.filename);
    }
  }
  delete req.body.owner;
  if (req.user.role !== "admin") {
    req.body.approvalStatus = "pending";
  }
  if (req.body.artId) {
    const existingArt = await artsModel.findOne({ artId: req.body.artId });
    if (existingArt) return res.status(400).json({ message: "Art with this artId already exists" });
  }
  if (req.body.approvalStatus === "approved") {
    const art = await artsModel.findById(req.params.id).populate("owner");
    console.log(art.owner.email.get('university'));
    await mailArtApproval(art.owner.email.get('university'), art.owner.username.get("th") || "Unnamed Art", art.artname.get("th") || "Unnamed Art");
  } else if (req.body.approvalStatus === "rejected") {
    const art = await artsModel.findById(req.params.id).populate("owner");
    const reason = req.body.reason || "ไม่ระบุเหตุผล";
    await mailArtRejection(art.owner.email.get('university'), art.owner.username.get("th") || "Unnamed Art", art.artname.get("th") || "Unnamed Art", reason);
  }
  normalizeMapFields(req.body, artMapFields);
  const updatedArt = await artsModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ message: 'Art updated', art: updatedArt });
});

export const deleteArts = asyncHandler(async (req, res) => {
  const art = await artsModel.findByIdAndDelete(req.params.id);
  if (!art) return res.status(404).json({ message: "Art not found" });
  res.status(200).json({ message: 'Art deleted' });
});
