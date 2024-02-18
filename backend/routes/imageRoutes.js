import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

import { protect, admin } from "../middleware/authMiddleware.js";
import { getImages, uploadImage } from "../controllers/imageController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `frontend/public/uploads/gallery/fullsize`;
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

const upload = multer({ storage, fileFilter, limits: { fileSize: 3000000 } });
const uploadSingleImage = upload.single("image");

router.get("/", getImages);
router.post(
  "/",
  protect,
  admin,
  uploadSingleImage,
  uploadImage,
  (error, req, res) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const fullPath = `uploads/gallery/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/gallery/thumbnails/${req.file.filename}`;

    if (!fs.existsSync(`uploads/gallery/thumbnails`)) {
      fs.mkdirSync(`uploads/gallery/thumbnails`, { recursive: true });
    }

    sharp(fullPath)
      .resize(200)
      .toFile(thumbPath, (err, info) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        res.status(200).send({
          message: "Image uploaded successfully",
          image: fullPath,
          thumbnail: thumbPath,
        });
      });
  }
);

export default router;
