import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/postModel.js";
import fs from "fs";

// @desc    Get all posts
// @route   GET /api/posts
// @access  Members

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("user");
  res.json(posts);
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Members

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user");

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Get three latest approved bb posts
// @route   GET /api/posts/latest
// @access  Members

const getLatestPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("user");

  res.json(posts);
});

// @desc   Get all posts by current user
// @route  GET /api/posts/mine
// @access Members

const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user._id }).populate("user");
  res.json(posts);
});

// @desc    Get all approved posts (for public view)
// @route   GET /api/posts/approved
// @access  Members

const getApprovedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "approved" }).populate("user");
  res.json(posts);
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Members

const createPost = asyncHandler(async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      title: req.body.title,
      body: req.body.body,
      status: "pending",
      image: req.body.image,
      thumbnail: req.body.thumbnail,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Update a post (for regular users)
// @route   PUT /api/posts/:id/user
// @access  Members
const updatePostAsUser = asyncHandler(async (req, res) => {
  const { title, body, image, thumbnail } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if the logged-in user is the one who created the post
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to edit this post");
    }

    //If a user updates a post, do not change the status. Can be updated later at admin discretion.
    post.title = title;
    post.body = body;
    post.image = image;
    post.thumbnail = thumbnail;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Update a post (for admins)
// @route   PUT /api/posts/:id/admin
// @access  Admin
const updatePostAsAdmin = asyncHandler(async (req, res) => {
  const { title, body, status, image, thumbnail } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if the logged-in user is an admin
    if (!req.user.isAdmin) {
      res.status(403);
      throw new Error("You are not authorized to edit this post");
    }

    // Update post with new values and allow admin to set the status
    post.title = title;
    post.body = body;
    post.status = status; // Admin can choose the status
    post.image = image;
    post.thumbnail = thumbnail;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Delete post as admin
// @route   DELETE /api/posts/:id
// @access  Admin

const deletePostAsAdmin = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.image) {
      const fullPath = `frontend/public/${post.image}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    if (post.thumbnail) {
      const thumbPath = `frontend/public/${post.thumbnail}`;
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await post.deleteOne({ _id: post._id });
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Delete post as user
// @route   DELETE /api/posts/:id/user
// @access  Members

const deletePostAsUser = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to delete this post");
    }

    if (post.image) {
      const fullPath = `frontend/public/${post.image}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    if (post.thumbnail) {
      const thumbPath = `frontend/public/${post.thumbnail}`;
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await post.deleteOne({ _id: post._id });
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

export {
  getAllPosts,
  getApprovedPosts,
  getPostById,
  getLatestPosts,
  getMyPosts,
  createPost,
  updatePostAsUser,
  updatePostAsAdmin,
  deletePostAsAdmin,
  deletePostAsUser,
};
