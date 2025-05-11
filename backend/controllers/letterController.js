// お手紙機能
const express = require("express");
const app = express();

//MySQL接続
const connection = require("../config/db");

//JSONの受け取り
app.use(express.json());

//送られたお手紙をDBに保存
app.post("/addLetter",(req,res)=>{
    console.log(req.body);
    //ログインしていない場合ユーザーIDは0
    let user_id =req.body.user_id ;
    if(user_id == null || user_id == undefined){
        user_id = 0;
    }  
    const message = req.body.message;
    if (message ==  null || message ==undefined ) {  // messageがない場合
        return res.status(400).json({ error: "メッセージがありません" });
    }

    const query = "INSERT INTO Letters(user_id, emessage) VALUES(?,?,?)";
    connection.query(query,[user_id, message],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).json({error:"メッセージを追加できませんでした"});
        }else{
            res.status(200).json({message:"メッセージを追加できました！"});
            console.log(result);
        }
    })
});


//メッセージが" "の場合もエラー出す？