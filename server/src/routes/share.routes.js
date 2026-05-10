const express = require("express");
const { createShare, getPublicTrip, copyPublicTrip } = require("../controllers/share.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:publicId", getPublicTrip);
router.post("/:publicId/copy", protect, copyPublicTrip);
router.post("/trip/:tripId", protect, createShare);

module.exports = router;

