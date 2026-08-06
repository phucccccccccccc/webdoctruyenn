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
import api from "../../api/api";

export default function User(){
    const [users,setUsers]=useState([]);
    const [search, setSearch] = useState("");

    useEffect(() =>{
        api.get("/user").then((res)=>{
            setUsers(res.data);
        }).catch((err) =>{
            console.log(err);
        });


    },[]);
    const loadUsers = () => {

    api.get("/user")
        .then((res) => {

            setUsers(res.data);

        })
        .catch(console.log);

};
const handleToggleStatus = async (id, status) => {

    
    try {

        await api.put(`/user/block/${id}`);

        loadUsers();

    } catch (err) {

        console.log(err);

        alert(err.response?.data?.message || "Có lỗi xảy ra");

    }

};
const removeVietnameseTones = (str) => {

    return (str || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();

};
const filteredUsers = users.filter((user) => {

    const keyword = removeVietnameseTones(search)
        .trim()
        .split(/\s+/);

    const username = removeVietnameseTones(user.username);

    const email = removeVietnameseTones(user.email);

    const role = removeVietnameseTones(user.role);

    return keyword.every(word =>

        username.includes(word) ||

        email.includes(word) ||

        role.includes(word)

    );

});

useEffect(() => {

    loadUsers();

}, []);
    return (
        <Card className="shadow">
            <Card.Body>
                <Row className="mb-4" >
                    <Col>
                   <h3> Quản Lý Tài Khoảng</h3>
                    </Col>

                </Row>

                <Row className="mb-3">
                <Col className='mb-4'>
                    
                        <Form.Control
                        placeholder="Tìm username hoặc email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

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
                        <th>Trạng thái</th>
<th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>

{
    filteredUsers.map((user) => (

        <tr key={user.id}>

            <td>{user.id}</td>

            <td>{user.username}</td>

            <td>{user.email}</td>

            <td>{user.role}</td>

            <td>
                {new Date(user.created_at).toLocaleDateString("vi-VN")}
            </td>

            <td>

                {
                    user.status === "blocked" ? (

                        <span className="badge bg-danger">
                            Đã khóa
                        </span>

                    ) : (

                        <span className="badge bg-success">
                            Hoạt động
                        </span>

                    )
                }

            </td>

            <td>

               <Button
    size="sm"
    variant={
        user.status === "blocked"
            ? "success"
            : "danger"
    }
    onClick={() =>
        handleToggleStatus(
            user.id,
            user.status
        )
    }
>
    {
        user.status === "blocked"
            ? "Mở khóa"
            : "Khóa"
    }
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
