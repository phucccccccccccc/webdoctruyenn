import {db} from "../config/config.js";


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