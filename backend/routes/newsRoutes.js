import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `uploads/news/fullsize`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `news-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

import {
  getNews,
  getLatestNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(protect, getNews).post(protect, admin, createNews);
router.route("/latest").get(protect, getLatestNews);
router
  .route("/:id")
  .get(protect, checkObjectId, getNewsById)
  .put(protect, admin, checkObjectId, updateNews)
  .delete(protect, admin, checkObjectId, deleteNews);

router.post("/u", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    console.log("file:", JSON.stringify(req.file, null, 2));
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    const fullPath = `uploads/news/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/news/thumbnail/${req.file.filename}`;

    if (!fs.existsSync(`uploads/news/thumbnail`)) {
      fs.mkdirSync(`uploads/news/thumbnail`, { recursive: true });
    }

    sharp(req.file.path)
      .resize(200, 200)
      .toFile(thumbPath, (err, info) => {
        if (err) {
          console.log("error:", err);
        } else {
          console.log("info:", info);
        }
      });

    res.status(200).send({
      message: "Image uploaded successfully",
      image: fullPath,
      thumbnail: thumbPath,
    });
  });
});

export default router;
