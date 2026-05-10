const express = require("express");
const { getBudget, upsertBudget } = require("../controllers/budget.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.route("/:tripId").get(getBudget).put(upsertBudget);

module.exports = router;

