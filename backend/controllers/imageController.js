import asyncHandler from "../middleware/asyncHandler.js";
import Image from "../models/imageModel.js";
import sharp from "sharp";
import fs from "fs";

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

// @desc: Get images by tag
// @route: GET /api/images/tags/:tag
// @access: Members only

const getImagesByTag = asyncHandler(async (req, res) => {
  const images = await Image.find({ tags: req.params.tag });
  res.json(images);
});

// @desc: Delete image
// @route: DELETE /api/images/:id
// @access: Admin only

const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (image) {
    try {
      const imagePath = `frontend/public/${image.image}`;
      const thumbnailPath = `frontend/public/${image.thumbnail}`;
      fs.unlinkSync(imagePath);
      fs.unlinkSync(thumbnailPath);
      await image.deleteOne({ _id: image._id });
      res.json({ message: "Image removed" });
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
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

export { getImages, getUniqueTags, getImagesByTag, deleteImage, uploadImage };
