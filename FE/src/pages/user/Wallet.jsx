import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Container,
    Card,
    Row,
    Col,
    Button
} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Wallet() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        api.get("/user/profile")
            .then((res) => {

                setUser(res.data);

            })
            .catch(console.log);

    }, []);

    if (!user) {

        return (
            <Container className="py-5">
                <h3>Đang tải...</h3>
            </Container>
        );

    }

    return (

        <Container className="py-5">

            <Card className="shadow">

                <Card.Body>

                    <h2 className="text-center mb-4">
                        Ví của tôi
                    </h2>

                    <Row className="text-center">

                        <Col>

                            <h1 className="text-warning">
                                💰 {user.total_coin}
                            </h1>

                            <p>Số coin hiện có</p>

                        </Col>

                    </Row>

                    <hr />

                    <div className="d-flex justify-content-center gap-3">

                        <Button
                            variant="success"
                            as={Link}
                            to="/buy"
                        >
                            Nạp Coin
                        </Button>

                        <Button
                            variant="outline-primary"
                            as={Link}
                            to="/transactions"
                        >
                            Lịch sử giao dịch
                        </Button>

                    </div>

                </Card.Body>

            </Card>

        </Container>

    );

}