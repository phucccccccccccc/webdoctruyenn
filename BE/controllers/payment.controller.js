import { SePayPgClient } from "sepay-pg-node";
import { db } from "../config/config.js";
console.log("MERCHANT:", process.env.SEPAY_MERCHANT_ID);
console.log("SECRET:", process.env.SEPAY_SECRET_KEY);
console.log("ENV:", process.env.SEPAY_ENV);

const client = new SePayPgClient({
    env: process.env.SEPAY_ENV,
    merchant_id: process.env.SEPAY_MERCHANT_ID,
    secret_key: process.env.SEPAY_SECRET_KEY
});

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

                payment_method: "BANK_TRANSFER",

                order_invoice_number: orderCode,

                order_amount: amount,

                currency: "VND",

                order_description: `Nạp ${coin} Coin`,

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
