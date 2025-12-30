const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const authenticateToken = require('../middleware/authMiddleware');

// 認証が必要なルート
router.post('/create', authenticateToken, shareController.createLink);

// パブリックルート (閲覧・リアクション)
router.get('/:token', shareController.getSharedContent);
router.post('/:token/react', shareController.addReaction);

module.exports = router;
