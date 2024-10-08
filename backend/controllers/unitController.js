import asyncHandler from "../middleware/asyncHandler.js";
import Unit from "../models/unitModel.js";
import fs from "fs";

// While each member has their own membership,
// two members who are in a relatiopnship or marriage
// may share a membership. This is called a 'unit' of membership.
// A unit is a collection of members and their addresses

// @desc: Create a 'unit' of membership
// @route: POST /api/unit
// @access: Admins

const createUnit = asyncHandler(async (req, res) => {
  try {
    const unit = new Unit({
      members: req.body.members,
      addresses: req.body.addresses,
      memberSince: req.body.memberSince,
      image: req.body.image,
      bio: req.body.bio,
    });

    const createdUnit = await unit.save();
    res.status(201).json(createdUnit);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc: Get all units
// @route: GET /api/unit
// @access: Members only

const getUnits = asyncHandler(async (req, res) => {
  const units = await Unit.find({})
    .sort({ "members.0.lastName": 1 }) // 1 for ascending, -1 for descending
    .exec();

  res.json(units);
});

// @desc: Get single unit by ID
// @route: GET /api/unit/:id
// @access: Members only

const getSingleUnit = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  if (unit) {
    res.json(unit);
  } else {
    res.status(404);
    throw new Error("Unit not found");
  }
});

// @desc: Update a unit
// @route: PUT /api/unit/:id
// @access: Admins

const updateUnit = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  if (unit) {
    unit.members = req.body.members || unit.members;
    unit.addresses = req.body.addresses || unit.addresses;
    unit.memberSince = req.body.memberSince || unit.memberSince;
    unit.image = req.body.image || unit.image;
    unit.bio = req.body.bio || unit.bio;

    const updatedUnit = await unit.save();
    res.json(updatedUnit);
  } else {
    res.status(404);
    throw new Error("Unit not found");
  }
});

// @desc: Delete a unit
// @route: DELETE /api/unit/:id
// @access: Admins

const deleteUnit = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  if (unit) {
    if (unit.image) {
      const path = `frontend/public/${unit.image}`;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }
    await unit.deleteOne({ _id: req.params.id });
    res.json({ message: "Unit removed" });
  } else {
    res.status(404);
    throw new Error("Unit not found");
  }
});

export { createUnit, getUnits, getSingleUnit, updateUnit, deleteUnit };
