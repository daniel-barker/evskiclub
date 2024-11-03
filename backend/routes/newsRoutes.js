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

// Multer storage for images
const imageStorage = multer.diskStorage({
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

// Multer storage for PDFs
const pdfStorage = multer.diskStorage({
  destination(req, file, cb) {
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? `frontend/public` : `frontend/build`;
    const dir = `${basePath}/uploads/news/pdfs`;
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

// File filter for images
function imageFileFilter(req, file, cb) {
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

// File filter for PDFs
function pdfFileFilter(req, file, cb) {
  const filetypes = /pdf/;
  const mimetypes = /application\/pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("PDFs only!"), false);
  }
}

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});
const uploadPDF = multer({ storage: pdfStorage, fileFilter: pdfFileFilter });

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

// Routes for managing news posts
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

// Route for uploading images
router.post("/upload-image", protect, admin, (req, res) => {
  uploadImage.single("image")(req, res, function (err) {
    if (err) {
      console.log("Upload error: ", err.message);
      return res.status(400).send({ message: err.message });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const basePath = isDevelopment ? `frontend/public` : `frontend/build`;
    const truePath = `${basePath}/uploads/news/fullsize/${req.file.filename}`;

    //frontend paths
    const fullPath = `uploads/news/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/news/thumbnail/${req.file.filename}`;

    if (req.file.mimetype === "application/pdf") {
      console.log("PDF uploaded: ", truePath); // Log PDF path
      return res.status(201).send({
        message: "PDF uploaded successfully",
        file: `uploads/news/fullsize/${req.file.filename}`,
      });
    }

    const trueThumbPath = `${basePath}/uploads/news/thumbnail/${req.file.filename}`;
    console.log(
      "Image uploaded: ",
      truePath,
      " and thumbnail: ",
      trueThumbPath
    ); // Log image paths

    // Process Image
    sharp(truePath)
      .resize(150)
      .toFile(thumbnailPath, (err) => {
        if (err) {
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

// Route for uploading PDFs
router.post("/upload-pdf", protect, admin, (req, res) => {
  uploadPDF.single("pdf")(req, res, function (err) {
    if (err) {
      console.log("Upload error: ", err.message);
      return res.status(400).send({ message: err.message });
    }

    const pdfPath = `uploads/news/pdfs/${req.file.filename}`;
    res.status(201).send({
      message: "PDF uploaded successfully",
      pdf: pdfPath,
    });
  });
});

export default router;
