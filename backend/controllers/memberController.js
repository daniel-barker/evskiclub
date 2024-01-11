import asyncHandler from "../middleware/asyncHandler.js";
import Member from "../models/memberModel.js";

// @desc    Get all members
// @route   GET /api/members
// @access  Members/Admins

const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find({});
  res.json(members);
});

// @desc    Get member by ID
// @route   GET /api/members/:id
// @access  Members/Admins

const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    res.json(member);
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc    Create a member
// @route   POST /api/members
// @access  Admins

const createMember = asyncHandler(async (req, res) => {
  try {
    const member = new Member({
      name1: req.body.name1,
      name2: req.body.name2,
      name3: req.body.name3,
      address1: req.body.address1,
      address2: req.body.address2,
      address3: req.body.address3,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      phone3: req.body.phone3,
      email1: req.body.email1,
      email2: req.body.email2,
      email3: req.body.email3,
      memberSince: req.body.memberSince,
      picture: req.body.picture,
      thumbnail: req.body.thumbnail,
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Admins

const updateMember = asyncHandler(async (req, res) => {
  const {
    name1,
    name2,
    name3,
    address1,
    address2,
    address3,
    phone1,
    phone2,
    phone3,
    email1,
    email2,
    email3,
    memberSince,
    picture,
    thumbnail,
  } = req.body;
  const member = await Member.findById(req.params.id);

  if (member) {
    member.name1 = name1;
    member.name2 = name2;
    member.name3 = name3;
    member.address1 = address1;
    member.address2 = address2;
    member.address3 = address3;
    member.phone1 = phone1;
    member.phone2 = phone2;
    member.phone3 = phone3;
    member.email1 = email1;
    member.email2 = email2;
    member.email3 = email3;
    member.memberSince = memberSince;
    member.picture = picture;
    member.thumbnail = thumbnail;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Admins

const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    await member.deleteOne({ _id: member._id });
    res.json({ message: "Member removed" });
  } else {
    res.status(404);
    throw new Error("Member not found");
  }
});

export { getMembers, getMemberById, createMember, updateMember, deleteMember };
