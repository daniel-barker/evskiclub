import mongoose from "mongoose";

const newsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    post: { type: String, required: true },
    image: { type: String },
    thumbnail: { type: String },
    isPublished: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);

export default News;
