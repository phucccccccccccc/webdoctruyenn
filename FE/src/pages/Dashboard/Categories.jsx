import { useEffect,useState } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Row,
    Col,
    Form,
    Image,
    Card
} from "react-bootstrap";
export default function Categories() {
    const [Categories,setCategories] =useState([]);
    useEffect(()=> {
        axios.get("http://localhost:5000/api/category").then((res)=> {setCategories(res.data);
    })
    .catch((err) => {
            console.log(err);
        });
    }, []);
    return (
        <Card className="shadow">
            <Card.Body>
                <Row className="mb-4">

                    <Col>
                        <h3>Quản Lý Thể Loại Sách</h3>
                    </Col>

                    <Col className="text-end">
                        <Button variant="primary">
                        +Thêm thể loại
                        </Button>
                    </Col>

                </Row>
                <Row className="mb-3">

                    <Col className="mb-4">
                    <Form.Control placeholder="Tìm tên Category..."/>
                    </Col>

                    <Col>
                    <Button>
                        Tìm kiếm
                    </Button>
                    </Col>


                </Row> 
                <Table bordered hover responsive >
                    <thead>
                        <tr>

                        <th>ID</th>
                        <th>Tên Thể Loại</th>
                        <th>Miêu tả</th>
                        <th>Thao Tác</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            Categories.map((cate) => (
                                <tr key={cate.id}>
                                    <td>{cate.id}</td>
                                    <td>{cate.name}</td>
                                    <td>{cate.description}</td>
                                    <td>
                                        <Button size="sm"
                                                variant="warning"
                                                className="me-2"
                                        >
                                            Sửa
                                        </Button>
                                        <Button size="sm"
                                                variant="danger"
                                                className="me-2"
                                        >
                                            Xoá
                                        </Button>
                                        <Button size="sm"
                                                variant="success"
                                                className="me-2">
                                                    Chương

                                        </Button>
                                    </td>
                                </tr>

                            )
                            )

                            
                        }
                    </tbody>

                </Table>


            </Card.Body>

        </Card>

    );
}