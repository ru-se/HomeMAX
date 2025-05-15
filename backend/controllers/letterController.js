// サインアアップ、ログイン機能とか
const Letter = require("../models/Letter");


// //JSONの受け取り
// app.use(express.json());

module.exports={
    addLetter : async function (req,res){
        try{
                //ログインしていない場合ユーザーIDは0
                let user_id =req.body.user_id ;
                if(user_id == null || user_id == undefined){
                    user_id = 0;
                }  
                const message = req.body.message;
                // if (message ==  null || message ==undefined ) {  // messageがない場合
                //     return res.status(400).json({ error: "メッセージがありません" });
                // }
                // メッセージが空かどうかを確認
                if (!message || message.trim() === "" ) {
                    return res.status(400).json({ error: "メッセージがありません" });
                }

            const result = await Letter.addLetter(user_id,message);
            res.status(200).json({message:"登録成功",result});
        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message})
        }
    },
};