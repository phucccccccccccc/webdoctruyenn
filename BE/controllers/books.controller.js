import {db} from "../config/config.js";

export const getBooks = (req, res) => {

    const sql = `
        SELECT
            b.id,
            b.title,
            b.author,
            b.cover_image,
            b.coin_price,
            b.views,
            b.favorites,
            GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
        FROM books b
        LEFT JOIN book_categories bc
            ON b.id = bc.book_id
        LEFT JOIN categories c
            ON bc.category_id = c.id
        WHERE b.status = 'published'
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
            views,
            favorites
        FROM books
        ORDER BY views DESC
        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi"
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
            coin_price
        FROM books
        ORDER BY created_at DESC
        LIMIT 8
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi"
            });

        }

        res.json(result);

    });

};
export const getBookById = (req, res) => {

    const sql = `
        SELECT
            b.*,
            GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
        FROM books b
        LEFT JOIN book_categories bc
            ON b.id = bc.book_id
        LEFT JOIN categories c
            ON bc.category_id = c.id
        WHERE b.id = ?
        GROUP BY b.id
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result[0]);

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
            b.coin_price
        FROM books b
        INNER JOIN book_categories bc
            ON b.id = bc.book_id
        WHERE bc.category_id = ?
    `;

    db.query(sql, [categoryId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Lỗi"
            });

        }

        res.json(result);

    });

}
export const searchBooks = (req, res) => {

    const sql = `
        SELECT *
        FROM books
        WHERE title LIKE ?
           OR author LIKE ?
        ORDER BY created_at DESC
    `;

    const keyword = `%${req.params.keyword}%`;

    db.query(sql, [keyword, keyword], (err, result) => {

        if (err) {
            return res.status(500).json(err);
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
            id,
            chapter_number,
            title
        FROM chapters
        WHERE book_id = ?
        ORDER BY chapter_number
    `;

    db.query(sql,[req.params.id],(err,result)=>{

        if(err)
            return res.status(500).json(err);

        res.json(result);

    });

};
export const getChapter = (req, res) => {

    const sql = `
        SELECT
            c.*,
            b.title AS book_title,
            b.author
        FROM chapters c
        JOIN books b
            ON c.book_id = b.id
        WHERE
            c.book_id = ?
        AND
            c.chapter_number = ?
    `;

    db.query(
        sql,
        [
            req.params.bookId,
            req.params.chapterNumber
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result[0]);

        }
    );

};
export const updateReadingHistory = (req, res) => {

    const userId = req.user.id;

    const { book_id } = req.body;

    // dùng userId thay vì req.body.user_id

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