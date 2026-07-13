import { db } from "../config/config.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);
export const register = (req, res) => {
    const { username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const sql ="INSERT INTO users (username, email, password) VALUES (?, ?, ?)";


    const errors = [];
    // username
    if (username.length < 6) {
        errors.push({
            field: "username",
            message: "Username phải có ít nhất 6 ký tự"
        });
    }

    // email
    if (!emailRegex.test(email)) {
    errors.push({
        field: "email",
        message: "Email không hợp lệ"
    });
}

    // password
    if (password.length < 6) {
        errors.push({
            field: "password",
            message: "Password phải có ít nhất 6 ký tự"
        });
    }
    // lỗi
    if (errors.length > 0) {
        return res.status(400).json({
            errors: errors
        });
    }
     const checkSql =
        "SELECT * FROM users WHERE email = ? OR username = ?";
    // insert 
    db.query(
        sql,
        [username, email, password],
        (err, result) => {

            if (err) {
                // email đã tồn tại
                    console.log(err);   // thêm dòng này

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    errors: [
                        {
                            field: "email",
                            message: "email đã tồn tại"
                        }
                    ]
                });
            }
                return res.status(500).json({
                    message: "Lỗi server"
                });
            }

            res.json({
                message: "Đăng ký thành công"
            });
        }
    );
};
export const login = (req, res) => {

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

    db.query(sql, [username], (err, result) => {

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

        // Vì m đang lưu password dạng text
        if (password !== user.password) {

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