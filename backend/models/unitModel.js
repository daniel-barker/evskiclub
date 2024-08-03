import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
  members: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String },
      phoneNumber: [
        {
          number: { type: String },
          type: { type: String, enum: ["home", "work", "cell"] },
        },
      ],
      honorary: { type: Boolean },
    },
  ],
  addresses: [
    {
      addressType: {
        type: String,
        enum: ["primary", "secondary"],
        required: true,
      },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
  ],
  memberSince: { type: Number, required: true },
  bio: { type: String },
  image: { type: String },
});

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
