import { SePayPgClient } from "sepay-pg-node";
import { db } from "../config/config.js";

const client = new SePayPgClient({
    env: process.env.SEPAY_ENV,
    merchant_id: process.env.SEPAY_MERCHANT_ID,
    secret_key: process.env.SEPAY_SECRET_KEY
});

// ================== TẠO THANH TOÁN ==================

export const createPayment = (req, res) => {

    const userId = req.user.id;
    const { amount, coin } = req.body;

    const orderCode = `NAP${Date.now()}`;

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

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Không thể tạo đơn hàng"
                });

            }

            const checkoutURL = client.checkout.initCheckoutUrl();

            const fields = client.checkout.initOneTimePaymentFields({

                operation: "PURCHASE",

                payment_method: "BANK_TRANSFER",

                order_invoice_number: orderCode,

                order_amount: amount,

                currency: "VND",

                // Quan trọng
                order_description: orderCode,

                customer_id: userId.toString(),

                success_url:
                    `https://webdoctruyenn.onrender.com/payment/success?order=${orderCode}`,

                error_url:
                    `https://webdoctruyenn.onrender.com/payment/error`,

                cancel_url:
                    `https://webdoctruyenn.onrender.com/payment/cancel`

            });
            console.log(fields);
            res.json({

                checkoutURL,
                fields

            });

        }

    );

};
export const webhook = (req, res) => {

    console.log("====== WEBHOOK ======");
    console.log(JSON.stringify(req.body, null, 2));

    const {

        content,
        transferAmount

    } = req.body;

    if (!content) {

        return res.sendStatus(200);

    }

    db.query(

        `
        SELECT *
        FROM payments
        WHERE ? LIKE CONCAT('%', order_code, '%')
        LIMIT 1
        `,

        [content],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.sendStatus(500);

            }

            if (result.length === 0) {

                console.log("Không tìm thấy đơn hàng");

                return res.sendStatus(200);

            }

            const payment = result[0];

            if (payment.status === "success") {

                console.log("Đơn đã xử lý");

                return res.sendStatus(200);

            }

            if (Number(transferAmount) < Number(payment.amount)) {

                console.log("Chuyển khoản thiếu tiền");

                return res.sendStatus(200);

            }

            db.query(

                `
                UPDATE payments
                SET status='success'
                WHERE id=?
                `,

                [payment.id],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.sendStatus(500);

                    }

                    db.query(

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

                                console.log(err);

                                return res.sendStatus(500);

                            }

                            db.query(

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

                                        console.log(err);

                                        return res.sendStatus(500);

                                    }

                                    console.log("Nạp coin thành công");

                                    res.sendStatus(200);

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};
export const paymentSuccess = (req, res) => {

    const orderCode = req.query.order;

    if (!orderCode) {

        return res.status(400).json({
            message: "Thiếu mã đơn"
        });

    }

    db.query(

        `
        SELECT status
        FROM payments
        WHERE order_code = ?
        `,

        [orderCode],

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