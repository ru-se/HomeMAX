
// ルートファイル: backend/routes/complimentRoutes.js
const express = require('express');
const router = express.Router();
const complimentController = require('../controllers/complimentController');

router.post('/generate', complimentController.generateCompliment);
router.get('/list', complimentController.getComplimentList);
router.get('/history', complimentController.getComplimentHistory);
router.get('/history/by-date', complimentController.getComplimentHistoryByDate);
router.get('/stats', complimentController.getStats);

module.exports = router;