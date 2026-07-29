import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Card, ListGroup } from "react-bootstrap";

export default function SalesSummary() {

    const [sales, setSales] = useState({
        week: 0,
        month: 0,
        year: 0
    });

    useEffect(() => {

        api.get("/dashboard/sales")

            .then((res) => {

                setSales(res.data);

            })

            .catch((err) => {

                console.log(err);

            });

    }, []);

    return (

        <Card className="shadow-sm border-0 h-100">

            <Card.Body>

                <h5 className="mb-3">

                    Sách đã bán

                </h5>

                <ListGroup variant="flush">

                    <ListGroup.Item className="d-flex justify-content-between">

                        <span>Tuần này</span>

                        <strong>{sales.week}</strong>

                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between">

                        <span>Tháng này</span>

                        <strong>{sales.month}</strong>

                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between">

                        <span>Năm nay</span>

                        <strong>{sales.year}</strong>

                    </ListGroup.Item>

                </ListGroup>

            </Card.Body>

        </Card>

    );

}