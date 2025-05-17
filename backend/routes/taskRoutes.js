const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get('/list', taskController.getTaskList);
router.get('/progress', taskController.getTaskProgress);
router.get('/cleared', taskController.getClearedTasks);
router.post('/update', taskController.updateTaskStatus);

module.exports = router;