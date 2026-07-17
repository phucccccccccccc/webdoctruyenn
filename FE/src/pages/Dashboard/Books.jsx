import { useEffect, useState } from "react";
import api from "../../api/api";
import BookForm from "../../components/books/BookForm";
import { Link } from "react-router-dom";
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
    const [categories, setCategories] = useState([]);

    const [show, setShow] = useState(false);

    const [editingBook, setEditingBook] = useState(null);

    const loadBooks = async () => {

        try {

            const [bookRes, categoryRes] = await Promise.all([
                api.get("/books"),
                api.get("/category")
            ]);

            setBooks(bookRes.data);
            setCategories(categoryRes.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadBooks();

    }, []);

    const handleClose = () => {

        setShow(false);

        setEditingBook(null);

    };

    const handleEdit = async (id) => {

        try {

            const res = await api.get(`/books/${id}`);

            setEditingBook(res.data);

            setShow(true);

        } catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn muốn xóa truyện này?"))
            return;

        try {

            await api.delete(`/books/${id}`);

            loadBooks();

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <>

            <Card className="shadow">

                <Card.Body>

                    <Row className="mb-4">

                        <Col>

                            <h3>Quản lý Truyện</h3>

                        </Col>

                        <Col className="text-end">

                            <Button
                                variant="primary"
                                onClick={() => {

                                    setEditingBook(null);

                                    setShow(true);

                                }}
                            >
                                + Thêm Truyện
                            </Button>

                        </Col>

                    </Row>

                    <Row className="mb-3">

                        <Col md={4}>

                            <Form.Control
                                placeholder="Tìm tên truyện..."
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

                                <th>Tên truyện</th>

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
                                                onClick={() => handleEdit(book.id)}
                                            >
                                                Sửa
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="me-2"
                                                onClick={() => handleDelete(book.id)}
                                            >
                                                Xóa
                                            </Button>

                                            <Button
                                                as={Link}
                                                to={`/dashboard/books/${book.id}/chapters`}
                                                variant="info"
                                                size="sm"
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

            <BookForm

                show={show}

                onHide={handleClose}

                categories={categories}

                editingBook={editingBook}

                loadBooks={loadBooks}

            />

        </>

    );

}