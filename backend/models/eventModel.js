import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: false },
  description: { type: String, required: true },
  image: { type: String },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
