const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

router.get('/letters/dailyCount', analysisController.dailyLetterCount);
router.get('/homemax/positiveAspects', analysisController.positiveAspectCounts);

module.exports = router;