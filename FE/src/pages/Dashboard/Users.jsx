import { useEffect,useState } from "react";
import {
    Table,
    Button,
    Row,
    Col,
    Form,
    Image,
    Card
} from "react-bootstrap";
import axios from "axios";

export default function User(){
    const [users,setUsers]=useState([]);

    useEffect(() =>{
        axios.get("http://localhost:5000/api/user").then((res)=>{
            setUsers(res.data);
        }).catch((err) =>{
            console.log(err);
        });


    },[]);
    return (
        <Card className="shadow">
            <Card.Body>
                <Row className="mb-4" >
                    <Col>
                   <h3> Quản Lý Tài Khoảng</h3>
                    </Col>

                    <Col className="text-end">
                    <Button variant="primary">
                    +Thêm Tài Khoảng
                    </Button>
                    </Col>

                </Row>

                <Row className="mb-3">
                    <Col className="md-4">
                        <Form.Control placeholder="Tìm Tài Khoảng..."/>
                    </Col>
                    <Col> 
                        <Button variant="primary">
                            Tìm Kiếm
                        </Button>

                    </Col>
                </Row>
                <Table hover bordered responsive>
                    <thead>
                        <tr>

                        <th>ID</th>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Thời Gian Tạo</th>
                        <th>Thao tác</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString("vi-VN")}</td>
                                     <td>

                                        <Button
                                            size="sm"
                                            variant="warning"
                                            className="me-2"
                                        >
                                            Sửa
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            className="me-2"
                                        >
                                            Xóa
                                        </Button>

                                       

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
