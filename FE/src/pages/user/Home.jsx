import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Button } from "react-bootstrap";

export default function Home() {


const [featuredBooks, setFeaturedBooks] = useState([]);
const [newBooks, setNewBooks] = useState([]);
const [categories, setCategories] = useState([]);

useEffect(() => {

    axios
        .get("http://localhost:5000/api/books/featured")
        .then((res) => {

            setFeaturedBooks(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

    axios
        .get("http://localhost:5000/api/books/new")
        .then((res) => {

            setNewBooks(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

    axios
        .get("http://localhost:5000/api/category")
        .then((res) => {

            setCategories(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

}, []);

return (

    <>
        <h3 className="mb-3">
             Sách nổi bật
        </h3>

        <Row>

            {

                featuredBooks.map((book) => (

                    <Col
                        md={3}
                        key={book.id}
                        className="mb-4"
                    >

                        <Card className="h-100 shadow-sm">

                            <Card.Img
                                variant="top"
                                src={`http://localhost:5000/uploads/${book.cover_image}`}
                                style={{
                                    height: "320px",
                                    width: "100%",
                                    objectFit: "contain",
                                    backgroundColor: "#f5f5f5"
                                }}
                            />

                            <Card.Body>

                                <Card.Title>
                                    {book.title}
                                </Card.Title>

                                <p>
                                    {book.author}
                                </p>

                                <p>
                                    {book.coin_price} Coin
                                </p>

                                <Button className="bg-success">
                                    Xem chi tiết
                                </Button>

                            </Card.Body>

                        </Card>

                    </Col>

                ))

            }

        </Row>
        <h3 className="mt-5 mb-3">
     Thể loại
</h3>

<div className="mb-5">

    {

        categories.map((category) => (

            <Button
                key={category.id}
                variant="outline-success"
                className="me-2 mb-2"
            >

                {category.name}

            </Button>

        ))

    }

</div>
<h3 className="mt-5 mb-3">
     Sách mới cập nhật
</h3>

<Row>

    {

        newBooks.map((book) => (

            <Col
                md={3}
                key={book.id}
                className="mb-4"
            >

                <Card className="h-100 shadow-sm">

                    <Card.Img
                        variant="top"
                        src={`http://localhost:5000/uploads/${book.cover_image}`}
                        style={{
                            height: "320px",
                            width: "100%",
                            objectFit: "contain",
                            backgroundColor: "#f5f5f5"
                        }}
                    />

                    <Card.Body>

                        <Card.Title>
                            {book.title}
                        </Card.Title>

                        <p>
                            {book.author}
                        </p>

                        <p>
                            {book.coin_price} Coin
                        </p>
                                <Button className="bg-success">
                                    Xem chi tiết
                                </Button>

                    </Card.Body>

                </Card>

            </Col>

        ))

    }

</Row>

    </>

);

}
