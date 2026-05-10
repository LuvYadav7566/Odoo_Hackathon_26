const express = require("express");
const { signup, login, me, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

module.exports = router;

