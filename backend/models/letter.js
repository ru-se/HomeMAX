//MySQL接続
const connection = require("../config/db");
const { selectLetters } = require("../controllers/letterController");



module.exports = {
    //送られたお手紙をDBに保存
    addLetter: async function (user_id,message) {

        const query = "INSERT INTO Letters(user_id, message) VALUES(?,?)";

            return new Promise ((resolve, reject) => {
                connection.query(query,[user_id, message],(err,result)=>{
                    if(err){
                        console.log(err);
                        return reject({message:"メッセージを追加できませんでした"})
                    }else{
                        console.log(result);
                        return resolve({ insertId: result.insertId });
                    }
                })
            
            });
    },

    //ユーザー名を指定して全てのLetterを返す
    allLetters:function (user_id){

        const query= "SELECT * FROM Letters WHERE user_id = ?"

        return new Promise ((resolve, reject) => {
            connection.query(query,[user_id],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({message:"検索できませんでした"})
                }else{
                    console.log(result);
                    console.log("------------------")
                    return resolve(result);

                }
            })
        
        });



    },

    //指定された日付のユーザーのLetterを返す
    selectLetters: function(user_id,created_at){
        const query= "SELECT * FROM Letters WHERE user_id = ? AND DATE(created_at) = ?"
        return new Promise ((resolve, reject) => {
            connection.query(query,[user_id,created_at],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject({message:"検索できませんでした"});
                }

                if (result.length === 0) {
                    // 見つからなかったときの処理
                    return resolve(null);
                }else{
                    console.log(result);
                    return resolve(result[0]);

                }

                   
            })
        
        });


    }

}
