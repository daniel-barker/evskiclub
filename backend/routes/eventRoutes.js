import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `uploads/events/fullsize`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `event-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
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
  getEvents,
  getFutureEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(protect, getEvents).post(protect, admin, createEvent);
router.route("/future").get(protect, getFutureEvents);
router.route("/past").get(protect, getPastEvents);
router
  .route("/:id")
  .get(protect, checkObjectId, getEventById)
  .put(protect, admin, checkObjectId, updateEvent)
  .delete(protect, admin, checkObjectId, deleteEvent);

router.post("/u", protect, admin, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    const fullPath = `uploads/events/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/events/thumbnail/${req.file.filename}`;

    if (!fs.existsSync(`uploads/events/thumbnail`)) {
      fs.mkdirSync(`uploads/events/thumbnail`, { recursive: true });
    }

    sharp(fullPath)
      .resize(200)
      .toFile(thumbPath, (err, info) => {
        if (err) {
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
