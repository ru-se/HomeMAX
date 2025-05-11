// サインアアップ、ログイン機能とか
const express = require("express");
const app = express();

//ハッシュ化
const bcrypt = require("bcrypt");

//MySQL接続
const connection = require("../config/db");

//JSONの受け取り
app.use(express.json());


//サインアップ
app.post("/signUp",async (req,res)=>{
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users(username, email, password) VALUES(?,?,?)";
    connection.query(query,[username, email, hashedPassword],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({err:"追加できませんでした"});
        }else{
            res.status(200).json({message:"追加できました！"});
            console.log(result);
        }
    })
});

//ログイン
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // DBへの登録確認
    const checkQuery = "SELECT * FROM users WHERE username = ? ";

    connection.query(checkQuery, [username],async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "確認中にエラーが発生しました" });
        }

        if(results.length == 0){
            console.log(err);
            res.status(400).json({message:"該当するユーザーが存在しません"});
        }

        const checkPassword = await bcrypt.compare(password, results[0].password);
        if(checkPassword){
            console.log("ログイン成功");
            res.status(200).json({message:"ログイン成功",username:results[0].username})
        }else{
            console.log("パスワードが違う");
            res.status(400).json({message:"パスワードが違います"})
        }

    });
    
});

