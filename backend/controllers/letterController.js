// サインアアップ、ログイン機能とか
const Letter = require("../models/letter");


// //JSONの受け取り
// app.use(express.json());

module.exports={
    //DBに新規Letterの追加
    addLetter : async function (req,res){
        try{
                //ログインしていない場合ユーザーIDは0
                let user_id = req.session.user ? req.session.user.user_id : 1; 
                const message = req.body.message;
                // メッセージが空かどうかを確認
                if (!message || message.trim() === "" ) {
                    return res.status(400).json({ error: "メッセージがありません" });
                }

            const result = await Letter.addLetter(user_id,message);
            res.status(200).json({message:"登録成功",result});
        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message});
        }
    },

    //ユーザの全てのLetterを返す
    allLetters : async function (req,res){
        try{
            const user_id = req.body.user_id;
            const result = await Letter.allLetters(user_id);
            res.status(200).json({message:"Letter一覧の取得成功",result});

        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message});
        }

    },
     //ユーザの日付指定されたLetterを返す
     selectLetters : async function (req,res) {
        try{
            const user_id = req.body.user_id;
            const created_at = req.body.created_at;
            const result = await Letter.selectLetter(user_id,created_at);
            
            if (!letter) {
                return res.status(200).json({ message: "メッセージは0件です" });
            }

            res.status(200).json({message:"指定したLetterの取得成功",result});



        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message});
        }
        
     }

};