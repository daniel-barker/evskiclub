import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import {
  getAllPosts,
  getApprovedPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePostAsAdmin,
  updatePostAsUser,
  deletePostAsAdmin,
  deletePostAsUser,
} from "../controllers/postController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //check if server is in dev mode
    if (process.env.NODE_ENV === "development") {
      //if in dev mode, save images to frontend/public/uploads/news/fullsize
      const dir = `frontend/public/uploads/posts/fullsize`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } else {
      //if in production mode, save images to frontend/build/uploads/news/fullsize (note: set static disk to /opt/render/project/src/frontend/build/uploads in Render)
      const dir = `frontend/build/uploads/posts/fullsize`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `post-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
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

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(getAllPosts).post(protect, createPost);
router.route("/approved").get(protect, getApprovedPosts);
router.route("/mine").get(protect, getMyPosts);
router
  .route("/:id")
  .get(checkObjectId, getPostById)
  .delete(protect, admin, deletePostAsAdmin);
router.route("/:id/user").delete(protect, deletePostAsUser);
router.route("/:id/user").put(protect, updatePostAsUser);
router.route("/:id/admin").put(protect, admin, updatePostAsAdmin);
router.post("/u", protect, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      res.status(400).json({ message: err.message });
    }

    //determine environment
    const isDevelopment = process.env.NODE_ENV === "development";
    const basePath = isDevelopment
      ? "frontend/public/uploads/posts"
      : "frontend/build/uploads/posts";
    //backend paths
    const truePath = `frontend/public/uploads/posts/fullsize/${req.file.filename}`;
    const trueThumbPath = `frontend/public/uploads/posts/thumbnail/${req.file.filename}`;
    //frontend paths
    const fullPath = `uploads/posts/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/posts/thumbnail/${req.file.filename}`;

    //check thumbdir exists
    if (!fs.existsSync(`${basePath}/thumbnail`)) {
      fs.mkdirSync(`${basePath}/thumbnail`, { recursive: true });
    }

    //create thumbnail
    sharp(truePath)
      .resize(75)
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
