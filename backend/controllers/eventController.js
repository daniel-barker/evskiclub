import asyncHandler from "../middleware/asyncHandler.js";
import Event from "../models/eventModel.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Members/Admins

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

// @desc   Get all future events
// @route  GET /api/events/future
// @access Members/Admins

const getFutureEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ date: { $gte: new Date() } });
  res.json(events);
});

// @desc   Get all past events
// @route  GET /api/events/past
// @access Members/Admins

const getPastEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ date: { $lt: new Date() } });
  res.json(events);
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Members/Admins

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Admins

const createEvent = asyncHandler(async (req, res) => {
  try {
    const event = new Event({
      user: req.user._id,
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      thumbnail: req.body.thumbnail,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Admins

const updateEvent = asyncHandler(async (req, res) => {
  const { title, date, location, description, image, thumbnail } = req.body;
  const event = await Event.findById(req.params.id);

  console.log(event);
  if (event) {
    event.title = title;
    event.date = date;
    event.location = location;
    event.description = description;
    event.image = image;
    event.thumbnail = thumbnail;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Admins

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne({ _id: event._id });
    res.json({ message: "Event removed" });
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

export {
  getEvents,
  getFutureEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
