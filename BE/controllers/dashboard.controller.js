import { db } from "../config/config.js";

export const getStats = (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM books) AS totalBooks,
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT IFNULL(SUM(total_coin),0) FROM users) AS totalCoins,
            (SELECT COUNT(*) FROM transactions) AS totalTransactions
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result[0]);

    });

};

export const getRevenue = (req, res) => {

    const sql = `
        SELECT
            DATE(created_at) AS day,
            SUM(amount) AS revenue
        FROM transactions
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY day
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getSales = (req, res) => {

    const sql = `
        SELECT
            (
                SELECT COUNT(*)
                FROM transactions
                WHERE YEARWEEK(created_at)=YEARWEEK(CURDATE())
            ) AS week,

            (
                SELECT COUNT(*)
                FROM transactions
                WHERE MONTH(created_at)=MONTH(CURDATE())
                AND YEAR(created_at)=YEAR(CURDATE())
            ) AS month,

            (
                SELECT COUNT(*)
                FROM transactions
                WHERE YEAR(created_at)=YEAR(CURDATE())
            ) AS year
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result[0]);

    });

};
export const getTopSales = (req, res) => {

    const sql = `
        SELECT
            b.id,
            b.title,
            COUNT(*) AS total_sales
        FROM user_books ub
        JOIN books b
            ON ub.book_id = b.id
        GROUP BY b.id
        ORDER BY total_sales DESC
        LIMIT 5
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getTopReading = (req, res) => {

    const sql = `
        SELECT

            b.id,

            b.title,

            COUNT(rh.user_id) AS total_read

        FROM books b

        LEFT JOIN reading_history rh

        ON b.id = rh.book_id

        GROUP BY b.id

        ORDER BY total_read DESC

        LIMIT 5
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getRecentTransactions = (req, res) => {

    const sql = `
SELECT
    t.id,
    u.username,
    t.description AS title,
    t.amount,
    t.created_at
FROM transactions t
JOIN users u
    ON u.id = t.user_id
ORDER BY t.created_at DESC
LIMIT 10;
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};