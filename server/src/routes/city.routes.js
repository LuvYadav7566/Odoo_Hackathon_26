const express = require("express");
const { searchCities } = require("../controllers/city.controller");

const router = express.Router();

router.get("/", searchCities);

module.exports = router;

