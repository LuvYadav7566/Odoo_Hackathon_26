const express = require("express");
const { createStop, updateStop, deleteStop, reorderStops } = require("../controllers/stop.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.post("/", createStop);
router.patch("/reorder", reorderStops);
router.route("/:id").put(updateStop).delete(deleteStop);

module.exports = router;

