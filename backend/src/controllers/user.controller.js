import normalizeMapFields from "../utils/normalizeMapFields.js";
import generateImageUrl from "../utils/generateImageUrl.js";
import asyncHandler  from "../utils/asyncHandler.js";
import userModel from "../module/user.module.js";
// Helper: Normalize Map fields
const userMapFields = ["username", "email"];

export const getUser = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

export const getUserData = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id).populate({ path: "arts", populate: { path: "owner", select: "username" } });
  res.json(user);
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id).populate({ path: "arts", populate: { path: "owner", select: "username" } });
  res.json(user);
});

export const createUser = asyncHandler(async (req, res) => {
  normalizeMapFields(req.body, userMapFields);
  if (req.file) {
    req.body.photo = generateImageUrl(req.body.studentId, "profile", req.file.filename);
  }
  const user = await userModel.create(req.body);
  res.status(201).json({
    message: "User created successfully",
    user,
  });
});

export const updateUserData = asyncHandler(async (req, res) => {
  const data = await userModel.findById(req.user.id);
  normalizeMapFields(req.body, userMapFields);
  if (req.file) {
    req.body.photo = generateImageUrl(data.studentId, "profile", req.file?.filename);
  }
  const user = await userModel.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json({ message: "User updated successfully", user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const data = await userModel.findById(req.params.id);
  normalizeMapFields(req.body, userMapFields);
  if (req.file) {
    req.body.photo = generateImageUrl(data.studentId, "profile", req.file.filename);
  }
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "User updated successfully", user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});

