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
import { UPLOAD_URL } from "../config";

export default function Membership() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [books, setBooks] = useState([]);

    useEffect(() => {

        api
            .get("/user/books")
            .then((res) => {

                setBooks(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    return (

        <Container className="py-5">

           

            <h3 className="text-center text-muted mb-5">
                Bạn đã sở hữu <strong>{books.length}</strong> cuốn sách
            </h3>

            <Row>

                {
                    books.length > 0 ?

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
                                src={`${UPLOAD_URL}/${book.cover_image}`}
                                style={{
                                    height: "320px",
                                    width: "100%",
                                    objectFit: "contain",
                                    backgroundColor: "#f5f5f5"
                                        }}
                                    />

                                    <Card.Body className="d-flex flex-column">

                                        <h5>{book.title}</h5>

                                        <p className="text-muted mb-1">
                                            {book.author}
                                        </p>

                                        <p className="text-success fw-bold">
                                            ✔ Đã mua
                                        </p>

                                        <Button
                                            as={Link}
                                            to={`/books/${book.id}/chapter/1`}
                                            variant="success"
                                            className="mt-auto"
                                        >
                                            Đọc ngay
                                        </Button>

                                    </Card.Body>

                                </Card>

                            </Col>

                        ))

                        :

                        <Col>

                            <Card className="shadow text-center p-5">

                                <h4>Bạn chưa mua sách nào.</h4>

                                <p className="text-muted">
                                    Hãy khám phá kho sách của chúng tôi.
                                </p>

                                <Button
                                    as={Link}
                                    to="/books"
                                    variant="primary"
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