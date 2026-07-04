import { useEffect,useState } from "react";
import {
    Form,
    Table,
    Button,
    Row,
    Col,
    Card,
} from "react-bootstrap";
import axios from "axios";
export default function Transactions(){
    const [transactions,setTransactions]=useState([]);
    useEffect(() =>{
        axios.get("http://localhost:5000/api/transactions").then((res)=>{
            setTransactions(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);
    return(
    <Card className="shadow">
        <Card.Body>
            <Row className="mb-4">
               <Col> <h3> Quản Lý Giao Dịch</h3> </Col>   
            </Row>
            <Row className="mb-3">
                <Col className='mb-4'>
                <Form.Control placeholder="Tìm Giao Dịch..."></Form.Control>

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
            <th>Sách</th>
            <th>Số coin</th>
            <th>Ngày giao dịch</th>
        </tr>
    </thead>
    <tbody>
        {transactions.map((item) => (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.username}</td>
                <td>{item.book_title}</td>
                <td>{item.coin}</td>
                <td>{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
            </tr>
        ))}
    </tbody>
</Table>
            

           
        </Card.Body>


    </Card>
    );



}