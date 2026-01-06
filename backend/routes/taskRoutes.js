const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

const authenticateToken = require("../middleware/authMiddleware");

router.get('/list', authenticateToken, taskController.getTaskList);
router.get('/cleared', authenticateToken, taskController.getClearedTasks);
router.post('/update', authenticateToken, taskController.updateTaskStatus);

module.exports = router;