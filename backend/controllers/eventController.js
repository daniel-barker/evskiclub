import asyncHandler from "../middleware/asyncHandler.js";
import Event from "../models/eventModel.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Members/Admins

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

// @desc    Create an event
// @route   POST /api/events
// @access  Admins

const createEvent = asyncHandler(async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      allDay: req.body.allDay || false,
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
  const { title, start, end, allDay } = req.body;
  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = title || event.title;
    event.description = description || event.description;
    event.start = start || event.start;
    event.end = end || event.end;
    event.allDay = allDay || event.allDay;

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

export { getEvents, createEvent, updateEvent, deleteEvent };
