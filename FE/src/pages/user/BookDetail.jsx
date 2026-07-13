import { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    ListGroup
} from "react-bootstrap";

import {
    FaEye,
    FaHeart,
    FaCoins,
    FaBookOpen
} from "react-icons/fa";

export default function BookDetail(){

    const { id } = useParams();

    const [book,setBook]=useState({});
    const [chapters,setChapters]=useState([]);

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

                  

                    <Link
                        to={`/books/${book.id}/chapter/1`}
                        className="btn btn-success me-2"
                    >
                    <FaBookOpen className="me-2"/>
                        Đọc ngay
                    </Link>

                    <Button variant="warning">

                        Mua bằng Coin

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

        </Container>

    );

}