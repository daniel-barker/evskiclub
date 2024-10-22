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
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? `frontend/public` : `frontend/build`;
    const dir = `${basePath}/uploads/gallery/fullsize`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
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
  const filetypes = /jpe?g|webp/;
  const mimetypes = /image\/jpe?g|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error(".jp(e)g or .webp images only!"), false);
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
      const isDevelopment = process.env.NODE_ENV === "development";
      const basePath = isDevelopment ? "frontend/public" : "frontend/build";
      const dir = `${basePath}/uploads/gallery/thumbnails`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const originalPath = req.file.path; // Save the original file path
      const fullsizePath = `${basePath}/uploads/gallery/fullsize/gallery-image-${Date.now()}.webp`;
      const thumbnailPath = `${dir}/gallery-image-${Date.now()}.webp`;

      try {
        // Convert original image to webp for full-size image
        await sharp(originalPath).webp().toFile(fullsizePath);

        // Convert original image to webp and resize for thumbnail
        await sharp(originalPath).resize(150).webp().toFile(thumbnailPath);

        //Original image needs to be deleted but after conversion and processing. Currently there's an issue with the uploadImage controller handling the files after conversion.

        // Update the paths to be relative for client access
        req.body.image = fullsizePath.replace(`${basePath}`, "");
        req.body.thumbnail = thumbnailPath.replace(`${basePath}`, "");

        next(); // Proceed to the uploadImage controller to save the data to the database
      } catch (err) {
        return res
          .status(400)
          .json({ message: `Error creating webp images: ${err.message}` });
      }
    } else {
      return res.status(400).json({ message: "No image file uploaded." });
    }
  },
  uploadImage
);

export default router;
