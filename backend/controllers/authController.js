const userModel = require('../models/user');
const supabase = require('../config/db');

exports.signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // 【追加】簡易バリデーション
        if (!email || !password || !username) {
            return res.status(400).json({ error: '必須項目が不足しています' });
        }

        // 1. Supabase Authでユーザー作成
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        // 2. 独自のusersテーブルに保存
        if (authData.user) {
            try {
                // authData.user.id は UUID です
                const newUser = await userModel.createUser(authData.user.id, email, username);

                // セッションがある場合（メール確認不要設定など）はクッキーセット
                if (authData.session) {
                    res.cookie('token', authData.session.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000 
                    });
                }

                res.status(201).json({
                    message: 'ユーザー登録完了',
                    user: newUser
                });

            } catch (dbError) {
                console.error("DB Create User Error:", dbError);
                
                // 【重要】データの整合性を保つため、DB保存に失敗したら
                // Supabase Auth側に作られたユーザーも削除する（ロールバック処理）
                // ※ Service Role Keyを使っている場合のみ機能します。
                //   クライアントキーの場合は削除できないので、エラーログを残して手動対応になりますが、
                //   ここでは概念として記述します。
                await supabase.auth.admin.deleteUser(authData.user.id).catch(e => console.error(e));

                return res.status(500).json({ error: 'ユーザー情報の保存に失敗しました。もう一度お試しください。' });
            }
        } else {
            res.status(200).json({ message: '確認メールを送信しました。' });
        }

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
};

exports.login = async (req, res) => {
    // ... (既存のコードでOKですが、res.cookieの設定はSignupと共通化しても良いです)
    // login処理は元のままでも機能的には問題ありません
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: 'メールアドレスまたはパスワードが間違っています' });
        }

        const token = data.session.access_token;
        const userDetails = await userModel.findById(data.user.id);

        if (!userDetails) {
            return res.status(500).json({ error: 'ユーザー情報が見つかりません' });
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'ログイン成功',
            user: userDetails
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'ログイン中にエラーが発生しました' });
    }
};

// ... logout, getMe はそのままでOK
// ... getMeの userModel.findById(user.id) は UUIDで検索するようになるので正しく動作します
exports.logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Supabase SignOut Error:", error);

    res.clearCookie('token');
    res.json({ message: 'ログアウトしました' });
};

exports.getMe = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: '未認証' });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(403).json({ error: 'トークンが無効' });
    }

    const userDetails = await userModel.findById(user.id);
    if (!userDetails) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json({ user: userDetails });
};