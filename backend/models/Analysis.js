//MySQL接続
const connection = require("../config/db");


module.exports = {

    analysis_letters: function () {

        const query = " \
         SELECT COUNT(*) *1.0 / COUNT(DISTINCT user_id) AS today_active_user_average  \
          FROM Letters \
          WHERE DATE(created_at) = CURDATE() \
           AND user_id <> 0; \
        ";

            return new Promise ((resolve, reject) => {
                connection.query(query,(err,result)=>{
                    if(err){
                        console.log(err);
                        reject({err:"検索できませんでした"});
                    }else{
                        console.log(result);
                        resolve(result[0]);
            
                    }
                });
        
            
            });
    },
};

