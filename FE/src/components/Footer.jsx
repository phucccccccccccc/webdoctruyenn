import {
    Container,
    Row,
    Col,
    Image
} from "react-bootstrap";

import {
    FaPhoneAlt,
    FaEnvelope
} from "react-icons/fa";

import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <Container>
                <Row>

                    {/* Left */}
                    <Col lg={4} md={12} className="mb-4">

                        <h1 className="footer-logo">
                            WAKA
                        </h1>

                        <p className="footer-company">
                            Công ty cổ phần sách điện tử Waka
                        </p>

                        <div className="footer-contact">
                            <p>
                                <FaPhoneAlt /> 08777736289
                            </p>

                            <p>
                                <FaEnvelope /> support@waka.vn
                            </p>
                        </div>

                        <div className="footer-download">

                            <Image
                                src="/images/qr.png"
                                className="qr"
                                fluid
                            />

                            <div className="stores">

                                <Image
                                    src="/images/appstore.png"
                                    fluid
                                    className="store"
                                />

                                <Image
                                    src="/images/googleplay.png"
                                    fluid
                                    className="store"
                                />

                            </div>

                        </div>

                    </Col>

                    {/* About */}
                    <Col lg={2} md={6}>
                        <h5>Về chúng tôi</h5>

                        <ul>
                            <li>Giới thiệu</li>
                            <li>Cơ cấu tổ chức</li>
                            <li>Lĩnh vực hoạt động</li>
                            <li>Cơ hội đầu tư</li>
                            <li>Tuyển dụng</li>
                            <li>Liên hệ</li>
                            <li>Dịch vụ xuất bản sách</li>
                        </ul>
                    </Col>

                    {/* Info */}
                    <Col lg={3} md={6}>
                        <h5>Thông tin hữu ích</h5>

                        <ul>
                            <li>Thỏa thuận sử dụng</li>
                            <li>Quyền lợi</li>
                            <li>Quy định riêng tư</li>
                            <li>Câu hỏi thường gặp</li>
                            <li>Tiếp nhận đánh giá</li>
                            <li>Danh sách phản ánh</li>
                        </ul>
                    </Col>

                    {/* Support */}
                    <Col lg={2} md={6}>
                        <h5>Hỗ trợ khách hàng</h5>

                        <ul>
                            <li>Chính sách đổi trả</li>
                            <li>Thanh toán</li>
                            <li>Giải quyết khiếu nại</li>
                            <li>Hàng hóa cấm</li>
                            <li>Xác nhận/Hủy đơn</li>
                            <li>Bảo mật thông tin</li>
                        </ul>
                    </Col>

                    {/* News */}
                    <Col lg={1} md={6}>
                        <h5>Tin tức</h5>

                        <ul>
                            <li>Tin dịch vụ</li>
                            <li>Review sách</li>
                            <li>Lịch phát hành</li>
                        </ul>
                    </Col>

                </Row>
            </Container>
        </footer>
    );
}