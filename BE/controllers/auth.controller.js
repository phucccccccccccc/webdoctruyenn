import { db } from "../config/config.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "../services/mail.service.js";
import { generateOTP, getExpiredTime } from "../utils/otp.js";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);
export const verifyRegisterOTP = (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            message: "Vui lòng nhập Email và OTP"
        });
    }

    const sql = `
        SELECT *
        FROM email_verifications
        WHERE email = ?
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        if (result.length === 0) {

            return res.status(400).json({
                message: "Không tìm thấy mã OTP"
            });

        }

        const data = result[0];

        // OTP sai
        if (data.otp !== otp) {

            return res.status(400).json({
                message: "Mã OTP không đúng"
            });

        }

        // OTP hết hạn
        if (new Date() > new Date(data.expired_at)) {

            return res.status(400).json({
                message: "Mã OTP đã hết hạn"
            });

        }

        const insertSql = `
            INSERT INTO users
            (
                username,
                email,
                password,
                role,
                login_type
            )
            VALUES (?,?,?,?,?)
        `;

        db.query(
            insertSql,
            [
                data.username,
                data.email,
                data.password,
                "user",
                "local"
            ],
            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Không thể tạo tài khoản"
                    });

                }

                db.query(
                    "DELETE FROM email_verifications WHERE email = ?",
                    [email]
                );

                return res.json({
                    message: "Đăng ký thành công"
                });

            }
        );

    });

};
export const sendRegisterOTP = async (req, res) => {

    try {

        const {
            username,
            email,
            password,
            confirmPassword
        } = req.body;

        const errors = [];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!username || username.length < 6) {
            errors.push({
                field: "username",
                message: "Username phải có ít nhất 6 ký tự"
            });
        }

        if (!emailRegex.test(email)) {
            errors.push({
                field: "email",
                message: "Email không hợp lệ"
            });
        }

        if (!password || password.length < 6) {
            errors.push({
                field: "password",
                message: "Password phải có ít nhất 6 ký tự"
            });
        }

        if (password !== confirmPassword) {
            errors.push({
                field: "confirmPassword",
                message: "Mật khẩu nhập lại không khớp"
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                errors
            });
        }

        db.query(
            "SELECT id FROM users WHERE username=? OR email=?",
            [username, email],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Lỗi server"
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Username hoặc Email đã tồn tại"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                const otp = generateOTP();

                const expired = getExpiredTime();

                db.query(
                    "DELETE FROM email_verifications WHERE email=?",
                    [email]
                );

                db.query(
                    `INSERT INTO email_verifications
                    (username,email,password,otp,expired_at)
                    VALUES (?,?,?,?,?)`,
                    [
                        username,
                        email,
                        hashedPassword,
                        otp,
                        expired
                    ],
                    async (err) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Lỗi tạo OTP"
                            });
                        }

                        await transporter.sendMail({

                            from: process.env.EMAIL_USER,

                            to: email,

                            subject: "Xác thực đăng ký tài khoản",

                            html: `
                            <h2>📚 Web Đọc Truyện</h2>

                            <p>Xin chào <b>${username}</b></p>

                            <p>Mã OTP của bạn là:</p>

                            <h1 style="letter-spacing:8px;color:#0d6efd">
                                ${otp}
                            </h1>

                            <p>Mã có hiệu lực trong 5 phút.</p>
                            `
                        });

                        res.json({
                            message: "Đã gửi OTP"
                        });

                    }

                );

            }

        );

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Lỗi server"
        });

    }

};
const handleResendOTP = async()=>{

    try{

        await api.post(
            "/auth/send-register-otp",
            {
                username,
                email,
                password,
                confirmPassword
            }
        );

        toast.success("Đã gửi lại OTP");

        setCountdown(300);

    }catch{

        toast.error("Không thể gửi OTP");

    }

}
export const register = async (req, res) => {

    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = [];

    if (!username || username.length < 6) {
        errors.push({
            field: "username",
            message: "Username phải có ít nhất 6 ký tự"
        });
    }

    if (!emailRegex.test(email)) {
        errors.push({
            field: "email",
            message: "Email không hợp lệ"
        });
    }

    if (!password || password.length < 6) {
        errors.push({
            field: "password",
            message: "Password phải có ít nhất 6 ký tự"
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            errors
        });
    }

    const checkSql =
        "SELECT * FROM users WHERE email = ? OR username = ?";

    db.query(checkSql, [email, username], async (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        if (result.length > 0) {

            const user = result[0];

            if (user.email === email) {

                return res.status(400).json({
                    errors: [
                        {
                            field: "email",
                            message: "Email đã tồn tại"
                        }
                    ]
                });

            }

            if (user.username === username) {

                return res.status(400).json({
                    errors: [
                        {
                            field: "username",
                            message: "Username đã tồn tại"
                        }
                    ]
                });

            }

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users(username,email,password) VALUES(?,?,?)";

        db.query(
            sql,
            [username, email, hashedPassword],
            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Lỗi server"
                    });

                }

                res.json({
                    message: "Đăng ký thành công"
                });

            }
        );

    });

};

    export const login = async (req, res) => {

    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({
            errors: [
                {
                    field: "username",
                    message: "Vui lòng nhập username"
                }
            ]
        });
    }

    if (!password) {
        return res.status(400).json({
            errors: [
                {
                    field: "password",
                    message: "Vui lòng nhập password"
                }
            ]
        });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        if (result.length === 0) {

            return res.status(400).json({
                errors: [
                    {
                        field: "username",
                        message: "Username không tồn tại"
                    }
                ]
            });

        }

        const user = result[0];

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {

            return res.status(400).json({
                errors: [
                    {
                        field: "password",
                        message: "Mật khẩu không đúng"
                    }
                ]
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    });

};
export const googleLogin = async (req, res) => {

    try {

        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const email = payload.email;
        const username = payload.name;
        const googleId = payload.sub;
        const avatar = payload.picture;

const sql = "SELECT * FROM users WHERE email = ?";

db.query(sql, [email], (err, result) => {

    if (err) {

        return res.status(500).json({
            message: "Lỗi server"
        });

    }

    if (result.length > 0) {

    const user = result[0];

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });

}

// Chưa có tài khoản
// => INSERT

const insertSql = `
INSERT INTO users
(
    username,
    email,
    password,
    login_type,
    google_id,
    avatar
)
VALUES (?,?,?,?,?,?)
`;

db.query(
    insertSql,
    [
        username,
        email,
        "",
        "google",
        googleId,
        avatar
    ],
    (err, insertResult) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi tạo tài khoản"
            });

        }
    const token = jwt.sign(
    {
        id: insertResult.insertId,
        role: "user"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: insertResult.insertId,
                username,
                email,
                role: "user"
            }
        });

    }
);

  

});
    } catch (err) {

    console.log(err);

    return res.status(500).json({
        message: "Đăng nhập Google thất bại"
    });

}

};
export const profile = (req, res) => {

    res.json({
        user: req.user
    });

};
export const sendForgotOTP = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message: "Vui lòng nhập email"
            });

        }

        db.query(
            "SELECT * FROM users WHERE email=?",
            [email],
            async (err, result) => {

                if (err) {

                    return res.status(500).json({
                        message: "Lỗi server"
                    });

                }

                if (result.length === 0) {

                    return res.status(404).json({
                        message: "Email không tồn tại"
                    });

                }

                const otp = generateOTP();

                const expired = getExpiredTime();

                db.query(
                    "DELETE FROM password_resets WHERE email=?",
                    [email]
                );

                db.query(
                    `INSERT INTO password_resets
                    (email,otp,expired_at)
                    VALUES(?,?,?)`,
                    [
                        email,
                        otp,
                        expired
                    ],
                    async (err) => {

                        if (err) {

                            return res.status(500).json({
                                message: "Không thể tạo OTP"
                            });

                        }

                        await transporter.sendMail({

                            from: process.env.EMAIL_USER,

                            to: email,

                            subject: "Đặt lại mật khẩu",

                            html: `
                            <h2>📚 Web Đọc Truyện</h2>

                            <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>

                            <p>Mã OTP của bạn:</p>

                            <h1 style="color:#0d6efd;letter-spacing:8px">

                            ${otp}

                            </h1>

                            <p>Mã có hiệu lực trong 5 phút.</p>
                            `

                        });

                        res.json({

                            message: "Đã gửi OTP"

                        });

                    }

                );

            }

        );

    } catch {

        res.status(500).json({

            message: "Lỗi server"

        });

    }

};
export const verifyForgotOTP = (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            message: "Vui lòng nhập OTP"
        });
    }

    const sql = `
        SELECT *
        FROM password_resets
        WHERE email = ?
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        if (result.length === 0) {

            return res.status(400).json({
                message: "Không tìm thấy OTP"
            });

        }

        const data = result[0];

        // OTP sai
        if (data.otp !== otp) {

            return res.status(400).json({
                message: "OTP không đúng"
            });

        }

        // OTP hết hạn
        if (new Date() > new Date(data.expired_at)) {

            return res.status(400).json({
                message: "OTP đã hết hạn"
            });

        }

        res.json({
            message: "OTP hợp lệ"
        });

    });

};
export const resetPassword = async (req, res) => {

    try {

        const {
            email,
            password,
            confirmPassword
        } = req.body;

        if (!password || password.length < 6) {

            return res.status(400).json({
                message: "Mật khẩu phải có ít nhất 6 ký tự"
            });

        }

        if (password !== confirmPassword) {

            return res.status(400).json({
                message: "Nhập lại mật khẩu không khớp"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        db.query(

            "UPDATE users SET password=? WHERE email=?",

            [
                hashedPassword,
                email
            ],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Lỗi server"
                    });

                }

                db.query(

                    "DELETE FROM password_resets WHERE email=?",

                    [email]

                );

                res.json({

                    message: "Đổi mật khẩu thành công"

                });

            }

        );

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi server"

        });

    }

};
