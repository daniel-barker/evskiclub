import express from "express";
const router = express.Router();
import {
  getEvents,
  getFutureEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(protect, getEvents).post(protect, admin, createEvent);
router.route("/future").get(protect, getFutureEvents);
router.route("/past").get(protect, getPastEvents);
router
  .route("/:id")
  .get(protect, checkObjectId, getEventById)
  .put(protect, admin, checkObjectId, updateEvent)
  .delete(protect, admin, checkObjectId, deleteEvent);

export default router;
