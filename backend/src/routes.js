import { Router } from "express";
import { getUserData, getUserDetails, updateUserData, getUser, createUser, updateUser, deleteUser } from "./controllers/user.controller.js";
import { getNews, getNewsById, createNews, updateNews, deleteNews } from "./controllers/news.controller.js";
import { getOrders, getOrdersDetails, createOrder, updateOrder, deleteOrder } from "./controllers/order.controller.js";
import { getArts, getArtsDetails, getArtsByOwner, getArtsAdmin, createArts, updateArts, deleteArts } from "./controllers/arts.controller.js";
import { login, logout } from "./controllers/auth.controller.js";
import { photoUpload } from "./middleware/uploadFile.js";
import userAuth from "./middleware/userAuth.js";
import authorizeRoles from "./middleware/rolePermission.js";

const router = Router();
const adminOnly = authorizeRoles("admin");
const userOnly = authorizeRoles("user");

// ==================== AUTH ROUTES ====================
router.post("/auth/login", login);
router.post("/auth/logout", logout);

// ==================== USER ROUTES ====================
// User's own data (specific routes before dynamic params)
router.get("/user/data", userAuth, getUserData);
router.patch("/user/data", userAuth, photoUpload("profile"), updateUserData);

// User's own arts
router.get("/user/arts", userAuth, userOnly, getArtsByOwner);
router.get("/user/arts/:id", userAuth, userOnly, getArtsDetails);
router.post("/user/arts", userAuth, userOnly, photoUpload("art"), createArts);
router.patch("/user/arts/:id", userAuth, userOnly, photoUpload("art"), updateArts);
router.delete("/user/arts/:id", userAuth, userOnly, deleteArts);

// Public user detail (must come after specific routes)
router.get("/user/:id", getUserDetails);

// ==================== ADMIN - USER MANAGEMENT ====================
router.get("/admin/user", userAuth, adminOnly, getUser);
router.post("/admin/user", userAuth, adminOnly, photoUpload("profile"), createUser);
router.patch("/admin/user/:id", userAuth, adminOnly, photoUpload("profile"), updateUser);
router.delete("/admin/user/:id", userAuth, adminOnly, deleteUser);

// ==================== ADMIN - ARTS MANAGEMENT ====================
router.get("/admin/arts", userAuth, adminOnly, getArtsAdmin);
router.post("/admin/arts", userAuth, adminOnly, photoUpload("art"), createArts);
router.patch("/admin/arts/:id", userAuth, adminOnly, photoUpload("art"), updateArts);
router.delete("/admin/arts/:id", userAuth, adminOnly, deleteArts);

// ==================== ARTS ROUTES (PUBLIC) ====================
router.get("/arts", getArts);
router.get("/arts/:id", getArtsDetails);
router.get("/arts/owner/:id", getArtsByOwner);

// ==================== ORDER ROUTES ====================
router.post("/orders", createOrder);
router.get("/admin/orders", userAuth, adminOnly, getOrders);
router.get("/admin/orders/:id", userAuth, adminOnly, getOrdersDetails);
router.patch("/admin/orders/:id", userAuth, adminOnly, updateOrder);
router.delete("/admin/orders/:id", userAuth, adminOnly, deleteOrder);
    
// ==================== NEWS ROUTES ====================
router.get("/news", getNews);
router.get("/admin/news", userAuth, adminOnly, getNews);
router.get("/admin/news/:id", userAuth, adminOnly, getNewsById);
router.post("/admin/news", userAuth, adminOnly, photoUpload("news"), createNews);
router.patch("/admin/news/:id", userAuth, adminOnly, photoUpload("news"), updateNews);
router.delete("/admin/news/:id", userAuth, adminOnly, deleteNews);

export default router;
