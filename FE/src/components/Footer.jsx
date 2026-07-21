// src/components/Footer.jsx
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-dark text-light mt-5 py-4">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>DocTruyen</h5>
                        <p>
                            Nền tảng đọc truyện online với hàng ngàn đầu truyện
                            hấp dẫn.
                        </p>
                    </Col>

                    <Col md={4}>
                        <h5>Liên kết</h5>

                        <ul className="list-unstyled">
                            <li>
                                <Link
                                    to="/"
                                    className="text-light text-decoration-none"
                                >
                                    Trang chủ
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/books"
                                    className="text-light text-decoration-none"
                                >
                                    Kho truyện
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/categories"
                                    className="text-light text-decoration-none"
                                >
                                    Thể loại
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h5>Liên hệ</h5>

                        <p>Email: phucdanghaihoang@doctruyen.vn</p>
                        <p>Hotline: 0123 456 789</p>
                    </Col>
                </Row>

                <hr />

                <div className="text-center">
                    © 2026 DocTruyen. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}