import { db } from "../config/config.js";

export const getAllTransactions = (req, res) => {

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
export const getTransactions = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            amount,
            type,
            description,
            created_at
        FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};