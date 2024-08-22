import asyncHandler from "../middleware/asyncHandler.js";
import News from "../models/newsModel.js";
import fs from "fs";

// @desc    Get all news
// @route   GET /api/news
// @access  Admins

const getAllNews = asyncHandler(async (req, res) => {
  const news = await News.find({}).populate("user");
  res.json(news);
});

// @desc    Get published news
// @route   GET /api/news/published
// @access  Members/Admins

const getPublishedNews = asyncHandler(async (req, res) => {
  const news = await News.find({ isPublished: true })
    .populate("user")
    .sort({ createdAt: -1 });
  res.json(news);
});

// @desc   Get latest news post
// @route  GET /api/news/latest
// @access Members/Admins

const getLatestNews = asyncHandler(async (req, res) => {
  const news = await News.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(1)
    .populate("user");
  res.json(news);
});

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Members/Admins

const getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id).populate("user");

  if (news) {
    res.json(news);
  } else {
    res.status(404);
    throw new Error("News not found");
  }
});

// @desc    Create a post
// @route   POST /api/news
// @access  Admins

const createNews = asyncHandler(async (req, res) => {
  try {
    const news = new News({
      user: req.user._id,
      title: req.body.title,
      post: req.body.post,
      image: req.body.image,
      thumbnail: req.body.thumbnail,
      isPublished: req.body.isPublished,
    });

    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Update a post
// @route   PUT /api/news/:id
// @access  Admins

const updateNews = asyncHandler(async (req, res) => {
  const { title, post, image, thumbnail, isPublished } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    news.title = title;
    news.post = post;
    news.image = image;
    news.thumbnail = thumbnail;
    news.isPublished = isPublished;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Delete a post
// @route   DELETE /api/news/:id
// @access  Admins

const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    // check for images and delete if present
    if (news.image) {
      const fullPath = `frontend/public/${news.image}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    if (news.thumbnail) {
      const thumbPath = `frontend/public/${news.thumbnail}`;
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await news.deleteOne({ _id: news._id });
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

export {
  getAllNews,
  getPublishedNews,
  getLatestNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
