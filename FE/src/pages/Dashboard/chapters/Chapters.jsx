import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import ChapterForm from "../../../components/chapters/ChapterForm";
import { UPLOAD_URL } from "../../../config";
import {
    Card,
    Table,
    Button,
    Row,
    Col,
    Image,
    Spinner
} from "react-bootstrap";

export default function Chapters() {

    const { bookId } = useParams();

    const navigate = useNavigate();

    const [book, setBook] = useState(null);

    const [chapters, setChapters] = useState([]);

    const [show, setShow] = useState(false);

    const [editingChapter, setEditingChapter] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadData = async () => {

        try {

            const [bookRes, chapterRes] = await Promise.all([

                api.get(`/books/${bookId}`),

                api.get(`/chapters/book/${bookId}`)

            ]);

            setBook(bookRes.data);

            setChapters(chapterRes.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, [bookId]);

    const handleClose = () => {

        setShow(false);

        setEditingChapter(null);

    };

    const handleCreate = () => {

        setEditingChapter(null);

        setShow(true);

    };

    const handleEdit = async (id) => {

        try {

            const res = await api.get(`/chapters/${id}`);

            setEditingChapter(res.data);

            setShow(true);

        } catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn muốn xóa chương này?"))
            return;

        try {

            await api.delete(`/chapters/${id}`);

            loadData();

        } catch (err) {

            console.log(err);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-5">

                <Spinner />

            </div>

        );

    }

    return (

        <>

            <Card className="shadow">

                <Card.Body>

                    <Row className="align-items-center mb-4">

                        <Col>

                            <Button
                                variant="secondary"
                                onClick={() => navigate("/dashboard/books")}
                            >
                                ← Quay lại
                            </Button>

                        </Col>

                        <Col className="text-center">

                            <h3 className="mb-0">

                                {book.title}

                            </h3>

                            <small className="text-muted">

                                {book.author}

                            </small>

                        </Col>

                        <Col className="text-end">

                            <Button
                                onClick={handleCreate}
                            >
                                + Thêm chương
                            </Button>

                        </Col>

                    </Row>

                    <Row className="mb-4">

                        <Col md={2}>

                            <Image
                                src={`${UPLOAD_URL}/${book.cover_image}`}
                                thumbnail
                            />

                        </Col>

                        <Col>

                            <h5>

                                Tổng chương: {chapters.length}

                            </h5>

                            <p>

                                Giá mở khóa: {book.coin_price} Coin

                            </p>

                        </Col>

                    </Row>

                    <Table bordered hover responsive>

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Chương</th>

                                <th>Tiêu đề</th>

                                <th>Số trang</th>

                                <th>Ngày tạo</th>

                                <th width="220">

                                    Thao tác

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                chapters.map((chapter, index) => (

                                    <tr key={chapter.id}>

                                        <td>

                                            {index + 1}

                                        </td>

                                        <td>

                                            Chapter {chapter.chapter_number}

                                        </td>

                                        <td>

                                            {chapter.title}

                                        </td>

                                        <td>

                                            {chapter.total_pages}

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    chapter.created_at

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

                                            <Button
                                                size="sm"
                                                variant="warning"
                                                className="me-2"
                                                onClick={() =>
                                                    handleEdit(chapter.id)
                                                }
                                            >
                                                Sửa
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                    handleDelete(chapter.id)
                                                }
                                            >
                                                Xóa
                                            </Button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            <ChapterForm

                show={show}

                onHide={handleClose}

                loadData={loadData}

                editingChapter={editingChapter}

                bookId={bookId}

            />

        </>

    );

}