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

        // Check and unlock achievements
        try {
            const achievementModel = require('../models/achievement');
            await achievementModel.checkAndUnlockAchievements(data.user.id);
        } catch (achievementError) {
            console.error("Achievement check error during login:", achievementError);
        }

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

// 1-2. X/Twitterログイン開始
exports.loginTwitter = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: 'http://localhost:5173/auth/callback',
                skipBrowserRedirect: false,
            },
        });
        if (error) throw error;
        res.redirect(data.url);
    } catch (err) {
        console.error("Twitter Auth Error:", err);
        res.status(500).json({ error: '認証リダイレクトに失敗しました' });
    }
};

// 1. Googleログイン開始 (Google認証ページへリダイレクト)
exports.loginGoogle = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173/auth/callback', // フロントエンドのCallback URL
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                skipBrowserRedirect: false,
            },
        });

        if (error) throw error;
        // Googleの認証ページへリダイレクト
        res.redirect(data.url);

    } catch (err) {
        console.error("Link Gen Error:", err);
        res.status(500).json({ error: '認証リダイレクトに失敗しました' });
    }
};

// 2. Callback処理 (ハッシュフラグメントからトークンを取得してCookieセット)
exports.oauthCallback = async (req, res) => {
    try {
        // Implicit Flowの場合、トークンはハッシュフラグメントに来るので
        // フロントエンド側で処理する必要がある
        // 一時的なHTMLページを返してJavaScriptでハッシュを処理
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>認証中...</title>
</head>
<body>
    <h1>認証処理中...</h1>
    <script>
        // ハッシュフラグメントからaccess_tokenを取得
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        
        if (access_token) {
            // バックエンドにトークンを送信してCookieをセット
            fetch('/auth/set-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token, refresh_token }),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'http://localhost:5173/home';
                } else {
                    window.location.href = 'http://localhost:5173/login?error=session_failed';
                }
            })
            .catch(err => {
                console.error(err);
                window.location.href = 'http://localhost:5173/login?error=server_error';
            });
        } else {
            window.location.href = 'http://localhost:5173/login?error=no_token';
        }
    </script>
</body>
</html>
        `;

        res.send(html);

    } catch (err) {
        console.error("OAuth Callback Error:", err);
        res.redirect('http://localhost:5173/login?error=server_error');
    }
};

// 3. セッション設定（トークンを受け取ってCookieにセット）
exports.setSession = async (req, res) => {
    try {
        const { access_token, refresh_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ success: false, error: 'トークンが不足しています' });
        }

        // トークンを使ってSupabaseからユーザー情報を取得
        const { data: { user }, error } = await supabase.auth.getUser(access_token);

        if (error || !user) {
            return res.status(401).json({ success: false, error: '無効なトークンです' });
        }

        // DB同期: 独自のusersテーブルを確認・作成
        let dbUser = await userModel.findById(user.id);

        if (!dbUser) {
            console.log("SSO First Login: Creating user record...", user.id);
            const name = user.user_metadata.full_name || user.user_metadata.name || user.email.split('@')[0];
            try {
                dbUser = await userModel.createUser(user.id, user.email, name);
            } catch (createError) {
                console.error("SSO Create User Error:", createError);
                return res.status(500).json({ success: false, error: 'ユーザー作成に失敗しました' });
            }
        }

        // HTTP-only Cookieをセット
        res.cookie('token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Check and unlock achievements for new or returning users
        try {
            const achievementModel = require('../models/achievement');
            await achievementModel.checkAndUnlockAchievements(user.id);
        } catch (achievementError) {
            console.error("Achievement check error during login:", achievementError);
            // Don't fail login if achievement check fails
        }

        res.json({ success: true, user: dbUser });

    } catch (err) {
        console.error("Set Session Error:", err);
        res.status(500).json({ success: false, error: '認証処理に失敗しました' });
    }
};