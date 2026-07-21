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

    const sql = `
        INSERT INTO payments
        (
            user_id,
            order_code,
            amount,
            coin,
            status
        )
        VALUES (?,?,?,?,?)
    `;

    db.query(
        sql,
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

                order_description: `Nạp ${coin} Coin`,

                customer_id: userId.toString(),

                success_url: `http://localhost:5173/payment/success?order=${orderCode}`,

                error_url: `http://localhost:5173/payment/error`,

                cancel_url: `http://localhost:5173/payment/cancel`

            });

            res.json({

                checkoutURL,

                fields

            });

        }

    );

};
export const webhook = (req, res) => {

    console.log("Webhook:", req.body);

    const {

        order_invoice_number,
        payment_status

    } = req.body;

    if (payment_status !== "PAID") {

        return res.sendStatus(200);

    }

    const sql = `
        SELECT *
        FROM payments
        WHERE order_code = ?
    `;

    db.query(sql, [order_invoice_number], (err, result) => {

        if (err || result.length === 0) {

            return res.sendStatus(200);

        }

        const payment = result[0];

        if (payment.status === "success") {

            return res.sendStatus(200);

        }

        db.query(
            `UPDATE payments
             SET status='success'
             WHERE id=?`,
            [payment.id]
        );

        db.query(
            `UPDATE users
             SET total_coin = total_coin + ?
             WHERE id=?`,
            [payment.coin, payment.user_id]
        );

        db.query(
            `INSERT INTO transactions
            (user_id,amount,type,description)
            VALUES (?,?,?,?)`,
            [
                payment.user_id,
                payment.coin,
                "topup",
                `Nạp ${payment.coin} Coin qua SePay`
            ]
        );

        res.sendStatus(200);

    });

};
export const paymentSuccess = async (req, res) => {

    try {

        console.log(req.body);

        const {

            order_invoice_number

        } = req.body;

        if (!order_invoice_number) {

            return res.status(400).json({
                message: "Thiếu mã đơn hàng"
            });

        }

        const sql = `
            SELECT *
            FROM payments
            WHERE order_code = ?
        `;

        db.query(sql,[order_invoice_number],(err,result)=>{

            if(err){

                console.log(err);

                return res.sendStatus(500);

            }

            if(result.length===0){

                return res.sendStatus(404);

            }

            const payment=result[0];

            if(payment.status==="success"){

                return res.json({
                    message:"Đơn đã xử lý"
                });

            }

        });

    } catch(err){

        console.log(err);

        res.sendStatus(500);

    }

};