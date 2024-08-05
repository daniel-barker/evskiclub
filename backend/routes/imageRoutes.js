import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

import { protect, admin } from "../middleware/authMiddleware.js";
import {
  uploadImage,
  getImages,
  getSingleImage,
  getUniqueTags,
  getImagesByTag,
  getCarouselImages,
  updateImage,
  deleteImage,
} from "../controllers/imageController.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (process.env.NODE_ENV === "development") {
      const dir = `frontend/public/uploads/gallery/fullsize`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } else {
      const dir = `frontend/build/uploads/gallery/fullsize`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `gallery-${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`
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

const upload = multer({ storage, fileFilter, limits: { fileSize: 300000000 } });
const uploadSingleImage = upload.single("image");

router.get("/tags", protect, getUniqueTags);
router.get("/tags/:tag", protect, getImagesByTag);
router.get("/carousel", protect, getCarouselImages);
router.get("/", protect, getImages);
router
  .route("/:id")
  .get(protect, getSingleImage)
  .delete(protect, admin, checkObjectId, deleteImage)
  .put(protect, admin, checkObjectId, updateImage);
router.post(
  "/",
  protect,
  admin,
  uploadSingleImage,
  async (req, res, next) => {
    if (req.file) {
      // Determine paths based on environment
      const isDevelopment = process.env.NODE_ENV === "development";
      console.log("isDevelopment", isDevelopment);
      const basePath = isDevelopment ? "frontend/public" : "frontend/build";
      const dir = `${basePath}/uploads/gallery/thumbnails`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const fullPath = `${basePath}/uploads/gallery/fullsize/${req.file.filename}`;
      const thumbPath = `${dir}/gallery-image-${Date.now()}${path.extname(
        req.file.originalname
      )}`;

      try {
        await sharp(req.file.path).resize(300).toFile(thumbPath);

        // Update the paths to be relative to the frontend/public directory for client access
        req.body.image = fullPath.replace(`${basePath}`, "");
        req.body.thumbnail = thumbPath.replace(`${basePath}`, "");

        next(); // move to uploadImage controller to get metadata and save to database
      } catch (err) {
        return res
          .status(400)
          .json({ message: `Error creating thumbnail: ${err.message}` });
      }
    } else {
      return res.status(400).json({ message: "No image file uploaded." });
    }
  },
  uploadImage
);

export default router;
