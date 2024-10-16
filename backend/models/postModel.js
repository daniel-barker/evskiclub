import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String },
    thumbnail: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
