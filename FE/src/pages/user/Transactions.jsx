import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Container,
    Card,
    Table,
    Badge
} from "react-bootstrap";

export default function Transactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        api.get("/transactions")
            .then((res) => {

                setTransactions(res.data);

            })
            .catch(console.log);

    }, []);

    return (

        <Container className="py-5">

            <Card className="shadow">

                <Card.Body>

                    <h3 className="mb-4">
                        Lịch sử giao dịch
                    </h3>

                    <Table bordered hover>

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Mô tả</th>

                                <th>Coin</th>

                                <th>Loại</th>

                                <th>Thời gian</th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                transactions.map((item, index) => (

                                    <tr key={item.id}>

                                        <td>{index + 1}</td>

                                        <td>{item.description}</td>

                                        <td>

                                            {
                                                item.type === "topup"

                                                    ?

                                                    <span className="text-success">
                                                        +{item.amount}
                                                    </span>

                                                    :

                                                    <span className="text-danger">
                                                        -{item.amount}
                                                    </span>

                                            }

                                        </td>

                                        <td>

                                            <Badge
                                                bg={
                                                    item.type === "topup"
                                                        ? "success"
                                                        : "danger"
                                                }
                                            >
                                                {
                                                    item.type === "topup"
                                                        ? "Nạp coin"
                                                        : "Mua sách"
                                                }
                                            </Badge>

                                        </td>

                                        <td>
                                            {new Date(item.created_at).toLocaleString("vi-VN")}
                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

        </Container>

    );

}