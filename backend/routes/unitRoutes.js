import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `frontend/public/uploads/unit/fullsize`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `unit-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
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
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(protect, getUnits).post(protect, admin, createUnit);
router
  .route("/:id")
  .get(protect, getSingleUnit)
  .put(protect, admin, updateUnit)
  .delete(protect, admin, deleteUnit);

router.post("/u", protect, admin, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    //backend paths
    const truePath = `frontend/public/uploads/unit/fullsize/${req.file.filename}`;
    const trueThumbPath = `frontend/public/uploads/unit/thumbnail/${req.file.filename}`;
    //frontend paths
    const fullPath = `uploads/unit/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/unit/thumbnail/${req.file.filename}`;

    if (!fs.existsSync(`frontend/public/uploads/unit/thumbnail`)) {
      fs.mkdirSync(`frontend/public/uploads/unit/thumbnail`, {
        recursive: true,
      });
    }

    sharp(truePath)
      .resize(200)
      .toFile(trueThumbPath, (err, info) => {
        if (err) {
          return res.status(400).send({ message: err.message });
        } else {
          res.status(201).send({
            message: "Image uploaded successfully",
            image: fullPath,
            thumbnail: thumbPath,
          });
        }
      });
  });
});

export default router;
