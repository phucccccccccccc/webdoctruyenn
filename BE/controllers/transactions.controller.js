import { db } from "../config/config.js";

export const getTransactions = (req, res) => {

    const sql = `
        SELECT
    t.id,
   u.username ,
    t.amount,
    t.type,
    t.description,
    t.created_at
FROM transactions t
LEFT JOIN users u
ON t.user_id = u.id
ORDER BY t.created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        res.json(result);

    });

};