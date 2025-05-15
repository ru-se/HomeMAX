const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

router.get('/letters', analysisController.analysis_letters);



module.exports = router;