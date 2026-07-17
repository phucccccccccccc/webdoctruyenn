import { db } from "../config/config.js";
import fs from "fs";
import path from "path";
export const getChapters = (req, res) => {

    const { bookId } = req.params;

    const sql = `
        SELECT
            c.id,
            c.book_id,
            c.chapter_number,
            c.title,
            c.created_at,
            COUNT(ci.id) AS total_pages

        FROM chapters c

        LEFT JOIN chapter_images ci
        ON c.id = ci.chapter_id

        WHERE c.book_id = ?

        GROUP BY c.id

        ORDER BY c.chapter_number ASC
    `;

    db.query(sql, [bookId], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getChapter = (req, res) => {

    const { id } = req.params;

    const sqlChapter = `
        SELECT *
        FROM chapters
        WHERE id = ?
    `;

    db.query(sqlChapter, [id], (err, chapter) => {

        if (err)
            return res.status(500).json(err);

        if (chapter.length === 0)
            return res.status(404).json({
                message: "Không tìm thấy chương"
            });

        const sqlImages = `
            SELECT *
            FROM chapter_images
            WHERE chapter_id = ?
            ORDER BY page_number ASC
        `;

        db.query(sqlImages, [id], (err2, images) => {

            if (err2)
                return res.status(500).json(err2);

            res.json({

                chapter: chapter[0],

                images

            });

        });

    });

};
export const createChapter = (req, res) => {

    const {
        book_id,
        chapter_number,
        title
    } = req.body;

    const sql = `
        INSERT INTO chapters
        (
            book_id,
            chapter_number,
            title
        )
        VALUES
        (
            ?,?,?
        )
    `;

    db.query(

        sql,

        [
            book_id,
            chapter_number,
            title
        ],

        (err, result) => {

            if (err)
                return res.status(500).json(err);

            const chapterId = result.insertId;

            if (!req.files || req.files.length === 0) {

                return res.json({
                    message: "Thêm chương thành công"
                });

            }

            // =========================
            // Tạo thư mục
            // uploads/chapters/book_3/chapter_1
            // =========================

            const chapterFolder = path.join(

                "uploads",

                "chapters",

                `book_${book_id}`,

                `chapter_${chapter_number}`

            );

            fs.mkdirSync(
                chapterFolder,
                {
                    recursive: true
                }
            );

            const values = [];

            req.files.forEach((file, index) => {

                const ext = path.extname(file.originalname);

                const fileName =
                    `page_${String(index + 1).padStart(3, "0")}${ext}`;

                // đường dẫn lưu trên server

                const newPath = path.join(

                    chapterFolder,

                    fileName

                );

                // Di chuyển file

                fs.renameSync(

                    file.path,

                    newPath

                );

                // đường dẫn lưu DB

                const relativePath =

                    `chapters/book_${book_id}/chapter_${chapter_number}/${fileName}`;

                values.push([

                    chapterId,

                    index + 1,

                    relativePath

                ]);

            });

            db.query(

                `
                INSERT INTO chapter_images
                (
                    chapter_id,
                    page_number,
                    image_url
                )
                VALUES ?
                `,

                [values],

                (err2) => {

                    if (err2)
                        return res.status(500).json(err2);

                    res.json({

                        message: "Thêm chương thành công"

                    });

                }

            );

        }

    );

};
export const updateChapter = (req, res) => {

    const { id } = req.params;

    const {
        chapter_number,
        title
    } = req.body;

    // Lấy thông tin chapter cũ
    db.query(

        "SELECT * FROM chapters WHERE id = ?",

        [id],

        (err, chapterResult) => {

            if (err)
                return res.status(500).json(err);

            if (chapterResult.length === 0) {

                return res.status(404).json({
                    message: "Không tìm thấy chương"
                });

            }

            const chapter = chapterResult[0];

            // Cập nhật thông tin chương
            db.query(

                `
                UPDATE chapters
                SET
                    chapter_number = ?,
                    title = ?
                WHERE id = ?
                `,

                [
                    chapter_number,
                    title,
                    id
                ],

                (err2) => {

                    if (err2)
                        return res.status(500).json(err2);

                    // Không upload ảnh mới
                    if (!req.files || req.files.length === 0) {

                        return res.json({
                            message: "Cập nhật thành công"
                        });

                    }

                    // Xóa thư mục cũ
                    const oldFolder = path.join(

                        "uploads",

                        "chapters",

                        `book_${chapter.book_id}`,

                        `chapter_${chapter.chapter_number}`

                    );

                    if (fs.existsSync(oldFolder)) {

                        fs.rmSync(oldFolder, {

                            recursive: true,
                            force: true

                        });

                    }

                    // Tạo thư mục mới
                    const newFolder = path.join(

                        "uploads",

                        "chapters",

                        `book_${chapter.book_id}`,

                        `chapter_${chapter_number}`

                    );

                    fs.mkdirSync(

                        newFolder,

                        {
                            recursive: true
                        }

                    );

                    // Xóa dữ liệu ảnh cũ
                    db.query(

                        "DELETE FROM chapter_images WHERE chapter_id = ?",

                        [id],

                        (err3) => {

                            if (err3)
                                return res.status(500).json(err3);

                            const values = [];

                            req.files.forEach((file, index) => {

                                const ext = path.extname(file.originalname);

                                const fileName =
                                    `page_${String(index + 1).padStart(3, "0")}${ext}`;

                                const newPath = path.join(

                                    newFolder,

                                    fileName

                                );

                                fs.renameSync(

                                    file.path,

                                    newPath

                                );

                                const relativePath =
                                    `chapters/book_${chapter.book_id}/chapter_${chapter_number}/${fileName}`;

                                values.push([

                                    id,

                                    index + 1,

                                    relativePath

                                ]);

                            });

                            db.query(

                                `
                                INSERT INTO chapter_images
                                (
                                    chapter_id,
                                    page_number,
                                    image_url
                                )
                                VALUES ?
                                `,

                                [values],

                                (err4) => {

                                    if (err4)
                                        return res.status(500).json(err4);

                                    res.json({

                                        message: "Cập nhật thành công"

                                    });

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};
export const deleteChapter = (req, res) => {

    const { id } = req.params;

    db.query(

        "SELECT * FROM chapters WHERE id = ?",

        [id],

        (err, chapterResult) => {

            if (err)
                return res.status(500).json(err);

            if (chapterResult.length === 0) {

                return res.status(404).json({
                    message: "Không tìm thấy chương"
                });

            }

            const chapter = chapterResult[0];

            const folder = path.join(

                "uploads",

                "chapters",

                `book_${chapter.book_id}`,

                `chapter_${chapter.chapter_number}`

            );

            if (fs.existsSync(folder)) {

                fs.rmSync(folder, {

                    recursive: true,
                    force: true

                });

            }

            db.query(

                "DELETE FROM chapter_images WHERE chapter_id = ?",

                [id],

                (err2) => {

                    if (err2)
                        return res.status(500).json(err2);

                    db.query(

                        "DELETE FROM chapters WHERE id = ?",

                        [id],

                        (err3) => {

                            if (err3)
                                return res.status(500).json(err3);

                            res.json({

                                message: "Xóa chương thành công"

                            });

                        }

                    );

                }

            );

        }

    );

};