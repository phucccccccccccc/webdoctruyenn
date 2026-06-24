import { db } from "../config/config.js";

export const getStats = (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM books) AS totalBooks,
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT SUM(total_coin) FROM users) AS totalCoins,
            (SELECT COUNT(*) FROM transactions) AS totalTransactions
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        res.json(result[0]);

    });

}