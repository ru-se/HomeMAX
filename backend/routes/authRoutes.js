const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// 認証ルート
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.get('/login/google', authController.loginGoogle);
router.get('/login/twitter', authController.loginTwitter);
router.get('/callback', authController.oauthCallback);
router.post('/set-session', authController.setSession); // セッション設定

module.exports = router;