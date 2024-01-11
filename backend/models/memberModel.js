import mongoose from "mongoose";

const memberSchema = mongoose.Schema({
  name1: { type: String, required: true },
  name2: { type: String },
  name3: { type: String },
  address1: { type: String, required: true },
  address2: { type: String },
  address3: { type: String },
  phone1: { type: String, required: true },
  phone2: { type: String },
  phone3: { type: String },
  email1: { type: String, required: true },
  email2: { type: String },
  email3: { type: String },
  memberSince: { type: String, required: true },
  picture: { type: String },
});

const Member = mongoose.model("Member", memberSchema);

export default Member;
