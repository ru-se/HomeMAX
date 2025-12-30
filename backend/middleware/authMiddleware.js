const supabase = require('../config/db');

const authenticateToken = async (req, res, next) => {
    // Cookieからトークンを取得
    const token = req.cookies.token;
    console.log("[DEBUG] AuthMiddleware - Cookies:", req.cookies); // クッキー全体
    console.log("[DEBUG] AuthMiddleware - Token found:", !!token);

    if (!token) {
        console.log("[DEBUG] AuthMiddleware - No token provided");
        return res.status(401).json({ error: '認証が必要です' });
    }

    // Supabase Authでトークンを検証
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        console.log("[DEBUG] AuthMiddleware - Validation failed:", error?.message);
        return res.status(403).json({ error: 'トークンが無効です' });
    }

    // req.user にユーザー情報をセット (SupabaseのUserオブジェクト)
    // コントローラー側で req.user.user_id を期待しているためマッピング
    user.user_id = user.id;
    req.user = user;
    next();
};

module.exports = authenticateToken;
