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
};
export const getPurchasedBooks = (req, res) => {

    const sql = `
        SELECT
            b.*
        FROM user_books ub
        JOIN books b
            ON ub.book_id = b.id
        WHERE ub.user_id = ?
        ORDER BY ub.purchase_date DESC
    `;

    db.query(sql, [req.params.userId], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const updateReadingHistory = (req, res) => {

    const {
        user_id,
        book_id,
        chapter_number,
        last_position
    } = req.body;

    const sql = `
        INSERT INTO reading_history
        (
            user_id,
            book_id,
            chapter_number,
            last_position
        )
        VALUES (?,?,?,?)

        ON DUPLICATE KEY UPDATE

            chapter_number = VALUES(chapter_number),

            last_position = VALUES(last_position),

            last_read_at = CURRENT_TIMESTAMP
    `;

    db.query(
        sql,
        [
            user_id,
            book_id,
            chapter_number,
            last_position
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Đã lưu lịch sử đọc"
            });

        }
    );

};
export const getReadingHistory = (req,res)=>{

    const sql = `
        SELECT

            b.*,

            rh.chapter_number,

            rh.last_read_at

        FROM reading_history rh

        JOIN books b
            ON rh.book_id = b.id

        WHERE rh.user_id = ?

        ORDER BY rh.last_read_at DESC
    `;

    db.query(sql,[req.params.userId],(err,result)=>{

        if(err)
            return res.status(500).json(err);

        res.json(result);

    });

}