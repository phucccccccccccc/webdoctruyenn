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
export const getFeaturedBooks = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            author,
            cover_image,
            coin_price
        FROM books
        ORDER BY views DESC
        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi"
            });

        }

        res.json(result);

    });

};

export const getNewBooks = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            author,
            cover_image,
            coin_price
        FROM books
        ORDER BY created_at DESC
        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi"
            });

        }

        res.json(result);

    });

};
export const getBooksByCategory = (req, res) => {

    const categoryId = req.params.id;

    const sql = `
        SELECT
            b.id,
            b.title,
            b.author,
            b.cover_image,
            b.coin_price
        FROM books b
        INNER JOIN book_categories bc
            ON b.id = bc.book_id
        WHERE bc.category_id = ?
    `;

    db.query(sql, [categoryId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi"
            });

        }

        res.json(result);

    });

}