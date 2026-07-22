import { db } from "../config/config.js";


export const createPayment = async (req, res) => {


    const userId = req.user.id;

    const { amount, coin } = req.body;

    const orderCode = `NAP${Date.now()}`;

    try {

        await new Promise((resolve, reject) => {

            db.query(
                `
                INSERT INTO payments
                (
                    user_id,
                    order_code,
                    amount,
                    coin,
                    status
                )
                VALUES (?,?,?,?,?)
                `,
                [
                    userId,
                    orderCode,
                    amount,
                    coin,
                    "pending"
                ],
                (err) => {

                    if (err) reject(err);

                    else resolve();

                }
            );

        });

        const qr =
`https://img.vietqr.io/image/MB-0798617250-compact2.png?amount=${amount}&addInfo=${orderCode}&accountName=DANG%20HAI%20HOANG%20PHUC`;

res.json({
    qr,
    orderCode,
    amount
});

    }

    catch (err) {

        console.log(err.response?.data || err);

        res.status(500).json({

            message: "Không tạo được QR"

        });

    }

};
export const webhook = (req, res) => {

    console.log("====== WEBHOOK ======");
    console.log(JSON.stringify(req.body, null, 2));

    const { content, transferAmount } = req.body;

    if (!content) {

        return res.sendStatus(200);

    }

    db.getConnection((err, conn) => {

        if (err) {

            console.log(err);

            return res.sendStatus(500);

        }

        conn.beginTransaction(err => {

            if (err) {

                conn.release();

                return res.sendStatus(500);

            }

            conn.query(

                `
                SELECT *
                FROM payments
                WHERE ? LIKE CONCAT('%', order_code, '%')
                LIMIT 1
                `,

                [content],

                (err, result) => {

                    if (err) {

                        conn.rollback(() => conn.release());

                        console.log(err);

                        return res.sendStatus(500);

                    }

                    if (result.length === 0) {

                        conn.rollback(() => conn.release());

                        console.log("Không tìm thấy đơn");

                        return res.sendStatus(200);

                    }

                    const payment = result[0];

                    if (payment.status === "success") {

                        conn.rollback(() => conn.release());

                        console.log("Đơn đã xử lý");

                        return res.sendStatus(200);

                    }

                    if (Number(transferAmount) < Number(payment.amount)) {

                        conn.rollback(() => conn.release());

                        console.log("Chuyển thiếu tiền");

                        return res.sendStatus(200);

                    }

                    conn.query(

                        `
                        UPDATE payments
                        SET status='paid'
                        WHERE id=?
                        `,

                        [payment.id],

                        (err) => {

                            if (err) {

                                conn.rollback(() => conn.release());

                                console.log(err);

                                return res.sendStatus(500);

                            }

                            conn.query(

                                `
                                UPDATE users
                                SET total_coin = total_coin + ?
                                WHERE id=?
                                `,

                                [
                                    payment.coin,
                                    payment.user_id
                                ],

                                (err) => {

                                    if (err) {

                                        conn.rollback(() => conn.release());

                                        console.log(err);

                                        return res.sendStatus(500);

                                    }

                                    conn.query(

                                        `
                                        INSERT INTO transactions
                                        (
                                            user_id,
                                            amount,
                                            type,
                                            description
                                        )
                                        VALUES (?,?,?,?)
                                        `,

                                        [
                                            payment.user_id,
                                            payment.coin,
                                            "topup",
                                            `Nạp ${payment.coin} Coin qua SePay`
                                        ],

                                        (err) => {

                                            if (err) {

                                                conn.rollback(() => conn.release());

                                                console.log(err);

                                                return res.sendStatus(500);

                                            }

                                            conn.commit(err => {

                                                if (err) {

                                                    conn.rollback(() => conn.release());

                                                    console.log(err);

                                                    return res.sendStatus(500);

                                                }

                                                conn.release();

                                                console.log("✅ Nạp coin thành công");

                                                res.sendStatus(200);

                                            });

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        });

    });

};
export const getPaymentStatus = (req, res) => {
    console.log("CLICK PAYMENT");
    const { order } = req.params;

    db.query(

        `
        SELECT status
        FROM payments
        WHERE order_code = ?
        `,

        [order],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.sendStatus(500);

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Không tìm thấy đơn"
                });

            }

            res.json(result[0]);

        }

    );

};