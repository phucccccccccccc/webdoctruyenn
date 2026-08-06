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
                 Truyện đã đọc
            </h2>


           <Row xs={2} md={3} lg={4} xxl={5} className="g-4">

    {
        books.length > 0 ?

            books.map((book) => (

                <Col key={book.id}>

                    <Card className="h-100 shadow-sm d-flex flex-column">

                        <Card.Img
                            variant="top"
                            src={book.cover_image}
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

                            <p className="text-muted">
                                {book.author}
                            </p>

                            <p className="mb-2">
                                Đang đọc chương <b>{book.chapter_number}</b>
                            </p>

                            <p className="text-secondary small mb-3">
                                {new Date(book.last_read_at).toLocaleString()}
                            </p>

                            <Link
                                to={`/books/${book.id}/chapter/${book.chapter_number}`}
                                className="btn btn-success w-100 mt-auto"
                            >
                                Đọc tiếp
                            </Link>

                        </Card.Body>

                    </Card>

                </Col>

            ))

            :

            <Col xs={12}>

                <Card className="shadow-sm text-center p-5">

                    <h4>Chưa có lịch sử đọc</h4>

                    <p className="text-muted">
                        Hãy chọn một cuốn truyện để bắt đầu đọc.
                    </p>

                    <Link
                        to="/books"
                        className="btn btn-success"
                    >
                        Khám phá truyện
                    </Link>

                </Card>

            </Col>
    }

</Row>

        </Container>

    );

}