const express = require("express");
const router = express.Router();
const { postSchedule } = require("../controller/scheduler");

router.post("/", postSchedule);
module.exports = router;
