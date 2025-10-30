const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 'Bearer <token>' からトークン部分を抽出
            token = req.headers.authorization.split(' ')[1];

            // トークンを検証
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ペイロードからユーザーIDを取得し、DBからユーザー情報を取得（パスワードは除く）
            const [rows] = await pool.execute('SELECT user_id, username, email FROM users WHERE user_id = ?', [decoded.user_id]);
            
            if (rows.length === 0) {
                return res.status(401).json({ message: '認証に失敗しました: ユーザーが見つかりません' });
            }

            // reqオブジェクトにユーザー情報を格納
            req.user = rows[0];

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: '認証に失敗しました: トークンが無効です' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: '認証に失敗しました: トークンがありません' });
    }
};

module.exports = { protect };