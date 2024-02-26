import asyncHandler from "../middleware/asyncHandler.js";
import Image from "../models/imageModel.js";
import sharp from "sharp";

// @desc    Get all images
// @route   GET /api/images
// @access  Members only

const getImages = asyncHandler(async (req, res) => {
  const images = await Image.find({});
  res.json(images);
});

// @desc: Get all unique image tags
// @route: GET /api/images/tags
// @access: Members only

const getUniqueTags = asyncHandler(async (req, res) => {
  const images = await Image.find({});
  const allTags = images.map((image) => image.tags).flat();
  const uniqueTags = [...new Set(allTags)]; // Remove duplicates
  res.json(uniqueTags);
});

// @desc Upload image
// @route POST /api/upload
// @access Private/admin

const uploadImage = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    const metadata = await sharp(file.path).metadata();
    const image = new Image({
      image: req.body.image,
      thumbnail: req.body.thumbnail,
      width: metadata.width,
      height: metadata.height,
      title: req.body.title,
      description: req.body.description,
      tags: JSON.parse(req.body.tags),
    });

    const createdImage = await image.save();
    res.status(201).json(createdImage);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

export { getImages, getUniqueTags, uploadImage };
