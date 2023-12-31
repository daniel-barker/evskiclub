import asyncHandler from "../middleware/asyncHandler.js";
import News from "../models/newsModel.js";

// @desc    Get all news
// @route   GET /api/news
// @access  Members/Admins

const getNews = asyncHandler(async (req, res) => {
  const news = await News.find({}).populate("user");
  res.json(news);
});

// @desc   Get all latest news post
// @route  GET /api/news/latest
// @access Members/Admins

const getLatestNews = asyncHandler(async (req, res) => {
  const news = await News.find({})
    .sort({ createdAt: -1 })
    .limit(1)
    .populate("user");
  res.json(news);
});

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Members/Admins

const getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

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
  const { title, post, image, thumbnail } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    news.title = title;
    news.post = post;
    news.image = image;
    news.thumbnail = thumbnail;

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
    await news.remove();
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

export {
  getNews,
  getLatestNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
