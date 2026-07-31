import { useEffect, useState } from "react";
import api from "../../../api/api";

import {
    Card,
    Spinner
} from "react-bootstrap";

import {
    Line
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function RevenueChart() {

    const [loading, setLoading] = useState(true);

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {

        api.get("/dashboard/revenue")

           .then((res) => {

    const labels = res.data.map(item =>
        new Date(item.day).toLocaleDateString("vi-VN")
    );

    const revenue = res.data.map(item => item.revenue);

    setChartData({
        labels,
        datasets: [
            {
                label: "Doanh thu Coin",
                data: revenue,
                borderColor: "#198754",
                backgroundColor: "rgba(25,135,84,.2)",
                tension: 0.4,
                fill: true
            }
        ]
    });

    setLoading(false);

})

            .catch(err => {

                console.log(err);

                setLoading(false);

            });

    }, []);

    return (

        <Card className="shadow-sm border-0">

            <Card.Body>

                <h5 className="mb-3">

                    Doanh thu 7 ngày gần đây

                </h5>

                {

                    loading ?

                        <div className="text-center py-5">

                            <Spinner />

                        </div>

                        :

                        <Line

                            data={chartData}

                            options={{

                                responsive: true,

                                plugins: {

                                    legend: {

                                        display: true

                                    }

                                }

                            }}

                        />

                }

            </Card.Body>

        </Card>

    );

}