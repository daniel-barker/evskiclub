import path from "path";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const type = req.body.type;
    const dir = `uploads/${type}/fullsize`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
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

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    console.log("type:" + req.body.type);
    console.log("file:", JSON.stringify(req.file, null, 2));
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    const type = req.body.type; // get picture type
    const fullPath = `uploads/${type}/fullsize/${req.file.filename}`;
    const thumbPath = `uploads/${type}/thumbnail/${req.file.filename}`;
    console.log("fullPath:", fullPath);
    console.log("thumbPath:", thumbPath);

    // check for folder and create it if it doesn't exist
    if (!fs.existsSync(`uploads/${type}/thumbnail`)) {
      fs.mkdirSync(`uploads/${type}/thumbnail`, { recursive: true });
    }

    //create the thumbnail
    sharp(req.file.path)
      .resize(250) //250px wide
      .toFile(thumbPath, (err, info) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Error creating thumbnail" });
        }
        res.status(200).send({
          message: "Image uploaded successfully",
          image: fullPath,
          thumbnail: thumbPath,
        });
      });
  });
});

export default router;
