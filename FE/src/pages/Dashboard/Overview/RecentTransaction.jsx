import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Card, Table } from "react-bootstrap";

export default function RecentTransaction() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        api.get("/dashboard/recent-transactions")

            .then((res) => {

                setTransactions(res.data);

            })

            .catch((err) => {

                console.log(err);

            });

    }, []);

    return (

        <Card className="shadow-sm border-0">

            <Card.Body>

                <h5 className="mb-3">

                    Giao dịch gần đây

                </h5>

                <Table hover responsive>

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Người dùng</th>

                            <th>Sách</th>

                            <th>Coin</th>

                            <th>Thời gian</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            transactions.map((item, index) => (

                                <tr key={item.id}>

                                    <td>{index + 1}</td>

                                    <td>{item.username}</td>

                                    <td>{item.title}</td>

                                    <td>{item.amount}</td>

                                    <td>

                                        {new Date(item.created_at).toLocaleString()}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

}