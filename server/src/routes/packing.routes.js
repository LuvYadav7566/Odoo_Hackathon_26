const express = require("express");
const { listPacking, createPacking, updatePacking, deletePacking } = require("../controllers/packing.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.get("/:tripId", listPacking);
router.post("/", createPacking);
router.route("/:id").put(updatePacking).delete(deletePacking);

module.exports = router;

