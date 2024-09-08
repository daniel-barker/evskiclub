import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

import {
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //check if server is in dev mode
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? `frontend/public` : `frontend/build`;
    const dir = `${basePath}/uploads/unit/fullsize`;
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

router.route("/").get(protect, getUnits).post(protect, admin, createUnit);
router
  .route("/:id")
  .get(protect, getSingleUnit)
  .put(protect, admin, checkObjectId, updateUnit)
  .delete(protect, admin, checkObjectId, deleteUnit);

router.post("/u", protect, admin, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    //determine paths based on env
    const isDevelopment = process.env.NODE_ENV === "development";
    const basePath = isDevelopment
      ? `frontend/public/uploads/unit`
      : `frontend/build/uploads/unit`;

    //backend paths
    const truePath = `${basePath}/fullsize/${req.file.filename}`;
    const trueThumbPath = `${basePath}/thumbnail/${req.file.filename}`;
    //frontend paths
    const fullPath = `uploads/unit/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/unit/thumbnail/${req.file.filename}`;

    if (!fs.existsSync(`${basePath}/thumbnail`)) {
      fs.mkdirSync(`${basePath}/thumbnail`, {
        recursive: true,
      });
    }

    sharp(truePath)
      .resize(150)
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
