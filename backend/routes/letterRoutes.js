const express = require("express");
const router = express.Router();
const letterController = require("../controllers/letterController");

router.post('/letter/addLetter', letterController.addLetter);

module.exports = router;