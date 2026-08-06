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

           

            {/* <h3 className="text-center text-muted mb-5">
                Bạn đã sở hữu <strong>{books.length}</strong> cuốn truyện
            </h3> */}

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

                            <p className="text-success fw-bold">
                                ✔ Đã mua
                            </p>

                            <Link
                                to={`/books/${book.id}/chapter/1`}
                                className="btn btn-success w-100 mt-auto"
                            >
                                Đọc ngay
                            </Link>

                        </Card.Body>

                    </Card>

                </Col>

            ))

            :

            <Col xs={12}>

                <Card className="shadow-sm text-center p-5">

                    <h4>Bạn chưa mua truyện nào.</h4>

                    <p className="text-muted">
                        Hãy khám phá kho truyện của chúng tôi.
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