import {db} from "../config/config.js";

export const getUser =( req,res)=> {
    const sql=` select* from users u`;
    db.query(sql,(err,result)=>{
    if(err){
        console.log(err);
        return res.status(500).json({
            message:Loi
        });
    }
    res.json(result);
});
}