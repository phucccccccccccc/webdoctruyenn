import { useEffect, useState } from "react";
import { Card, Form, Row, Col, Spinner } from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../../api/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function TransactionChart() {

    const [type, setType] = useState("week");

    const [loading, setLoading] = useState(true);

    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        setLoading(true);

        api.get(`/transactions/chart?type=${type}`)

            .then(res => {

                setChartData(res.data);

            })

            .catch(console.log)

            .finally(() => {

                setLoading(false);

            });

    }, [type]);

    const data = {

        labels: chartData.map(x => x.label),

        datasets: [

    {

        label: "Coin mua sách",

        data: chartData.map(x => x.spend),

        backgroundColor: "#0d6efd",

        borderRadius: 8,

        borderSkipped: false,

        maxBarThickness: 30

    },

    {

        label: "Coin đã nạp",

        data: chartData.map(x => x.earn),

        backgroundColor: "#198754",

        borderRadius: 8,

        borderSkipped: false,

        maxBarThickness: 30

    }

]

    };

    const options = {

    responsive: true,

    maintainAspectRatio: false,

    layout: {

        padding: {
            top: 10,
            bottom: 0,
            left: 0,
            right: 10
        }

    },

    plugins: {

        legend: {

    display: true,

    position: "top",

    labels: {

        usePointStyle: true,

        pointStyle: "rectRounded"

    }

}

    },

    scales: {

        x: {

            grid: {

                display: false

            }

        },

        y: {

            beginAtZero: true,

            grace: "5%",

            grid: {

                color: "#ececec"

            }

        }

    }

};

    return (

        <Card className="shadow-sm border-0 mb-4">

            <Card.Body>

                <Row className="align-items-center mb-4">

                    <Col>

                        Thống kê doanh thu

                    </Col>

                    <Col xs="auto">

                        <Form.Select

                            value={type}

                            onChange={(e) => setType(e.target.value)}

                        >

                            <option value="week">

                                7 ngày gần đây

                            </option>

                            <option value="month">

                                Theo tháng

                            </option>

                            <option value="year">

                                Theo năm

                            </option>

                        </Form.Select>

                    </Col>

                </Row>

                {

                    loading ?

                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: "220px" }}
                        >

                            <Spinner animation="border" />

                        </div>

                        :

                        <div style={{ height: 320 }}>

                            <Bar

                                data={data}

                                options={options}

                            />

                        </div>

                }

            </Card.Body>

        </Card>

    );

}