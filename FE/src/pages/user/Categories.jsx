import { useEffect, useState } from "react";
import api from "../../api/api";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Categories() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        api.get("/category")
            .then((res) => {

                setCategories(res.data);

            })
            .catch(console.log);

    }, []);

    return (

        <Container className="py-5">

            <h2 className="mb-4 fw-bold">
                 Danh mục truyện
            </h2>

            <Row>

                {
                    categories.map((category) => (

                        <Col
                            md={3}
                            key={category.id}
                            className="mb-4"
                        >

                            <Card className="shadow h-100">

                                <Card.Body className="text-center">

                                    <h5>{category.name}</h5>

                                    <p className="text-muted">
                                        {category.description}
                                    </p>

                                    <Button
                                        as={Link}
                                        to={`/books/category/${category.id}`}
                                        variant="success"
                                    >
                                        Xem truyện
                                    </Button>

                                </Card.Body>

                            </Card>

                        </Col>

                    ))
                }

            </Row>

        </Container>

    );

}