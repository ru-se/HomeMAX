const express = require('express');
const router = express.Router();
const complimentController = require('../controllers/complimentController');

// POST: 手紙をもとに褒め言葉生成
router.post('/generate', complimentController.generateCompliment);

// GET: 褒め言葉一覧
router.get('/list', complimentController.getComplimentList);

// GET: 手紙＋褒め言葉 履歴
router.get('/history', complimentController.getComplimentHistory);

module.exports = router;
