import { useEffect, useState } from "react";
import api from "../../api/api";
import { Row, Col, Card } from "react-bootstrap";

export default function Overview(){

    const [stats,setStats] = useState({});

    useEffect(()=>{

        api.get("/dashboard/stats")

        .then((res)=>{

            setStats(res.data);

        })

        .catch((err)=>{

            console.log(err);

        })

    },[])

    return(

        <Row>
            <Col md={3}>
                <Card className="shadow">
                    <Card.Body>
                        <h6>Tổng số sách</h6>
                        <h2>
                            {stats.totalBooks}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={3}>
                <Card className="shadow">
                    <Card.Body>
                        <h6>Tổng số user</h6>
                        <h2>
                            {stats.totalUsers}
                        </h2>
                    </Card.Body>
                </Card>

            </Col>

            <Col md={3}>
                <Card className="shadow">
                    <Card.Body>
                        <h6>Tổng số coin</h6>
                        <h2>
                            {stats.totalCoins}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={3}>
                <Card className="shadow">
                    <Card.Body>
                        <h6>Tổng giao dịch</h6>
                        <h2>
                            {stats.totalTransactions}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

        </Row>

    )

}