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
