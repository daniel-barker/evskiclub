import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
  members: [
    {
      name: { type: String, required: true },
      email: { type: String },
      image: { type: String },
      phoneNumber: [
        {
          number: { type: String },
          type: { type: String, enum: ["home", "work", "cell"] },
        },
      ],
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
});

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;