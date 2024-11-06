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
  const { title, post, image, thumbnail, pdf, isPublished } = req.body;

  const news = new News({
    user: req.user._id,
    title,
    post,
    image, // Optional image
    thumbnail, // Optional thumbnail
    pdf, // Optional PDF
    isPublished,
  });

  const createdNews = await news.save();
  res.status(201).json(createdNews);
});

// @desc    Update a post
// @route   PUT /api/news/:id
// @access  Admins
const updateNews = asyncHandler(async (req, res) => {
  const { title, post, image, thumbnail, pdf, isPublished } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    news.title = title;
    news.post = post;
    news.isPublished = isPublished;
    news.image = image === "" ? null : image || news.image;
    news.thumbnail = thumbnail === "" ? null : thumbnail || news.thumbnail;
    news.pdf = pdf === "" ? null : pdf || news.pdf;

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
  const isDevelopment = process.env.NODE_ENV === "development";
  const basePath = isDevelopment ? `frontend/public` : `frontend/build`;

  if (news) {
    // check for images and delete if present
    if (news.image) {
      const fullPath = `${basePath}/${news.image}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    if (news.thumbnail) {
      const thumbPath = `${basePath}/${news.thumbnail}`;
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }
    if (news.pdf) {
      const pdfPath = `${basePath}/${news.pdf}`;
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
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
