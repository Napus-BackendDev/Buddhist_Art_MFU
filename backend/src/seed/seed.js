import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose from "mongoose";
import User from "../module/user.module.js";

await mongoose.connect(process.env.DATABASE_URL);

const seedUsers = [
  {
    username: { th: "ผู้ดูแลระบบ", en: "Admin" },
    password: await bcrypt.hash("admin123", 10),
    email: { personal: "admin@mfu.ac.th", university: "admin@mfu.ac.th" },
    studentId: "000000",
    tel: "0812345678",
    role: "admin",
  },
];

await User.insertMany(seedUsers);

console.log("✅ Seed users success!");
await mongoose.disconnect();
