import {db} from "../config/config.js";
export const getBooks = (req,res ) => {
    const sql=`SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.cover_image,
                    b.coin_price
                    FROM books b`;
    db.query(sql,(err,result) =>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Loi"
            });
            }
            res.json(result);
        
    });
}