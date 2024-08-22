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

// @desc    Create a post
// @route   POST /api/posts
// @access  Members

const createPost = asyncHandler(async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      title: req.body.title,
      body: req.body.body,
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

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Members

const updatePost = asyncHandler(async (req, res) => {
  const { title, body, image, thumbnail } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
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

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Members

const deletePost = asyncHandler(async (req, res) => {
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

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
