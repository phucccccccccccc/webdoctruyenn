import { useEffect, useMemo, useState } from "react";
import {
    Form,
    Table,
    Button,
    Row,
    Col,
    Card,
    Spinner,
    Badge
} from "react-bootstrap";
import api from "../../api/api";
import TransactionChart from "../../components/admin/TransactionChart";

export default function Transactions() {

    const [transactions, setTransactions] = useState([]);

    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalRecharge: 0,
        totalPurchase: 0,
        totalCoinRecharge: 0,
        totalRevenue: 0
    });

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {

        Promise.all([
            api.get("/transactions/admin"),
            api.get("/transactions/statistics")
        ])
            .then(([transactionRes, statRes]) => {

                setTransactions(transactionRes.data);
                setStats(statRes.data);

            })
            .catch(console.log)
            .finally(() => setLoading(false));

    }, []);

    const removeVietnameseTones = (str) => {

        return (str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();

    };

    const filteredTransactions = useMemo(() => {

        return [...transactions]
            .filter((item) => {

                if (typeFilter && item.type !== typeFilter)
                    return false;

                const keyword = removeVietnameseTones(search)
                    .trim()
                    .split(/\s+/);

                const username = removeVietnameseTones(item.username);

                const description = removeVietnameseTones(item.description);

                return keyword.every(word =>
                    username.includes(word) ||
                    description.includes(word)
                );

            })
            .sort((a, b) => b.id - a.id);

    }, [transactions, search, typeFilter]);

    if (loading) {

        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );

    }

    return (

        <Card className="shadow border-0">

            <Card.Body>

                <Row className="mb-4">

                    <Col>

                        <h3>Quản Lý Giao Dịch</h3>

                    </Col>

                </Row>

                <Row className="mb-4">

                    <Col lg={3} md={6} className="mb-3">

                        <Card className="shadow-sm border-0">

                            <Card.Body>

                                <h6>Tổng giao dịch</h6>

                                <h3>{stats.totalTransactions}</h3>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col lg={3} md={6} className="mb-3">

                        <Card className="shadow-sm border-0">

                            <Card.Body>

                                <h6>Lượt nạp coin</h6>

                                <h3>{stats.totalRecharge}</h3>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col lg={3} md={6} className="mb-3">

                        <Card className="shadow-sm border-0">

                            <Card.Body>

                                <h6>Coin đã nạp</h6>

                                <h3>
                                    {Number(stats.totalCoinRecharge).toLocaleString("vi-VN")}
                                </h3>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col lg={3} md={6} className="mb-3">

                        <Card className="shadow-sm border-0">

                            <Card.Body>

                                <h6>Doanh thu</h6>

                                <h3>
                                    {Number(stats.totalRevenue).toLocaleString("vi-VN")}
                                </h3>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

                <TransactionChart />

                <Row className="mb-3">

                    <Col md={6} className="mb-2">

                        <Form.Control
                            placeholder="Tìm theo người dùng hoặc mô tả..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </Col>

                    <Col md={3} className="mb-2">

                        <Form.Select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            <option value="earn">Nạp coin</option>
                            <option value="spend">Mua sách</option>
                        </Form.Select>

                    </Col>

                    <Col md={3}>

                        <Button className="w-100">
                            Tìm kiếm
                        </Button>

                    </Col>

                </Row>

                <Table bordered hover responsive>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Người dùng</th>

                            <th>Loại</th>

                            <th>Số coin</th>

                            <th>Mô tả</th>

                            <th>Ngày giao dịch</th>

                        </tr>

                    </thead>

                    <tbody>
                                                {
                            filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((item) => (
                                    <tr key={item.id}>

                                        <td>{item.id}</td>

                                        <td>{item.username}</td>

                                        <td>
                                            {
                                                item.type === "earn" ? (
                                                    <Badge bg="success">
                                                        Nạp coin
                                                    </Badge>
                                                ) : (
                                                    <Badge bg="danger">
                                                        Mua sách
                                                    </Badge>
                                                )
                                            }
                                        </td>

                                        <td>
                                            {Number(item.amount).toLocaleString("vi-VN")}
                                        </td>

                                        <td>{item.description}</td>

                                        <td>
                                            {new Date(item.created_at).toLocaleString("vi-VN")}
                                        </td>

                                    </tr>
                                ))
                            )
                        }

                    </tbody>

                </Table>

            </Card.Body>

        </Card>

    );

}