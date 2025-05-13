//MySQL接続
const connection = require("../config/db");

const bcrypt = require("bcrypt");


module.exports = {
    //サインアップ
    signup: async function (username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);

            const query = "INSERT INTO users(username, email, password) VALUES(?,?,?)";

            return new Promise ((resolve, reject) => {
                connection.query(query,[username, email, hashedPassword],(err,result)=>{
                    if(err){
                        console.log(err);
                        reject({message:"ユーザー登録に失敗しました"});
                    }else{
                        console.log(result);
                        resolve(result);
                    }
                });
            });
    },

    //ログイン
    login:  function (username,password) {
        // DBへの登録確認
        const checkQuery = "SELECT * FROM users WHERE username = ? ";

        return new Promise ((resolve, reject) => {
            connection.query(checkQuery, [username], (err, results) => {
                if (err) {
                    console.log(err);
                    return reject({message:"データベース確認中にエラーが発生しました"});
                }
                if(results.length == 0){
                    console.log("ユーザーが見つからない");
                    return reject({ message: "該当するユーザーが見つかりませんでした" });
                } 
                const user = results[0];    
                bcrypt.compare(password, user.password)
                .then(checkPassword =>{
                    if(checkPassword){
                        console.log("ログイン成功");
                        return resolve(results[0])
        
                    }else{
                        console.log("パスワードが違う");
                        return reject({ message: "パスワードが間違っています" });
                    }
    

                })
                .catch(err => {
                    console.log(err);
                    return reject({ message: "パスワードの検証中にエラーが発生しました" });
                })
             });       
    

        });

    
    }
};



