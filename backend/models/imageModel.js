import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
  image: { type: String, required: true },
  thumbnail: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  carousel: { type: Boolean, required: true, default: false },
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
