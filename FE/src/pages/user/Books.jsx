import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    FaEye,
    FaHeart,
    FaCoins,
    FaUserEdit
} from "react-icons/fa";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    InputGroup
} from "react-bootstrap";
import {
    Link,
    useSearchParams,
    useNavigate 
} from "react-router-dom";

import { UPLOAD_URL } from "../../config";

export default function Books() {

    const [books, setBooks] = useState([]);

    const [categories, setCategories] = useState([]);

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("search") || "";
    
    const navigate = useNavigate();
    
    const categoryId = searchParams.get("category") || "";
    
    // Lấy tất cả sách
    const loadBooks = () => {

        api.get("/books")
            .then((res) => {
                setBooks(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    // Lấy danh mục
    const loadCategories = () => {

        api.get("/category")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    useEffect(() => {

    loadCategories();

}, []);

useEffect(() => {

    if (categoryId) {

        api.get(`/books/category/${categoryId}`)
            .then((res) => {

                setBooks(res.data);

            })
            .catch(console.log);

        return;

    }

    if (keyword.trim() !== "") {

        api.get(`/books/search/${encodeURIComponent(keyword)}`)
            .then((res) => {

                setBooks(res.data);

            })
            .catch(console.log);

        return;

    }

    loadBooks();

}, [keyword, categoryId]);



    // Lọc theo thể loại
   

    return (

        <Container className="py-5">

            <Row className="mb-4">

                <Col md={8}>

 

                </Col>

                <Col md={4}>

                    <Form.Select
                            value={categoryId}
                            onChange={(e) => {

                                if (e.target.value === "") {

                                    navigate("/books");

                                } else {

                                    navigate(`/books?category=${e.target.value}`);

                                }

                            }}
                        >

                        <option value="">
                            Tất cả thể loại
                        </option>

                        {
                            categories.map((cate) => (

                                <option
                                    key={cate.id}
                                    value={cate.id}
                                >
                                    {cate.name}
                                </option>

                            ))
                        }

                    </Form.Select>

                </Col>

            </Row>

            <p>
                Hiển thị <b>{books.length}</b> cuốn sách
            </p>

            <Row>

                {
                    books.map((book) => (

                        <Col
                            lg={3}
                            md={4}
                            sm={6}
                            className="mb-4"
                            key={book.id}
                        >

                           <Card className="h-100 shadow-sm d-flex flex-column">

                        <Card.Img
                            variant="top"
                            src={`${UPLOAD_URL}/${book.cover_image}`}
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
                                className="btn btn-success w-100 mt-auto"
                            >
                                Xem chi tiết
                            </Link>
                        </Card.Body>

                    </Card>

                        </Col>

                    ))
                }

            </Row>

        </Container>

    );

}