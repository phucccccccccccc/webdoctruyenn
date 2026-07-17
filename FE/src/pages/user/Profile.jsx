import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Container,
    Card,
    Row,
    Col,
    Image
} from "react-bootstrap";

export default function Profile() {

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

                    <Row>

                        <Col
                            md={4}
                            className="text-center"
                        >

                            <Image
                                src={
                                    user.avatar
                                        ? user.avatar
                                        : "https://ui-avatars.com/api/?name=" +
                                          encodeURIComponent(user.username)
                                }
                                roundedCircle
                                width={170}
                                height={170}
                            />

                        </Col>

                        <Col md={8}>

                            <h3>{user.username}</h3>

                            <hr />

                            <p>
                                <b>Email:</b> {user.email}
                            </p>

                            <p>
                                <b>Vai trò:</b> {user.role}
                            </p>

                            <p>
                                <b>Coin:</b> {user.total_coin}
                            </p>

                           <p>
    <b>Ngày tạo:</b>{" "}
    {new Date(user.created_at).toLocaleDateString("vi-VN")}
</p>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

        </Container>

    );

}