import {db} from "../config/config.js";

export const getBooks = (req, res) => {

    const sql = `
        SELECT
            b.id,
            b.title,
            b.author,
            b.description,
            b.cover_image,
            b.coin_price,
            b.status,
            b.views,
            b.likes,
            GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
        FROM books b

        LEFT JOIN book_categories bc
            ON b.id = bc.book_id

        LEFT JOIN categories c
            ON bc.category_id = c.id

        GROUP BY b.id

        ORDER BY b.created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getFeaturedBooks = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            author,
            cover_image,
            coin_price,
            status,
            views,
            likes
        FROM books
        ORDER BY views DESC
        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        res.json(result);

    });

};

export const getNewBooks = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            author,
            cover_image,
            coin_price,
            status,
            views,
            likes,
            created_at
        FROM books
        ORDER BY created_at DESC
        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        res.json(result);

    });

};
export const getBookById = (req, res) => {

    const sql = `
        SELECT
            b.*,
            GROUP_CONCAT(c.name SEPARATOR ', ') AS categories,
            GROUP_CONCAT(c.id) AS category_ids
        FROM books b

        LEFT JOIN book_categories bc
            ON b.id = bc.book_id

        LEFT JOIN categories c
            ON bc.category_id = c.id

        WHERE b.id = ?

        GROUP BY b.id
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {

            return res.status(500).json(err);

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Không tìm thấy truyện"
            });

        }

        const book = result[0];

        // Chuyển "1,2,5" => [1,2,5]
        book.category_ids = book.category_ids
            ? book.category_ids.split(",").map(Number)
            : [];

        res.json(book);

    });

};
export const getBooksByCategory = (req, res) => {

    const categoryId = req.params.id;

    const sql = `
        SELECT
            b.id,
            b.title,
            b.author,
            b.cover_image,
            b.coin_price,
            b.status,
            b.views,
            b.likes
        FROM books b

        INNER JOIN book_categories bc
            ON b.id = bc.book_id

        WHERE bc.category_id = ?

        ORDER BY b.created_at DESC
    `;

    db.query(sql, [categoryId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        res.json(result);

    });

};
export const searchBooks = (req, res) => {

    const keyword = `%${req.params.keyword}%`;

    const sql = `
        SELECT
            id,
            title,
            author,
            cover_image,
            coin_price,
            status,
            views,
            likes
        FROM books
        WHERE title LIKE ?
           OR author LIKE ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [keyword, keyword], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi server"
            });

        }

        res.json(result);

    });

};

export const getBooksByViews = (req, res) => {

    const sql = `
        SELECT *
        FROM books
        ORDER BY views DESC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getBooksByPrice = (req, res) => {

    const sql = `
        SELECT *
        FROM books
        ORDER BY coin_price ASC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getBookChapters = (req, res) => {

    const sql = `
        SELECT
            c.id,
            c.chapter_number,
            c.title,
            COUNT(ci.id) AS total_pages
        FROM chapters c

        LEFT JOIN chapter_images ci
            ON c.id = ci.chapter_id

        WHERE c.book_id = ?

        GROUP BY c.id

        ORDER BY c.chapter_number ASC
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getChapter = (req, res) => {

    const userId = req.user.id;

    const { bookId, chapterNumber } = req.params;

    const bookSql = `
        SELECT
            id,
            coin_price
        FROM books
        WHERE id = ?
    `;

    db.query(bookSql, [bookId], (err, books) => {

        if (err)
            return res.status(500).json(err);

        if (books.length === 0) {

            return res.status(404).json({
                message: "Không tìm thấy truyện"
            });

        }

        const book = books[0];

        if (book.coin_price === 0) {

            return loadChapter();

        }

        const checkSql = `
            SELECT id
            FROM user_books
            WHERE user_id = ?
            AND book_id = ?
        `;

        db.query(checkSql, [userId, bookId], (err, purchased) => {

            if (err)
                return res.status(500).json(err);

            if (purchased.length === 0) {

               return res.status(403).json({

                    code: "BOOK_NOT_PURCHASED",

                    message: "Bạn chưa mua truyện này",

                    coin_price: book.coin_price,

                    book_id: book.id

                });

            }

            loadChapter();

        }); 

    });

    function loadChapter() {

        const chapterSql = `
            SELECT
                c.id,
                c.chapter_number,
                c.title,
                b.title AS book_title,
                b.author
            FROM chapters c

            JOIN books b
                ON c.book_id = b.id

            WHERE c.book_id = ?
            AND c.chapter_number = ?
        `;

        db.query(
            chapterSql,
            [bookId, chapterNumber],
            (err, chapters) => {

                if (err)
                    return res.status(500).json(err);

                if (chapters.length === 0) {

                    return res.status(404).json({
                        message: "Không tìm thấy chương"
                    });

                }

                const chapter = chapters[0];

                const imageSql = `
                    SELECT
                        page_number,
                        image_url
                    FROM chapter_images
                    WHERE chapter_id = ?
                    ORDER BY page_number ASC
                `;

                db.query(
                    imageSql,
                    [chapter.id],
                    (err, images) => {

                        if (err)
                            return res.status(500).json(err);

                        res.json({

                            chapter,

                            images

                        });

                    }
                );

            }
        );

    }

};
export const updateReadingHistory = (req, res) => {

    const userId = req.user.id;

    const { book_id } = req.body;

    // dùng userId thay vì req.body.user_id

};
export const createBook = (req, res) => {

    const {
        title,
        author,
        description,
        coin_price,
        status
    } = req.body;

    const cover_image = req.file
        ? req.file.filename
        : null;

    const categories = JSON.parse(req.body.categories || "[]");

    const sql = `
        INSERT INTO books
        (
            title,
            author,
            description,
            cover_image,
            coin_price,
            status
        )
        VALUES (?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            title,
            author,
            description,
            cover_image,
            coin_price,
            status
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            const bookId = result.insertId;

            if (categories.length === 0) {

                return res.json({
                    message: "Thêm truyện thành công"
                });

            }

            const values = categories.map(categoryId => [

                bookId,

                categoryId

            ]);

            db.query(

                `
                INSERT INTO book_categories
                (
                    book_id,
                    category_id
                )
                VALUES ?
                `,

                [values],

                (err) => {

                    if (err)
                        return res.status(500).json(err);

                    res.json({

                        message: "Thêm truyện thành công"

                    });

                }

            );

        }

    );

};
export const buyBook = (req, res) => {

    const userId = req.user.id;
    const { book_id } = req.body;

    db.getConnection((err, connection) => {

        if (err)
            return res.status(500).json(err);

        connection.beginTransaction((err) => {

            if (err) {
                connection.release();
                return res.status(500).json(err);
            }

            // 1. Lấy thông tin sách
            const bookSql = `
                SELECT
                    id,
                    title,
                    coin_price
                FROM books
                WHERE id = ?
            `;

            connection.query(bookSql, [book_id], (err, books) => {

                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json(err);
                    });
                }

                if (books.length === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({
                            message: "Không tìm thấy sách"
                        });
                    });
                }

                const book = books[0];

                // 2. Kiểm tra đã mua chưa
                const checkSql = `
                    SELECT *
                    FROM user_books
                    WHERE user_id = ?
                    AND book_id = ?
                `;

                connection.query(checkSql, [userId, book_id], (err, purchased) => {

                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json(err);
                        });
                    }

                    if (purchased.length > 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(400).json({
                                message: "Bạn đã mua sách này"
                            });
                        });
                    }

                    // 3. Lấy coin user
                    const userSql = `
                        SELECT total_coin
                        FROM users
                        WHERE id = ?
                    `;

                    connection.query(userSql, [userId], (err, users) => {

                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json(err);
                            });
                        }

                        const user = users[0];

                        if (user.total_coin < book.coin_price) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(400).json({
                                    message: "Không đủ coin"
                                });
                            });
                        }

                        // 4. Trừ coin
                        const updateCoinSql = `
                            UPDATE users
                            SET total_coin = total_coin - ?
                            WHERE id = ?
                        `;

                        connection.query(
                            updateCoinSql,
                            [book.coin_price, userId],
                            (err) => {

                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json(err);
                                    });
                                }

                                // 5. Lưu sách đã mua
                                const insertBookSql = `
                                    INSERT INTO user_books
                                    (
                                        user_id,
                                        book_id
                                    )
                                    VALUES (?,?)
                                `;

                                connection.query(
                                    insertBookSql,
                                    [userId, book_id],
                                    (err) => {

                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                res.status(500).json(err);
                                            });
                                        }

                                        // 6. Ghi lịch sử giao dịch
                                        const transactionSql = `
                                            INSERT INTO transactions
                                            (
                                                user_id,
                                                amount,
                                                type,
                                                description
                                            )
                                            VALUES (?,?,?,?)
                                        `;

                                        connection.query(
                                            transactionSql,
                                            [
                                                userId,
                                                book.coin_price,
                                                "spend",
                                                `Mua sách: ${book.title}`
                                            ],
                                            (err) => {

                                                if (err) {
                                                    return connection.rollback(() => {
                                                        connection.release();
                                                        res.status(500).json(err);
                                                    });
                                                }

                                                // 7. Hoàn tất
                                                connection.commit((err) => {

                                                    if (err) {
                                                        return connection.rollback(() => {
                                                            connection.release();
                                                            res.status(500).json(err);
                                                        });
                                                    }

                                                    connection.release();

                                                    res.json({
                                                        message: "Mua sách thành công"
                                                    });

                                                });

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    });

                });

            });

        });

    });

};
export const updateBook = (req, res) => {

    const { id } = req.params;

    const {
        title,
        author,
        description,
        coin_price
    } = req.body;

    const categories = JSON.parse(req.body.categories || "[]");

    let cover_image = req.body.old_cover_image;

    if (req.file) {
        cover_image = req.file.filename;
    }

    const sql = `
        UPDATE books
        SET
            title = ?,
            author = ?,
            description = ?,
            coin_price = ?,
            cover_image = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            title,
            author,
            description,
            coin_price,
            cover_image,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            // Xóa category cũ
            db.query(
                "DELETE FROM book_categories WHERE book_id = ?",
                [id],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    // Không chọn category nào
                    if (categories.length === 0) {

                        return res.json({
                            message: "Cập nhật thành công"
                        });

                    }

                    // Thêm category mới
                    const values = categories.map(categoryId => [
                        id,
                        categoryId
                    ]);

                    db.query(
                        "INSERT INTO book_categories(book_id, category_id) VALUES ?",
                        [values],
                        (err) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            res.json({
                                message: "Cập nhật thành công"
                            });

                        }
                    );

                }
            );

        }
    );

};
export const deleteBook = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM book_categories WHERE book_id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).json(err);

            db.query(
                "DELETE FROM books WHERE id = ?",
                [id],
                (err2) => {
                    if (err2) return res.status(500).json(err2);

                    res.json({
                        message: "Xóa thành công"
                    });
                }
            );
        }
    );
};
export const getComingSoonBooks = (req, res) => {

    const sql = `
        SELECT
            b.id,
            b.title,
            b.author,
            b.cover_image,
            b.coin_price,
            b.views
        FROM books b

        WHERE NOT EXISTS (

            SELECT 1
            FROM chapters c
            WHERE c.book_id = b.id

        )

        ORDER BY b.created_at DESC

        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};