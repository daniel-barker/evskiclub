import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
