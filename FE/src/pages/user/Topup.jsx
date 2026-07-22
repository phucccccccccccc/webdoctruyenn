import { useState } from "react";
import {
    Container,
    Card,
    Button,
    Row,
    Col,
    Modal
} from "react-bootstrap";

import api from "../../api/api";

export default function Topup() {

    const [show, setShow] = useState(false);

    const [qr, setQr] = useState("");

    const [amount, setAmount] = useState(0);

    const [orderCode, setOrderCode] = useState("");

    const [status, setStatus] = useState("pending");

 const handlePayment = async (money, coin) => {

    try {

        const res = await api.post("/payment/create", {
            amount: money,
            coin
        });

        setQr(res.data.qr);
        setAmount(res.data.amount);
        setOrderCode(res.data.orderCode);
        setStatus("pending");
        setShow(true);

        const interval = setInterval(async () => {

            try {

                const result = await api.get(
                    `/payment/status/${res.data.orderCode}`
                );

                if (result.data.status === "success") {

                    clearInterval(interval);

                    setStatus("success");

                    window.dispatchEvent(
                        new Event("coinUpdated")
                    );

                }

            } catch (err) {

                console.log(err);

            }

        }, 3000);

    } catch (err) {

        console.log(err);

        alert("Không thể tạo thanh toán.");

    }

};

    return (

        <Container className="py-5">

            <h2 className="mb-4">

                Nạp Coin

            </h2>

            <Row>

                <Col md={4}>

                    <Card className="shadow p-4 text-center">

                        <h4>50 Coin</h4>

                        <h5>5.000đ</h5>

                        <Button
    variant="danger"
    onClick={() => {
        
        handlePayment(5000, 50);
    }}
>
    Thanh toán
</Button>
                    </Card>

                </Col>

                <Col md={4}>

                    <Card className="shadow p-4 text-center">

                        <h4>100 Coin</h4>

                        <h5>10.000đ</h5>

                        <Button
                            onClick={() => handlePayment(10000, 100)}
                        >
                            Thanh toán
                        </Button>

                    </Card>

                </Col>

                <Col md={4}>

                    <Card className="shadow p-4 text-center">

                        <h4>500 Coin</h4>

                        <h5>50.000đ</h5>

                        <Button
                            onClick={() => handlePayment(50000, 500)}
                        >
                            Thanh toán
                        </Button>

                    </Card>

                </Col>

            </Row>

            <Modal
                show={show}
                centered
                onHide={() => {

                    setShow(false);

                    setStatus("pending");

                }}
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        Nạp Coin

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body className="text-center">

                    {

                        status === "pending"

                        ?

                        <>

                            <img
                                src={qr}
                                alt="QR"
                                className="img-fluid"
                            />

                            <h5 className="mt-3">

                                {Number(amount || 0).toLocaleString()} VNĐ

                            </h5>

                            <p>

                                Nội dung chuyển khoản

                            </p>

                            <h4 className="text-danger">

                                {orderCode}

                            </h4>

                            <small>

                                Chuyển đúng nội dung để hệ thống tự cộng Coin.

                            </small>

                        </>

                        :

                        <>

                            <div
                                className="display-1"
                            >

                                ✅

                            </div>

                            <h3 className="text-success">

                                Nạp Coin thành công

                            </h3>

                            <p>

                                Coin đã được cộng vào tài khoản.

                            </p>

                        </>

                    }

                </Modal.Body>

            </Modal>

        </Container>

    );

}