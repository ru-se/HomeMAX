//MySQL接続
const connection = require("../config/db");



module.exports = {
    //送られたお手紙をDBに保存
    addLetter: async function (user_id,message) {

        const query = "INSERT INTO Letters(user_id, emessage) VALUES(?,?,?)";

            return new Promise ((resolve, reject) => {
                connection.query(query,[user_id, message],(err,result)=>{
                    if(err){
                        console.log(err);
                        reject({message:"メッセージを追加できませんでした"})
                    }else{
                        console.log(result);
                        resolve(result);

                    }
                })
            
            });
    },
}