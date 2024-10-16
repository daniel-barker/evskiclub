import express from "express";
const router = express.Router();
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(getEvents).post(protect, admin, createEvent);
router
  .route("/:id")
  .get(checkObjectId, getEventById)
  .put(checkObjectId, protect, admin, updateEvent)
  .delete(checkObjectId, protect, admin, deleteEvent);

export default router;
