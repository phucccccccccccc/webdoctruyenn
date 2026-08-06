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
    t.id,
    u.username,
    b.title,
    t.amount,
    t.created_at
FROM transactions t
JOIN users u
    ON t.user_id = u.id
JOIN books b
    ON ...
ORDER BY t.created_at DESC
LIMIT 10;
    `;

    db.query(sql, [userId, userId], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getTransactionStatistics = (req, res) => {

    const transactionSql = `
        SELECT
            COUNT(*) AS totalTransactions,

            COUNT(
                CASE
                    WHEN type = 'spend'
                    THEN 1
                END
            ) AS totalPurchase,

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

    const paymentSql = `
        SELECT
            COUNT(*) AS totalRecharge,

            IFNULL(SUM(coin), 0) AS totalCoinRecharge
        FROM payments
        WHERE status = 'paid'
    `;

    db.query(transactionSql, (err, transactionResult) => {

        if (err)
            return res.status(500).json({ message: "Lỗi server" });

        db.query(paymentSql, (err, paymentResult) => {

            if (err)
                return res.status(500).json({ message: "Lỗi server" });

            res.json({

                totalTransactions: transactionResult[0].totalTransactions,

                totalPurchase: transactionResult[0].totalPurchase,

                totalRevenue: transactionResult[0].totalRevenue,

                totalRecharge: paymentResult[0].totalRecharge,

                totalCoinRecharge: paymentResult[0].totalCoinRecharge

            });

        });

    });

};
export const getTransactionChart = (req, res) => {

    const { type } = req.query;

    let spendSql = "";
    let paymentSql = "";

    if (type === "week") {

        spendSql = `
            SELECT
                DATE(created_at) AS label,
                SUM(amount) AS spend
            FROM transactions
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE(created_at)
        `;

        paymentSql = `
            SELECT
                DATE(created_at) AS label,
                SUM(coin) AS earn
            FROM payments
            WHERE status = 'paid'
              AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE(created_at)
        `;

    }

    else if (type === "month") {

        spendSql = `
            SELECT
                MONTH(created_at) AS label,
                SUM(amount) AS spend
            FROM transactions
            WHERE YEAR(created_at) = YEAR(CURDATE())
            GROUP BY MONTH(created_at)
        `;

        paymentSql = `
            SELECT
                MONTH(created_at) AS label,
                SUM(coin) AS earn
            FROM payments
            WHERE status = 'paid'
              AND YEAR(created_at) = YEAR(CURDATE())
            GROUP BY MONTH(created_at)
        `;

    }

    else {

        spendSql = `
            SELECT
                YEAR(created_at) AS label,
                SUM(amount) AS spend
            FROM transactions
            GROUP BY YEAR(created_at)
        `;

        paymentSql = `
            SELECT
                YEAR(created_at) AS label,
                SUM(coin) AS earn
            FROM payments
            WHERE status = 'paid'
            GROUP BY YEAR(created_at)
        `;

    }

    db.query(spendSql, (err, spendResult) => {

        if (err)
            return res.status(500).json({ message: "Lỗi server" });

        db.query(paymentSql, (err, paymentResult) => {

            if (err)
                return res.status(500).json({ message: "Lỗi server" });

            if (type === "week") {

                const data = [];

                for (let i = 6; i >= 0; i--) {

                    const d = new Date();

                    d.setDate(d.getDate() - i);

                    const key = d.toISOString().slice(0, 10);

                    const spend = spendResult.find(
                        x => x.label.toISOString().slice(0, 10) === key
                    );

                    const earn = paymentResult.find(
                        x => x.label.toISOString().slice(0, 10) === key
                    );

                    data.push({

                        label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,

                        spend: spend ? Number(spend.spend) : 0,

                        earn: earn ? Number(earn.earn) : 0

                    });

                }

                return res.json(data);

            }

            if (type === "month") {

                const data = [];

                for (let i = 1; i <= 12; i++) {

                    const spend = spendResult.find(
                        x => Number(x.label) === i
                    );

                    const earn = paymentResult.find(
                        x => Number(x.label) === i
                    );

                    data.push({

                        label: `T${i}`,

                        spend: spend ? Number(spend.spend) : 0,

                        earn: earn ? Number(earn.earn) : 0

                    });

                }

                return res.json(data);

            }

            const years = new Set();

            spendResult.forEach(x => years.add(Number(x.label)));

            paymentResult.forEach(x => years.add(Number(x.label)));

            const data = [...years]
                .sort((a, b) => a - b)
                .map(year => {

                    const spend = spendResult.find(
                        x => Number(x.label) === year
                    );

                    const earn = paymentResult.find(
                        x => Number(x.label) === year
                    );

                    return {

                        label: year.toString(),

                        spend: spend ? Number(spend.spend) : 0,

                        earn: earn ? Number(earn.earn) : 0

                    };

                });

            res.json(data);

        });

    });

};
