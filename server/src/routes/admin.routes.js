const express = require("express");
const { getAnalytics } = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/analytics", protect, adminOnly, getAnalytics);

module.exports = router;

