import {db} from "../config/config.js"; 

// Lấy danh sách
export const getCategories = (req, res) => {

    db.query(
        "SELECT * FROM categories ORDER BY id DESC",
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result);

        }
    );

};

// Lấy 1 category
export const getCategory = (req, res) => {

    db.query(
        "SELECT * FROM categories WHERE id = ?",
        [req.params.id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result[0]);

        }
    );

};

// Thêm
export const createCategory = (req, res) => {

    const { name, description } = req.body;

    db.query(

        "INSERT INTO categories(name,description) VALUES(?,?)",

        [name, description],

        (err) => {

            if (err) return res.status(500).json(err);

            res.json({

                message: "Thêm thành công"

            });

        }

    );

};

// Cập nhật
export const updateCategory = (req, res) => {

    const { name, description } = req.body;

    db.query(

        "UPDATE categories SET name=?, description=? WHERE id=?",

        [

            name,

            description,

            req.params.id

        ],

        (err) => {

            if (err) return res.status(500).json(err);

            res.json({

                message: "Cập nhật thành công"

            });

        }

    );

};

// Xóa
export const deleteCategory = (req, res) => {

    const { id } = req.params;

    db.query(

        "SELECT COUNT(*) AS total FROM book_categories WHERE category_id = ?",

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Lỗi server"
                });

            }

            if (result[0].total > 0) {

                return res.status(400).json({
                    message: "Không thể xóa. Thể loại đang được sử dụng."
                });

            }

            db.query(

                "DELETE FROM categories WHERE id = ?",

                [id],

                (err2) => {

                    if (err2) {

                        return res.status(500).json({
                            message: "Lỗi server"
                        });

                    }

                    res.json({
                        message: "Xóa thành công"
                    });

                }

            );

        }

    );

};