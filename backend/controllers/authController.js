// サインアアップ、ログイン機能とか
const User = require("../models/User");

// //JSONの受け取り
// app.use(express.json());


//サインアップ
module.exports={
    signup : async function (req,res){
        try{
            console.log(req.body);
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

            const result = await User.signup(username,email,password);
            res.status(200).json({message:"登録成功",username:result.username});
        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message})
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
            req.session.user = {
                id: user.id,
                username: user.username,
            };
            res.status(200).json({message:"ログイン成功",username:user.username})


        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message})

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

