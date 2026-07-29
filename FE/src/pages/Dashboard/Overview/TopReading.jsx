import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Card, ListGroup, Badge } from "react-bootstrap";

export default function TopReading() {

    const [books, setBooks] = useState([]);

    useEffect(() => {

        api.get("/dashboard/top-reading")

            .then((res) => {

                setBooks(res.data);

            })

            .catch((err) => {

                console.log(err);

            });

    }, []);

    return (

        <Card className="shadow-sm border-0 h-100">

            <Card.Body>

                <h5 className="mb-3">

                    📖 Top sách được đọc

                </h5>

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

                                <Badge bg="success">

                                    {book.total_read}

                                </Badge>

                            </ListGroup.Item>

                        ))

                    }

                </ListGroup>

            </Card.Body>

        </Card>

    );

}