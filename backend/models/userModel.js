import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name1: {
      type: String,
      required: true,
      unique: true,
    },
    name2: {
      type: String,
      required: false,
      unique: true,
    },
    email1: {
      type: String,
      required: true,
      unique: true,
    },
    email2: {
      type: String,
      required: false,
      unique: true,
    },
    bio: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      required: false,
    },
    phone1: {
      type: String,
      required: false,
    },
    phone2: {
      type: String,
      required: false,
    },
    address1: {
      type: String,
      required: false,
    },
    address2: {
      type: String,
      required: false,
    },
    memberSince: {
      type: String,
      required: true,
      default: "2023",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    position: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
