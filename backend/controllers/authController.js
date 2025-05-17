// サインアアップ、ログイン機能とか
const User = require("../models/User");
const bcrypt = require("bcrypt");
const connection = require("../config/db");

// //JSONの受け取り
// app.use(express.json());


//サインアップ
module.exports = {
    //サインアップ
    signup: async function (req, res) {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = "INSERT INTO users(username, email, password) VALUES(?,?,?)";
            connection.query(query, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "ユーザー登録に失敗しました" });
                } else {
                    // ユーザーID取得
                    const userId = result.insertId;
                    // 初期タスクを追加
                    const taskQuery = `
                    INSERT INTO Tasks (task_title, task_name, task_type, status, user_id) VALUES
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?)
                    `;

                    const initialTasks = [
                    "起床", "起きたあなた、まず一歩踏み出しただけで本当に偉い！", "当たり前タスク", "false", userId,
                    "パソコン画面開く", "画面を灯したあなた、今日も世界にアクセスする覚悟ができてるね！", "当たり前タスク", "false", userId,
                    "パソコン開く", "パソコンを開いたその瞬間、あなたの冒険がまた始まった！", "当たり前タスク", "false", userId,
                    "キーボード入力", "一文字打ったあなたの手、確かに未来を動かしてるよ。", "当たり前タスク", "false", userId,
                    "アプリ起動", "アプリを起動したあなた、その行動が未来につながってる！", "当たり前タスク", "false", userId,
                    "サインアップ完了", "サインアップを完了したあなた、もう新世界の住人です！", "当たり前タスク", "false", userId,
                    "ログイン", "ログインしたあなた、今日もこの世界に確かに存在しています！", "当たり前タスク", "false", userId,
                    "早朝ログイン", "誰よりも早くログインしたあなた、まさに先頭を走る光だね！", "当たり前タスク", "false", userId,
                    "ユーザー名正式入力", "名前を入力したあなた、その一行がこの物語の主役の証！", "当たり前タスク", "false", userId,
                    "パスワード正式入力", "パスワードをしっかり入力できたあなた、セキュリティも気持ちも完璧です！", "当たり前タスク", "false", userId,
                    "（英語？アルファベット？）使用", "アルファベットを使えたあなた、もはや言語の魔法使いだね！", "当たり前タスク", "false", userId,
                    "お手紙書いた", "手紙を書いたあなた、ちゃんと誰かを思えるってすごい力だよ。", "当たり前タスク", "false", userId,
                    "褒められた", "褒められたあなた、その実力と優しさは本物だね！", "当たり前タスク", "false", userId,
                    "ほめマックスの隠れた帽子を探す", "ぼ、ぼくの帽子…！見つけてくれてありがとう、君、天才なの…！", "隠しタスク", "false", userId,
                    "ほめマックスを撫でる", "やさしく撫でられたほめマックスは、今、幸せゲージ MAX！", "隠しタスク", "false", userId,
                    "いつもありがとうと言う", "“ありがとう” が届きました。あなたの心意気、世界をあたためるね！", "隠しタスク", "false", userId
                    ];

                    connection.query(taskQuery, initialTasks, (taskErr) => {
                    if (taskErr) {
                        console.log(taskErr);
                    }
                    return res.status(200).json({ message: "登録成功！ログインしてください" });
                    });
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "ユーザー登録に失敗しました" });
        }
    },

    login : async function (req,res){
        try{
            console.log(req.body);
            const username = req.body.username;
            const password = req.body.password;

            const user = await User.login(username,password);
            if(!user){
                return res.status(400).json({ message: "ユーザー名またはパスワードが正しくありません" })
            }

            //  セッションにユーザー情報を保存
            req.session.user = user;
            res.status(200).json({message:"ログイン成功",username:user.username})


        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message})

        }

    },

    getCurrentUser: function (req, res) {
        if (req.session.user) {
        console.log(req.session.user);
        res.json({ user: req.session.user });
        } else {
        res.status(401).json({ user: null });
        }
    },

     //ログアウト
    logout: function (req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "ログアウトに失敗しました" });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: "ログアウトしました" });
        });
    }

};

// //サインアップ
// app.post("/signUp",async (req,res)=>{
//     console.log(req.body);
//     const username = req.body.username;
//     const email = req.body.email;
//     const password = req.body.password;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const query = "INSERT INTO users(username, email, password) VALUES(?,?,?)";
//     connection.query(query,[username, email, hashedPassword],(err,result)=>{
//         if(err){
//             console.log(err);
//             res.status(500).send({err:"追加できませんでした"});
//         }else{
//             res.status(200).json({message:"追加できました！"});
//             console.log(result);
//         }
//     })
// });

// //ログイン
// app.post("/login", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     // DBへの登録確認
//     const checkQuery = "SELECT * FROM users WHERE username = ? ";

//     connection.query(checkQuery, [username],async (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ error: "確認中にエラーが発生しました" });
//         }

//         if(results.length == 0){
//             console.log(err);
//             res.status(400).json({message:"該当するユーザーが存在しません"});
//         }

//         const checkPassword = await bcrypt.compare(password, results[0].password);
//         if(checkPassword){
//             console.log("ログイン成功");
//             res.status(200).json({message:"ログイン成功",username:results[0].username})
//         }else{
//             console.log("パスワードが違う");
//             res.status(400).json({message:"パスワードが違います"})
//         }

//     });
    
// });

