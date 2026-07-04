import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Row,
    Col,
    Form,
    Image,
    Card
} from "react-bootstrap";

export default function Books() {

    const [books, setBooks] = useState([]);

    useEffect(() => {

        axios
            .get("http://localhost:5000/api/books")
            .then((res) => {

                setBooks(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    return (

        <Card className="shadow">

            <Card.Body>

                <Row className="mb-4">

                    <Col>

                        <h3>Quản lý sách</h3>

                    </Col>

                    <Col className="text-end">

                        <Button variant="primary">

                            + Thêm sách

                        </Button>

                    </Col>

                </Row>

                <Row className="mb-3">

                    <Col md={4}>

                        <Form.Control
                            placeholder="Tìm tên sách..."
                        />

                    </Col>

                    <Col>

                        <Button>

                            Tìm kiếm

                        </Button>

                    </Col>

                </Row>

                <Table bordered hover responsive>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Ảnh</th>

                            <th>Tên sách</th>

                            <th>Tác giả</th>

                            <th>Coin</th>

                            <th>Thao tác</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            books.map((book) => (

                                <tr key={book.id}>

                                    <td>{book.id}</td>

                                    <td>

                                        <Image
                                            src={`http://localhost:5000/uploads/${book.cover_image}`}
                                            width={60}
                                            height={80}
                                            rounded
                                        />

                                    </td>

                                    <td>{book.title}</td>

                                    <td>{book.author}</td>

                                    <td>{book.coin_price}</td>

                                    <td>

                                        <Button
                                            size="sm"
                                            variant="warning"
                                            className="me-2"
                                        >
                                            Sửa
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            className="me-2"
                                        >
                                            Xóa
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="success"
                                        >
                                            Chương
                                        </Button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

}