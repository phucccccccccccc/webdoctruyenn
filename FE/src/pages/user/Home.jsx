import { useEffect, useState } from "react";
import api from "../../api/api";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
    FaEye,
    FaHeart,
    FaCoins
    
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {


const [featuredBooks, setFeaturedBooks] = useState([]);
const [newBooks, setNewBooks] = useState([]);
const [categories, setCategories] = useState([]);
const [comingSoonBooks, setComingSoonBooks] = useState([]);

const [topViewBooks, setTopViewBooks] = useState([]);

useEffect(() => {

    api
        .get("/books/featured")
        .then((res) => {

            setFeaturedBooks(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

    api
        .get("/books/new")
        .then((res) => {

            setNewBooks(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

    api
        .get("/category")
        .then((res) => {

            setCategories(res.data);

        })
        .catch((err) => {

            console.log(err);

        });
        api.get("/books/coming-soon")
    .then((res) => {

        console.log("Coming Soon:", res.data);

        setComingSoonBooks(res.data);

    })
    .catch(console.log);

api
    .get("/books/views")
    .then((res) => {

        setTopViewBooks(res.data);

    })
    .catch(console.log);

}, []);
const renderBooks = (books) => (

    <Row xs={2} md={3} lg={4} xxl={5} className="g-4">

        {

            books.map((book) => (

                <Col
                    key={book.id}
                >

                    <Card className="h-100 shadow-sm d-flex flex-column">

                        <Card.Img
                            variant="top"
                            src={`http://localhost:5000/uploads/${book.cover_image}`}
                            style={{
                                height: "320px",
                                width: "100%",
                                objectFit: "contain",
                                backgroundColor: "#f5f5f5"
                            }}
                        />

                        <Card.Body className="d-flex flex-column">

                            <Card.Title
                                style={{
                                    minHeight: "48px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}
                            >
                                {book.title}
                            </Card.Title>

                            <p>{book.author}</p>

                            <p>

                                <FaCoins className="text-warning me-2"/>

                                {book.coin_price} Coin

                            </p>

                            <p>

                                <FaEye className="text-primary me-2"/>

                                {book.views}

                            </p>


                            <Link
                                to={`/books/${book.id}`}
                                className="btn btn-success w-100"
                            >
                                Xem chi tiết
                            </Link>

                        </Card.Body>

                    </Card>

                </Col>

            ))

        }

    </Row>

);

return (

    <>

        

        <h3 className="mt-5 mb-3">
            📚 Sách mới cập nhật
        </h3>

        {renderBooks(newBooks)}

        <div className="text-center mb-5">

            <Button
                as={Link}
                to="/books"
                variant="outline-success"
            >
                Xem tất cả sách
            </Button>

        </div>

        <h3 className="mt-5 mb-3">
            ⭐ Sách nổi bật
        </h3>

        {renderBooks(featuredBooks)}
        <h3 className="mb-3">
            🚀 Sách sắp ra mắt
        </h3>

        {
            comingSoonBooks.length === 0 ?

            <Card className="mb-5">

                <Card.Body className="text-center text-muted">

                    Hiện chưa có sách sắp ra mắt.

                </Card.Body>

            </Card>

            :

            renderBooks(comingSoonBooks)

        }
        <h3 className="mt-5 mb-3">
    👁 Đọc nhiều nhất
</h3>

{renderBooks(topViewBooks)}

<div className="text-center mb-5">

    <Button
        as={Link}
        to="/books"
        variant="outline-primary"
    >
        Xem thêm
    </Button>

</div>




</>

);

}
