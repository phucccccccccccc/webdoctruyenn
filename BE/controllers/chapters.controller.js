import { db } from "../config/config.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
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
export const createChapter = async (req, res) => {

    try {

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
            VALUES (?,?,?)
        `;

        db.query(
            sql,
            [
                book_id,
                chapter_number,
                title
            ],
            async (err, result) => {

                if (err)
                    return res.status(500).json(err);

                const chapterId = result.insertId;

                if (!req.files || req.files.length === 0) {

                    return res.json({
                        message: "Thêm chương thành công"
                    });

                }

                const values = [];

                for (let i = 0; i < req.files.length; i++) {

                    const file = req.files[i];

                    const upload = await uploadToCloudinary(
                        file.buffer,
                        `chapters/book_${book_id}/chapter_${chapter_number}`
                    );

                    values.push([
                        chapterId,
                        i + 1,
                        upload.secure_url
                    ]);

                }

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

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

};
export const updateChapter = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            chapter_number,
            title
        } = req.body;

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
                    async (err2) => {

                        if (err2)
                            return res.status(500).json(err2);

                        if (!req.files || req.files.length === 0) {

                            return res.json({
                                message: "Cập nhật thành công"
                            });

                        }

                        db.query(
                            "DELETE FROM chapter_images WHERE chapter_id = ?",
                            [id],
                            async (err3) => {

                                if (err3)
                                    return res.status(500).json(err3);

                                const values = [];

                                for (let i = 0; i < req.files.length; i++) {

                                    const upload = await uploadToCloudinary(
                                        req.files[i].buffer,
                                        `chapters/book_${chapter.book_id}/chapter_${chapter_number}`
                                    );

                                    values.push([
                                        id,
                                        i + 1,
                                        upload.secure_url
                                    ]);

                                }

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

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

};
export const deleteChapter = (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT image_url FROM chapter_images WHERE chapter_id = ?",
        [id],
        async (err, images) => {

            if (err)
                return res.status(500).json(err);

            try {

                for (const img of images) {

                    if (img.image_url?.includes("res.cloudinary.com")) {

                        const publicId = img.image_url
                            .split("/upload/")[1]
                            .split(".")[0]
                            .replace(/^v\d+\//, "");

                        await cloudinary.uploader.destroy(publicId);

                    }

                }

            } catch (e) {

                console.log(e);

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