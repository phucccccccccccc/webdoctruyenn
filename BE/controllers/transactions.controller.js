import {db} from "../config/config.js";

export const getTransactions =(req,res) =>{
    const sql=`select u.username,t.amount,t.type,t.description,t.created_at
            from transactions t join users u on t.user_id=u.id
            `;
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Loi"
            });
        }
        res.json(result);

    });
}