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
            'spend' AS type,
            description,
            created_at
        FROM transactions
        WHERE user_id = ?

        UNION ALL

       SELECT
    id,
    coin AS amount,
    'topup' AS type,
    CONCAT(
        'Nạp gói ',
        coin,
        ' Coin (',
        FORMAT(amount, 0),
        'đ)'
    ) AS description,
    created_at
FROM payments
WHERE user_id = ?
AND status = 'paid'
    `;

    db.query(sql, [userId, userId], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getTransactionStatistics = (req, res) => {

    const sql = `
        SELECT

            COUNT(*) AS totalTransactions,

            SUM(
                CASE
                    WHEN type = 'earn'
                    THEN 1
                    ELSE 0
                END
            ) AS totalRecharge,

            SUM(
                CASE
                    WHEN type = 'spend'
                    THEN 1
                    ELSE 0
                END
            ) AS totalPurchase,

            IFNULL(
                SUM(
                    CASE
                        WHEN type = 'earn'
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS totalCoinRecharge,

            IFNULL(
                SUM(
                    CASE
                        WHEN type = 'spend'
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS totalRevenue

        FROM transactions
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

};
export const  getTransactionChart = (req, res) => {

    const { type } = req.query;

    let sql = "";

    if (type === "week") {

        sql = `
            SELECT
                DATE(created_at) AS label,

                SUM(
                    CASE
                        WHEN type = 'spend' THEN amount
                        ELSE 0
                    END
                ) AS spend,

                SUM(
                    CASE
                        WHEN type = 'earn' THEN amount
                        ELSE 0
                    END
                ) AS earn

            FROM transactions

            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)

            GROUP BY DATE(created_at)

            ORDER BY DATE(created_at)
        `;

    }

    else if (type === "month") {

        sql = `
            SELECT
                MONTH(created_at) AS label,

                SUM(
                    CASE
                        WHEN type = 'spend' THEN amount
                        ELSE 0
                    END
                ) AS spend,

                SUM(
                    CASE
                        WHEN type = 'earn' THEN amount
                        ELSE 0
                    END
                ) AS earn

            FROM transactions

            WHERE YEAR(created_at) = YEAR(CURDATE())

            GROUP BY MONTH(created_at)

            ORDER BY MONTH(created_at)
        `;

    }

    else {

        sql = `
            SELECT
                YEAR(created_at) AS label,

                SUM(
                    CASE
                        WHEN type = 'spend' THEN amount
                        ELSE 0
                    END
                ) AS spend,

                SUM(
                    CASE
                        WHEN type = 'earn' THEN amount
                        ELSE 0
                    END
                ) AS earn

            FROM transactions

            GROUP BY YEAR(created_at)

            ORDER BY YEAR(created_at)
        `;

    }

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        if (type === "week") {

            const data = [];

            for (let i = 6; i >= 0; i--) {

                const d = new Date();

                d.setDate(d.getDate() - i);

                const key = d.toISOString().slice(0, 10);

                const found = result.find(
                    x => x.label.toISOString().slice(0, 10) === key
                );

                data.push({

                    label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,

                    spend: found ? Number(found.spend) : 0,

                    earn: found ? Number(found.earn) : 0

                });

            }

            return res.json(data);

        }

        if (type === "month") {

            const data = [];

            for (let i = 1; i <= 12; i++) {

                const found = result.find(
                    x => Number(x.label) === i
                );

                data.push({

                    label: `T${i}`,

                    spend: found ? Number(found.spend) : 0,

                    earn: found ? Number(found.earn) : 0

                });

            }

            return res.json(data);

        }

        const data = result.map(item => ({

            label: item.label.toString(),

            spend: Number(item.spend),

            earn: Number(item.earn)

        }));

        return res.json(data);

    });

};