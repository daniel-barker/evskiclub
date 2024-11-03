import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

import {
  getAllNews,
  getLatestNews,
  getPublishedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

// Configure storage settings
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? `frontend/public` : `frontend/build`;
    const dir = `${basePath}/uploads/news/fullsize`;
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

// File filter to allow only images and PDFs
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp|pdf/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|application\/pdf/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images or PDFs only!"), false);
  }
}

const upload = multer({ storage, fileFilter });

// Route to handle image uploads
router.post("/upload-image", protect, admin, (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.log("Upload error: ", err.message);
      return res.status(400).send({ message: err.message });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const basePath = isDevelopment ? `frontend/public` : `frontend/build`;
    const fullPath = `${basePath}/uploads/news/fullsize/${req.file.filename}`;
    const thumbnailPath = `${basePath}/uploads/news/thumbnail/${req.file.filename}`;

    // Process and save the thumbnail for the image
    sharp(fullPath)
      .resize(150)
      .toFile(thumbnailPath, (err, info) => {
        if (err) {
          console.log("Sharp error: ", err.message);
          return res.status(400).send({ message: err.message });
        }
        res.status(201).send({
          message: "Image uploaded successfully",
          image: fullPath,
          thumbnail: thumbnailPath,
        });
      });
  });
});

// Route to handle PDF uploads
router.post("/upload-pdf", protect, admin, (req, res) => {
  upload.single("pdf")(req, res, function (err) {
    if (err) {
      console.log("Upload error: ", err.message);
      return res.status(400).send({ message: err.message });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const basePath = isDevelopment ? `frontend/public` : `frontend/build`;
    const fullPath = `${basePath}/uploads/news/fullsize/${req.file.filename}`;

    console.log("PDF uploaded: ", fullPath);
    res.status(201).send({
      message: "PDF uploaded successfully",
      file: `uploads/news/fullsize/${req.file.filename}`,
    });
  });
});

// Other News Routes
router
  .route("/")
  .get(protect, getPublishedNews)
  .post(protect, admin, createNews);

router.route("/latest").get(protect, getLatestNews);

router.route("/all").get(protect, admin, getAllNews);

router
  .route("/:id")
  .get(protect, checkObjectId, getNewsById)
  .put(protect, admin, checkObjectId, updateNews)
  .delete(protect, admin, checkObjectId, deleteNews);

export default router;
