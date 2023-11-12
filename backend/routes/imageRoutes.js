import express from "express";
import path from "path";
import multer from "multer";

import { protect, admin } from "../middleware/authMiddleware.js";
import { getImages, uploadImage } from "../controllers/imageController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router
  .route("/")
  .get(getImages)
  .post(protect, admin, upload.single("image"), uploadImage);

export default router;
