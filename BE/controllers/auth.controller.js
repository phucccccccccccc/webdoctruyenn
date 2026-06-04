import { db } from "../config/config.js";

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
