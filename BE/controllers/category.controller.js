import {db} from "../config/config.js";

export const getCategory =(req,res) => {
    const sql =`select c.id,c.name,c.slug,c.description
                from categories c
                `;
    db.query(sql,(err,result) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Loi"
            });
        }
        res.json(result);
});

}