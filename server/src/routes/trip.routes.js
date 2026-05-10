const express = require("express");
const { listTrips, getTrip, createTrip, updateTrip, deleteTrip } = require("../controllers/trip.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.route("/").get(listTrips).post(createTrip);
router.route("/:id").get(getTrip).put(updateTrip).delete(deleteTrip);

module.exports = router;

