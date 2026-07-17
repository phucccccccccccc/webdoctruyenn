import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Container,
    Row,
    Col,
    Card,
    Button
} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ReadingHistory() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [books, setBooks] = useState([]);

    useEffect(() => {

        api
            .get(`/user/history`)
            .then((res) => {

                setBooks(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    return (

        <Container className="py-5">

            <h2 className="fw-bold text-center mb-3">
                 Sách đã đọc
            </h2>


            <Row>

                {
                    books.length > 0 ?

                        books.map((book) => (

                            <Col
                                lg={3}
                                md={4}
                                sm={6}
                                key={book.id}
                                className="mb-4"
                            >

                                <Card className="shadow h-100">

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

                                        <p className="text-muted mb-1">
                                            {book.author}
                                        </p>

                                        <p className="mb-1">
                                             Đang đọc chương
                                            <b> {book.chapter_number}</b>
                                        </p>

                                        <p className="text-secondary small">
                                            {new Date(book.last_read_at).toLocaleString()}
                                        </p>

                                        <Button
                                            as={Link}
                                            to={`/books/${book.id}/chapter/${book.chapter_number}`}
                                            className="w-100"
                                            variant="success"
                                        >
                                            Đọc tiếp
                                        </Button>

                                    </Card.Body>

                                </Card>

                            </Col>

                        ))

                        :

                        <Col>

                            <Card className="shadow p-5 text-center">

                                <h4>Chưa có lịch sử đọc</h4>

                                <p className="text-muted">
                                    Hãy chọn một cuốn sách để bắt đầu đọc.
                                </p>

                                <Button
                                    as={Link}
                                    to="/books"
                                >
                                    Khám phá sách
                                </Button>

                            </Card>

                        </Col>

                }

            </Row>

        </Container>

    );

}