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
import cloudinary from "../config/cloudinary.js";
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
                        upload.secure_url,
                        upload.public_id
                    ]);

                }

                db.query(
                    `
                    INSERT INTO chapter_images
                    (
                        chapter_id,
                        page_number,
                        image_url,
                        public_id
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
export const updateChapter = async (req, res) => {
    const connection = await db.promise().getConnection();

    try {
        const { id } = req.params;
        const { chapter_number, title } = req.body;

        const imageOrder = JSON.parse(req.body.image_order || "[]");

        await connection.beginTransaction();

        // Lấy thông tin chương
        const [chapterResult] = await connection.query(
            "SELECT * FROM chapters WHERE id = ?",
            [id]
        );

        if (chapterResult.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Không tìm thấy chương"
            });
        }

        const chapter = chapterResult[0];

        // Cập nhật chương
        await connection.query(
            `
            UPDATE chapters
            SET
                chapter_number = ?,
                title = ?
            WHERE id = ?
            `,
            [chapter_number, title, id]
        );

        // Ảnh cũ
        const [oldImages] = await connection.query(
            `
            SELECT *
            FROM chapter_images
            WHERE chapter_id = ?
            ORDER BY page_number
            `,
            [id]
        );

        // Upload ảnh mới
        const uploadedImages = [];

        if (req.files?.length) {
            for (const file of req.files) {
                const upload = await uploadToCloudinary(
                    file.buffer,
                    `chapters/book_${chapter.book_id}/chapter_${chapter_number}`
                );

                uploadedImages.push({
                    image_url: upload.secure_url,
                    public_id: upload.public_id
                });
            }
        }

        // Ghép lại danh sách ảnh
        let uploadIndex = 0;
        const finalImages = [];

        for (const item of imageOrder) {
            if (item.isNew) {
                if (uploadedImages[uploadIndex]) {
                    finalImages.push(uploadedImages[uploadIndex]);
                    uploadIndex++;
                }
            } else {
                const old = oldImages.find(img => img.id == item.id);
                if (old) {
                    finalImages.push({
                        image_url: old.image_url,
                        public_id: old.public_id
                    });
                }
            }
        }

        // Xóa ảnh Cloudinary không còn dùng
        const deletedImages = oldImages.filter(
            old => !finalImages.some(img => img.public_id === old.public_id)
        );

        for (const img of deletedImages) {
            if (!img.public_id) continue;

            try {
                await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
                console.log(err);
            }
        }

        // Xóa DB
        await connection.query(
            "DELETE FROM chapter_images WHERE chapter_id = ?",
            [id]
        );

        // Thêm lại theo thứ tự mới
        if (finalImages.length > 0) {
            const values = finalImages.map((img, index) => [
                id,
                index + 1,
                img.image_url,
                img.public_id
            ]);

            await connection.query(
                `
                INSERT INTO chapter_images
                (
                    chapter_id,
                    page_number,
                    image_url,
                    public_id
                )
                VALUES ?
                `,
                [values]
            );
        }

        const [images] = await connection.query(
            `
            SELECT *
            FROM chapter_images
            WHERE chapter_id = ?
            ORDER BY page_number
            `,
            [id]
        );

        await connection.commit();

        return res.json({
            message: "Cập nhật chương thành công",
            chapter: {
                id,
                chapter_number,
                title
            },
            images
        });

    } catch (err) {
        await connection.rollback();
        console.error(err);

        return res.status(500).json({
            message: err.message
        });
    } finally {
        connection.release();
    }
};