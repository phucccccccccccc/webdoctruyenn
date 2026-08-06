import jwt from "jsonwebtoken";
import {db} from "../config/config.js";
export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Chưa đăng nhập"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token không hợp lệ"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Kiểm tra trạng thái tài khoản
        db.query(
            "SELECT status FROM users WHERE id = ?",
            [decoded.id],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Lỗi server"
                    });
                }

                if (result.length === 0) {
                    return res.status(401).json({
                        message: "Tài khoản không tồn tại"
                    });
                }

                if (result[0].status === "blocked") {
                    return res.status(403).json({
                        code: "ACCOUNT_BLOCKED",
                        message: "Tài khoản đã bị khóa"
                    });
                }

                req.user = decoded;

                next();

            }
        );

    } catch {

        return res.status(401).json({
            message: "Token hết hạn"
        });

    }

};
