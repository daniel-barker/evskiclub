import express from "express";
import path from "path";
import multer from "multer";

import { protect, admin } from "../middleware/authMiddleware.js";
import { getImages, uploadImage } from "../controllers/imageController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(getImages)
  .post(protect, admin, upload.single("image"), uploadImage);

export default router;
