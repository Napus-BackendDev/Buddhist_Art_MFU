import userModel from "../module/user.module.js";
import artsModel from "../module/arts.module.js";
import newsModel from "../module/news.module.js";
import multer from "multer";
import fs from "fs";
import path from "path";

export const photoUpload = (field) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      let folderPath;

      if (req.user.role !== "admin") {
        const user = await userModel.findById(req.user.id);
        folderPath = path.join(process.cwd(), "uploads", user.studentId, field);
      } else {
        if (field === "profile" || field === "art") {
          if (req.body.owner) {
            const user = await userModel.findById(req.body.owner);
            folderPath = path.join(process.cwd(), "uploads", user.studentId, field);
          }
          else if (req.body.studentId) {
            folderPath = path.join(process.cwd(), "uploads", req.body.studentId, field);
          }
        } else {
          folderPath = path.join(process.cwd(), "uploads", "Admin", field);
        }
      }

      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    },
    filename: async (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (req.user.role !== "admin") {
        if (field === "profile") {
          const username = req.body["username[th]"] || req.body.username?.th || "user" ;
          if (req.user.id) {
            const user = await userModel.findById(req.user.id);
            console.log("User found:", user);
            cb(null, `${user.studentId}-${user.username.get("th")}${ext}`);
          }
          cb(null, `${req.user.studentId}-${username}${ext}`);
        } else if (field === "art") {
          const artname = req.body.artname?.th || req.body.artname || "art";
          if (req.params.id) {
            const art = await artsModel.findById(req.params.id);
            cb(null, `${art.owner.studentId}-${art.artname.get("th")}${ext}`);
          }
          cb(null, `${req.body.artId}-${artname}${ext}`);
        }
      } else {
        if (field === "profile") {
          let usernameTh = req.body["username[th]"] || req.body.username?.th || "user" ;
          if (req.params.id) {
            const user = await userModel.findById(req.params.id);
            cb(null, `${user.studentId}-${user.username.get("th")}${ext}`);
          }
          cb(null, `${req.body.studentId}-${usernameTh}${ext}`);
        } else if (field === "art") {
          let artnameTh = req.body["artname[th]"] || req.body.artname?.th || "art"  ;

          if (req.params.id) {
            const art = await artsModel.findById(req.params.id);
            cb(null, `${art.owner.studentId}-${art.artname.get("th")}${ext}`);
          }
  
          cb(null, `${req.body.artId}-${artnameTh}${ext}`);
        } else {
          let titleTh = req.body["title[th]"] || req.body.title?.th || "news";

          if (req.params.id) {
            const news = await newsModel.findById(req.params.id);
            titleTh = news?.title?.get("th") || titleTh;
          }

          cb(null, `${titleTh}${ext}`);
        }
      }
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter,
  }).single("photo");
};
