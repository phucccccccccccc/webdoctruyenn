import { useEffect, useState } from "react";
import api from "../../../api/api";
import {
    Card,
    ListGroup,
    Badge,
    Spinner
} from "react-bootstrap";

export default function TopSales() {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/dashboard/top-sales")

            .then((res) => {

                setBooks(res.data);
                setLoading(false);

            })

            .catch((err) => {

                console.log(err);
                setLoading(false);

            });

    }, []);

    if (loading) {

        return (

            <Card className="shadow-sm border-0 h-100 dashboard-card">

                <Card.Body className="d-flex justify-content-center align-items-center">

                    <Spinner animation="border" />

                </Card.Body>

            </Card>

        );

    }

    return (

        <Card className="shadow-sm border-0 h-100 dashboard-card">

            <Card.Body>

                <h5 className="mb-3">

                    🔥 Top 5 sách mua nhiều

                </h5>

                {

                    books.length === 0 ?

                        <div className="text-center text-muted py-4">

                            Chưa có dữ liệu

                        </div>

                        :

                        <ListGroup variant="flush">

                            {

                                books.map((book, index) => (

                                    <ListGroup.Item
                                        key={book.id}
                                        className="d-flex justify-content-between align-items-center"
                                    >

                                        <div>

                                            <strong>

                                                #{index + 1}

                                            </strong>

                                            {" "}

                                            {book.title}

                                        </div>

                                        <Badge bg="primary">

                                            {Number(book.total_sales).toLocaleString("vi-VN")}

                                        </Badge>

                                    </ListGroup.Item>

                                ))

                            }

                        </ListGroup>

                }

            </Card.Body>

        </Card>

    );

}