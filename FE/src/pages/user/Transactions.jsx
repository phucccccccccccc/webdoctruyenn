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

                    <Table bordered hover responsive>

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

                                transactions.length > 0 ? (

                                    transactions.map((item, index) => (

                                        <tr key={`${item.type}-${item.id}-${index}`}>

                                            <td>{index + 1}</td>

                                            <td>{item.description}</td>

                                            <td>

                                                {

                                                    item.type === "topup"

                                                        ?

                                                        <span className="text-success fw-bold">
                                                            +{item.amount}
                                                        </span>

                                                        :

                                                        <span className="text-danger fw-bold">
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

                                ) : (

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="text-center text-muted"
                                        >
                                            Chưa có giao dịch nào.
                                        </td>

                                    </tr>

                                )

                            }

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

        </Container>

    );

}