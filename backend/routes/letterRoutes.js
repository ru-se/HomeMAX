const express = require("express");
const router = express.Router();

const letterController = require("../controllers/letterController");

router.post('/addLetter', letterController.addLetter);
router.post('/allLetters', letterController.allLetters);

module.exports = router;