const express = require("express");
const router = express.Router();
const taskrController = require("../controllers/taskController");

router.post('/task/addTask', taskrController.addLetter);

module.exports = router;