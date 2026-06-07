import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { db} from "./config/config.js";

dotenv.config();

const app = express();
console.log(process.env.PORT);

app.use(cors());
app.use(express.json());


app.get("/test", (req, res) => {
  db.query("SELECT 1 AS test", (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);

      return res.status(500).json({
        message: "Lỗi DB",
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        error: err.message,
      });
    }

    res.json({
      message: "Kết nối DB thành công",
      result,
    });
  });
});
app.use("/api/auth", authRoutes);
app.post("/register", (req, res) => {

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
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
