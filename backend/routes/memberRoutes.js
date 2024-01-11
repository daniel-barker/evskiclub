import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `frontend/public/uploads/members/fullsize`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `member-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
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
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(protect, getMembers).post(protect, admin, createMember);
router
  .route("/:id")
  .get(protect, checkObjectId, getMemberById)
  .put(protect, admin, checkObjectId, updateMember)
  .delete(protect, admin, checkObjectId, deleteMember);

router.post("/u", protect, admin, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    //paths for the backend
    const truePath = `frontend/public/uploads/members/fullsize/${req.file.filename}`;
    const trueThumbPath = `frontend/public/uploads/members/thumbnail/${req.file.filename}`;
    //paths for the frontend
    const fullPath = `uploads/members/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/members/thumbnail/${req.file.filename}`;

    if (!fs.existsSync(`frontend/public/uploads/members/thumbnail`)) {
      fs.mkdirSync(`frontend/public/uploads/members/thumbnail`, {
        recursive: true,
      });
    }

    sharp(truePath)
      .resize(200)
      .toFile(trueThumbPath, (err, info) => {
        if (err) {
          return res.status(400).json({ message: err.message });
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
