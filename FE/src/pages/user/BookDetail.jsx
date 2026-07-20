import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/api";

import { toast } from "react-toastify";

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    ListGroup,
    Modal
} from "react-bootstrap";

import {
    FaEye,
    FaHeart,
    FaCoins,
    FaBookOpen
} from "react-icons/fa";

export default function BookDetail(){

    const navigate = useNavigate();

    const [selectedBook, setSelectedBook] = useState(null);

    const [showBuyModal, setShowBuyModal] = useState(false);

    const [showCoinModal, setShowCoinModal] = useState(false);

    const { id } = useParams();

    const [book, setBook] = useState({});

    const [chapters, setChapters] = useState([]);
    
    const handleRead = async () => {

    try {

        await api.get(`/books/${book.id}/chapter/1`);

        navigate(`/books/${book.id}/chapter/1`);

    } catch (err) {

        if (err.response?.data?.code === "BOOK_NOT_PURCHASED") {

            setSelectedBook({

                ...book,

                coin_price: err.response.data.coin_price

            });

            setShowBuyModal(true);

            return;

        }

        toast.error(

            err.response?.data?.message ||

            "Có lỗi xảy ra"

        );

    }

};
    useEffect(()=>{

        api.get(`/books/${id}`)
        .then((res)=>{

            setBook(res.data);

        });

        api.get(`/books/${id}/chapters`)
        .then((res)=>{

            setChapters(res.data);

        });

    },[id]);

const handleBuy = async () => {

    try {

        const res = await api.post("/books/buy", {

            book_id: selectedBook.id

        });

        toast.success(res.data.message);

        setShowBuyModal(false);

        navigate(`/books/${selectedBook.id}/chapter/1`);

    } catch (err) {

        if (err.response?.data?.message?.includes("Không đủ")) {

    setShowBuyModal(false);

    setShowCoinModal(true);

    return;

}
    }

};

    return(

        <Container className="py-5">

            <Row>

                <Col md={4}>

                    <Card className="shadow">

                        <Card.Img
                            src={`http://localhost:5000/uploads/${book.cover_image}`}
                        />

                    </Card>

                </Col>

                <Col md={8}>

                    <h2>{book.title}</h2>

                    <h5 className="text-muted">
                        {book.author}
                    </h5>

                    <p>

                        <strong>Thể loại:</strong>

                        {book.categories}

                    </p>

                    <p>

                        <FaCoins className="text-warning"/>

                        {" "}

                        {book.coin_price} Coin

                    </p>

                    <p>

                        <FaEye/>

                        {" "}

                        {book.views}

                        {"   "}

                        <FaHeart className="text-danger"/>

                        {" "}

                        {book.favorites}

                    </p>

                    <hr/>

                    <p>

                        <strong>Nhà xuất bản:</strong>

                        {book.publisher}

                    </p>

                    <p>

                        <strong>Năm xuất bản:</strong>

                        {book.publish_year}

                    </p>

                    <p>

                        <strong>Số trang:</strong>

                        {book.page_count}

                    </p>

                    <p>

                        <strong>Ngôn ngữ:</strong>

                        {book.language}

                    </p>

                  

                    <Button
                        variant="success"
                        onClick={handleRead}
                    >
                        <FaBookOpen className="me-2"/>
                        Đọc ngay
                    </Button>


                </Col>

            </Row>

            <Row className="mt-5">

                <Col>

                    <Card className="shadow">

                        <Card.Header>

                            <h4>Giới thiệu</h4>

                        </Card.Header>

                        <Card.Body>

                            {book.description}

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            <Row className="mt-4">

                <Col>

                    <Card className="shadow">

                        <Card.Header>

                            <h4>Danh sách chương</h4>

                        </Card.Header>

                        <ListGroup variant="flush">

                            {
                                chapters.map((chapter)=>(

                                    <ListGroup.Item
                                        key={chapter.id}
                                        action
                                    >

                                        Chương {chapter.chapter_number}

                                        : {chapter.title}

                                    </ListGroup.Item>

                                ))
                            }

                        </ListGroup>

                    </Card>

                </Col>

            </Row>
            <Modal
    show={showBuyModal}
    onHide={() => setShowBuyModal(false)}
>

    <Modal.Header closeButton>

        <Modal.Title>

           Bạn chưa mua sách

        </Modal.Title>

    </Modal.Header>

    <Modal.Body>

        Bạn cần mua cuốn sách này để đọc.

        <br />

        <b>

            Giá: {selectedBook?.coin_price} Coin

        </b>

    </Modal.Body>

    <Modal.Footer>

        <Button
            variant="secondary"
            onClick={() => setShowBuyModal(false)}
        >
            Hủy
        </Button>

        <Button
            variant="warning"
            onClick={handleBuy}
        >
            Mua ngay
        </Button>

    </Modal.Footer>

</Modal>
<Modal
    show={showCoinModal}
    onHide={() => setShowCoinModal(false)}
>

    <Modal.Header closeButton>

        <Modal.Title>

            💰 Không đủ Coin

        </Modal.Title>

    </Modal.Header>

    <Modal.Body>

        Bạn không đủ Coin để mua sách.

    </Modal.Body>

    <Modal.Footer>

        <Button
            variant="secondary"
            onClick={() => setShowCoinModal(false)}
        >
            Đóng
        </Button>

        <Button
            variant="success"
            onClick={() => navigate("/buy")}
        >
            Nạp Coin
        </Button>

    </Modal.Footer>

</Modal>

        </Container>

    );

}