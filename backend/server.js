import errorHandler from "./src/middleware/errorHandler.js";
import connectDB from "./src/config/mongodb.js";
import cookieParser from "cookie-parser";
import router from "./src/routes.js";
import express from "express";
import cors from "cors";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}));
app.use("/api", router);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
app.listen(port, () => { console.log(`Server is running on ${port}`) });