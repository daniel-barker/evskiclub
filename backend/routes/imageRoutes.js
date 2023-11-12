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
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    } else {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/uploads/${req.file.filename}`,
      });
    }
  }
);

export default router;
