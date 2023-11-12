import asyncHandler from "../middleware/asyncHandler.js";
import Image from "../models/imageModel.js";
import sharp from "sharp";

// @desc    Get all images
// @route   GET /api/images
// @access  Public

const getImages = asyncHandler(async (req, res) => {
  const images = await Image.find({});
  res.json(images);
});

// @desc Upload image
// @route POST /api/upload
// @access Private/admin

const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file;
  const thumbnailPath = `uploads/thumbnails/${file.filename}`;
  await sharp(file.path).resize(200).toFile(thumbnailPath);

  const metadata = await sharp(file.path).metadata();
  const image = new Image({
    url: `uploads/${file.filename}`,
    thumbnailUrl: thumbnailPath,
    width: metadata.width,
    height: metadata.height,
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
  });

  const createdImage = await image.save();
  res.status(201).json(createdImage);
});

export { getImages, uploadImage };
