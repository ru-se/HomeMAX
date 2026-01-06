// サインアアップ、ログイン機能とか
const Letter = require("../models/letter");


// //JSONの受け取り
// app.use(express.json());

module.exports = {
    //DBに新規Letterの追加
    //DBに新規Letterの追加
    addLetter: async function (req, res) {
        try {
            // ログインユーザーID (middlewareから取得推奨だが、bodyから渡される実装に合わせる)
            const user_id = req.user ? req.user.user_id : req.body.user_id;
            const message = req.body.message;

            if (!user_id) {
                return res.status(401).json({ error: "認証されていません" });
            }

            // メッセージが空かどうかを確認
            if (!message || message.trim() === "") {
                return res.status(400).json({ error: "メッセージがありません" });
            }

            // createLetter を使用 (return data contains the new row)
            const result = await Letter.createLetter(user_id, message);

            // 経験値を加算 (手紙はXP高め: 50XP)
            // これにより、もしLv1(0XP)なら、50XP獲得でLv2(50XP)に上がり、即ギャルモード解禁が可能
            const User = require("../models/user");
            const xpResult = await User.addXp(user_id, 50);

            // Result is the inserted letter object
            res.status(200).json({ message: "登録成功", result, xpResult });
        } catch (err) {
            console.error("[ERROR] addLetter failed:", err);
            res.status(500).json({ message: err.message });
        }
    },

    //ユーザの全てのLetterを返す
    allLetters: async function (req, res) {
        try {
            const user_id = req.body.user_id;
            const result = await Letter.allLetters(user_id);
            res.status(200).json({ message: "Letter一覧の取得成功", result });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }

    },
    //ユーザの日付指定されたLetterを返す
    selectLetters: async function (req, res) {
        try {
            const user_id = req.body.user_id;
            const created_at = req.body.created_at;
            const result = await Letter.selectLetter(user_id, created_at);

            if (!letter) {
                return res.status(200).json({ message: "メッセージは0件です" });
            }

            res.status(200).json({ message: "指定したLetterの取得成功", result });



        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }

    }

};