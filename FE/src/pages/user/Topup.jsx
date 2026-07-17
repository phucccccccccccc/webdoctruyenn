import { Container, Card, Button, Row, Col } from "react-bootstrap";
import api from "../../api/api";

export default function Topup() {

    const handlePayment = async (amount, coin) => {

        try {

            const res = await api.post("/payment/create", {
                amount,
                coin
            });

            const { checkoutURL, fields } = res.data;

            const form = document.createElement("form");

            form.method = "POST";
            form.action = checkoutURL;

            Object.entries(fields).forEach(([key, value]) => {

                const input = document.createElement("input");

                input.type = "hidden";
                input.name = key;
                input.value = value;

                form.appendChild(input);

            });

            document.body.appendChild(form);

            form.submit();

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
                            onClick={() => handlePayment(5000, 50)}
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

        </Container>

    );

}