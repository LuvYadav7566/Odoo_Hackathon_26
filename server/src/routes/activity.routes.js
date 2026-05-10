const express = require("express");
const { searchActivities, createActivity, updateActivity, deleteActivity } = require("../controllers/activity.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/search", searchActivities);
router.use(protect);
router.post("/", createActivity);
router.route("/:id").put(updateActivity).delete(deleteActivity);

module.exports = router;

