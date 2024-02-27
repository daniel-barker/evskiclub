import asyncHandler from "../middleware/asyncHandler.js";
import Image from "../models/imageModel.js";
import sharp from "sharp";
import fs from "fs";

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

// @desc    Get all images
// @route   GET /api/images
// @access  Members only

const getImages = asyncHandler(async (req, res) => {
  const images = await Image.find({});
  res.json(images);
});

// @desc: Get single image by ID
// @route: GET /api/images/:id
// @access: Members only

const getSingleImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (image) {
    res.json(image);
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
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

// @desc: Update image
// @route: PUT /api/images/:id
// @access: Admin only

const updateImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (image) {
    try {
      image.image = req.body.image || image.image;
      image.thumbnail = req.body.thumbnail || image.thumbnail;
      image.title = req.body.title || image.title;
      image.description = req.body.description || image.description;
      image.tags = req.body.tags || image.tags;

      const updatedImage = await image.save();
      res.json(updatedImage);
    } catch (error) {
      res.status(400);
      throw new Error(error);
    }
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
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

export {
  uploadImage,
  getImages,
  getSingleImage,
  getUniqueTags,
  getImagesByTag,
  updateImage,
  deleteImage,
};
