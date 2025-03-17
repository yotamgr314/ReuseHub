const express = require("express");
const { getLeaderboard } = require("../controllers/leaderBoardController");
const router = express.Router();

router.get("/", getLeaderboard);

module.exports = router;

