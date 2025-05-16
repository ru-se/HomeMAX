// サインアアップ、ログイン機能とか
const Analysis = require("../models/Analysis");

//1ユーザーあたり1日に何個送信されるか

module.exports={
    analysis_letters : async function (req,res){
        try{
            const result = await Analysis.analysis_letters();
            res.status(200).json({message:"平均分析成功",username:result.username});
        }catch(err){
            console.log(err);
            res.status(500).json({message:err.message})
        }
    },

}

