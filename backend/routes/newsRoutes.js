import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //check if server is in dev mode
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
const uploadSingleImage = upload.single("image");

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

  router.post("/u", protect, admin, (req, res) => {
    uploadSingleImage(req, res, function (err) {
      if (err) {
        console.log("Upload error: ", err.message);
        return res.status(400).send({ message: err.message });
      }

      console.log("Uploaded file: ", req.file); // Check what file is uploaded

      // Determine if PDF or Image
      const isDevelopment = process.env.NODE_ENV === "development";
      const basePath = isDevelopment ? `frontend/public` : `frontend/build`;
      const truePath = `${basePath}/uploads/news/fullsize/${req.file.filename}`;

      if (req.file.mimetype === "application/pdf") {
        console.log("PDF uploaded: ", truePath); // Log PDF path
        return res.status(201).send({
          message: "PDF uploaded successfully",
          file: `uploads/news/fullsize/${req.file.filename}`,
        });
      }

      const trueThumbPath = `${basePath}/uploads/news/thumbnail/${req.file.filename}`;
      console.log("Image uploaded: ", truePath, " and thumbnail: ", trueThumbPath); // Log image paths

      // Process Image
      sharp(truePath)
        .resize(75)
        .toFile(trueThumbPath, (err, info) => {
          if (err) {
            console.log("Sharp error: ", err.message);
            return res.status(400).send({ message: err.message });
          }
          res.status(201).send({
            message: "Image uploaded successfully",
            image: fullPath,
            thumbnail: thumbPath,
          });
        });
    });
  });

export default router;
