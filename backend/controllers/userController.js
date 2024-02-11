import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).send("Username doesn't exist");
  }

  if (user.isApproved === false) {
    res.status(401);
    throw new Error(
      "Account still awaiting approval from an admin. Please contact EVSkiClub Secretary for more information."
    );
  }

  if (await user.matchPassword(password)) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isApproved: user.isApproved,
      position: user.position,
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

// @desc Register user
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  const userByUsername = await User.findOne({ username });
  const userByEmail = await User.findOne({ email });

  if (userByUsername) {
    return res.status(400).send("Username already exists.");
  }

  if (userByEmail) {
    if (!userByEmail.isApproved) {
      return res
        .status(400)
        .send(
          "An account with this email is already registered and awaiting approval."
        );
    } else {
      return res.status(400).send("Email already in use.");
    }
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      position: user.position,
      isApproved: user.isApproved,
    });
  } else {
    res.status(400).send("Invalid user data");
  }
});

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      position: user.position,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Allows a user to update name, email, and password fields
// @desc (things like username, position, and isAdmin should be updated by an admin user only)
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      position: user.position,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get users
// @route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/admin
const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Delete users
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user (Admin only)
// @route PUT /api/users/:id
// @access Private/admin
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body; //Only need to destructure these two as they're the only unique fields

  const userToUpdate = await User.findById(userId);
  if (!userToUpdate) {
    return res.status(404).send("User not found");
  }

  // Check for username uniqueness
  if (username && username !== userToUpdate.username) {
    const existingUserByUsername = await User.findOne({
      username,
      _id: { $ne: userId },
    }); // $ne stands for "not equal", this excludes the current user
    if (existingUserByUsername) {
      return res.status(400).send("Username already exists");
    }
  }

  // Check for email uniqueness
  if (email && email !== userToUpdate.email) {
    const existingUserByEmail = await User.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingUserByEmail) {
      return res.status(400).send("Email already exists");
    }
  }

  // Update fields if provided, otherwise keep existing values
  userToUpdate.username = username || userToUpdate.username;
  userToUpdate.email = email || userToUpdate.email;
  userToUpdate.name = req.body.name || userToUpdate.name;
  userToUpdate.position = req.body.position || userToUpdate.position;
  userToUpdate.isApproved = req.body.isApproved || userToUpdate.isApproved;
  // I chose to leave out the ability to update the isAdmin field for security reasons. Admin flag should only be updated in the database.

  const updatedUser = await userToUpdate.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    position: updatedUser.position,
  });
});

// @desc Forgot password - sends a reset link
// @route POST /api/users/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save();
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  const textMessage = `
    You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link, or paste it into your browser to reset your password:
    \n\n${resetUrl}
    \n\nIf you did not request this, please ignore this email and your password will remain unchanged.
  `;
  const htmlMessage = `
    <p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link, or paste it into your browser to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to: email,
      subject: 'Ellicottville Ski Club Password Reset Request',
      text: textMessage,
      html: htmlMessage,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(500).json({ message: "Email could not be sent" });
  }
});

// @desc Reset user's password
// @route POST /api/users/reset-password/:token
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log(req)
    // Hashes the token to compare with the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Finds the user by the hashed token and ensure the token hasn't expired
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Token is invalid or has expired');
    }

    // Updates the user's password and clear the reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        message: 'Your password has been reset successfully! Please log in with your new password.',
    });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
  forgotPassword,
  resetPassword,
};
