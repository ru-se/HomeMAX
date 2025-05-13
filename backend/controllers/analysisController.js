// 分析機能
const express = require("express");
const connection = require("../config/db");
const app = express();


//1ユーザーあたり1日に何個送信されるか
app.get("analysis_letters",(req,res)=>{
    const query = " \
     SELECT COUNT(*) *1.0 / COUNT(DISTINCT user_id) AS today_active_user_average  \
      FROM Letters \
      WHERE DATE(created_at) = CURDATE() \
       AND AND user_id <> 0; \
    ";
    connection.query(query,(ree,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({err:"検索できませんでした"});
        }else{
            console.log(result);
            res.status(200).json(result);

        }
    });
});