import { useEffect, useState } from "react";
import api from "../../../api/api";

import {
    Row,
    Col,
    Card,
    Spinner
} from "react-bootstrap";

import {
    BsBook,
    BsPeople,
    BsCoin,
    BsCashStack
} from "react-icons/bs";

export default function StatsCard() {

    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalCoins: 0,
        totalTransactions: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/dashboard/stats")

            .then((res) => {

                setStats(res.data);
                setLoading(false);

            })

            .catch((err) => {

                console.log(err);
                setLoading(false);

            });

    }, []);

    const cards = [

        {
            title: "Tổng số sách",
            value: stats.totalBooks,
            color: "primary",
            icon: <BsBook size={30} />
        },

        {
            title: "Tổng số user",
            value: stats.totalUsers,
            color: "success",
            icon: <BsPeople size={30} />
        },

        {
            title: "Tổng số coin",
            value: Number(stats.totalCoins).toLocaleString("vi-VN"),
            color: "warning",
            icon: <BsCoin size={30} />
        },

        {
            title: "Tổng giao dịch",
            value: stats.totalTransactions,
            color: "danger",
            icon: <BsCashStack size={30} />
        }

    ];

    if (loading) {

        return (

            <Row>

                {[1, 2, 3, 4].map((item) => (

                    <Col lg={3} md={6} className="mb-4" key={item}>

                        <Card className="shadow-sm border-0">

                            <Card.Body
                                className="d-flex justify-content-center align-items-center"
                                style={{ height: "120px" }}
                            >

                                <Spinner animation="border" />

                            </Card.Body>

                        </Card>

                    </Col>

                ))}

            </Row>

        );

    }

    return (

        <Row>

            {

                cards.map((item, index) => (

                    <Col lg={3} md={6} className="mb-4" key={index}>

                        <Card className="shadow-sm border-0">

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h6 className="text-secondary mb-2">

                                            {item.title}

                                        </h6>

                                        <h2 className="fw-bold mb-0">

                                            {item.value}

                                        </h2>

                                    </div>

                                    <div
                                        className={`text-${item.color}`}
                                        style={{ fontSize: "2rem" }}
                                    >

                                        {item.icon}

                                    </div>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                ))

            }

        </Row>

    );

}