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
    useSearchParams
} from "react-router-dom";
export default function Books() {

    const [books, setBooks] = useState([]);

    const [categories, setCategories] = useState([]);

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("search") || "";
    

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

    if (keyword.trim() === "") {

        loadBooks();

    } else {

        api.get(`/books/search/${encodeURIComponent(keyword)}`)
            .then((res) => {

                setBooks(res.data);

            })
            .catch(console.log);

    }

}, [keyword]);



    // Lọc theo thể loại
    const handleCategory = (id) => {

        if (id === "") {
            loadBooks();
            return;
        }

        api.get(`/books/category/${id}`)
            .then((res) => {
                setBooks(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    return (

        <Container className="py-5">

            <Row className="mb-4">

                <Col md={8}>

 

                </Col>

                <Col md={4}>

                    <Form.Select
                        onChange={(e) => handleCategory(e.target.value)}
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

                            <Card className="h-100 shadow">

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

                                <Card.Body>

                                    <h5>{book.title}</h5>

                                    <p className="text-muted">
                                        {book.author}
                                    </p>

                                    <p>
                                        <FaCoins className="text-warning me-2" />
                                         {book.coin_price} Coin
                                    </p>

                                    <p>
                                    <FaEye className="text-primary me-2" />

                                         {book.views}
                                    </p>

                                    <p>
                                    <FaHeart className="text-danger me-2" />
                                         {book.favorites}
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

        </Container>

    );

}