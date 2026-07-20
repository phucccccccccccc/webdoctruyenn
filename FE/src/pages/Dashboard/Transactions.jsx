import { useEffect,useState } from "react";
import {
    Form,
    Table,
    Button,
    Row,
    Col,
    Card,
} from "react-bootstrap";
import api from "../../api/api";
export default function Transactions(){
    const [transactions,setTransactions]=useState([]);

    const [search, setSearch] = useState("");

   useEffect(() => {

    api.get("/transactions")
        .then((res) => {

            console.log(res.data);

            setTransactions(res.data);

        })
        .catch(console.log);

}, []);
const removeVietnameseTones = (str) => {

    return (str || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();

};
const filteredTransactions = transactions.filter((item) => {

    const keyword = removeVietnameseTones(search)
        .trim()
        .split(/\s+/);

    const username = removeVietnameseTones(item.username);

    const description = removeVietnameseTones(item.description);
    return keyword.every(word =>

    username.includes(word) ||

    description.includes(word)

);

});
    return(
    <Card className="shadow">
        <Card.Body>
            <Row className="mb-4">
               <Col> <h3> Quản Lý Giao Dịch</h3> </Col>   
            </Row>
            <Row className="mb-3">
                <Col className='mb-4'>
                    <Form.Control
                        placeholder="Tìm theo người dùng hoặc tên sách..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col>
                <Button variant="primary">Tìm kiếm</Button>
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
    {filteredTransactions.map((item) => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.username}</td>
            <td>
                {item.type === "earn" ? "Nạp coin" : "Mua sách"}
            </td>
            <td>{item.amount}</td>
            <td>{item.description}</td>
            <td>
                {new Date(item.created_at).toLocaleString("vi-VN")}
            </td>
        </tr>
    ))}
</tbody>
</Table>
            

           
        </Card.Body>


    </Card>
    );



}