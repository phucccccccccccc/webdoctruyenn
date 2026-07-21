import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import {
    Table,
    Button,
    Row,
    Col,
    Form,
    Card
} from "react-bootstrap";

export default function Categories() {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    // =====================
    // Load Categories
    // =====================

    const loadCategories = async () => {

        try {

            const res = await api.get("/category");

            setCategories(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadCategories();

    }, []);

    // =====================
    // Thêm / Cập nhật
    // =====================

    const handleSave = async () => {

        if (!name.trim()) {

            alert("Vui lòng nhập tên thể loại");

            return;

        }

        try {

            if (editingId) {

                await api.put(

                    `/category/${editingId}`,

                    {
                        name,
                        description
                    }

                );

                alert("Cập nhật thành công");

            } else {

                await api.post(

                    "/category",

                    {
                        name,
                        description
                    }

                );

                alert("Thêm thành công");

            }

            setShowForm(false);

            setEditingId(null);

            setName("");

            setDescription("");

            loadCategories();
        } catch (err) {

            console.log(err);

        }

    };

    // =====================
    // Sửa
    // =====================

   const handleEdit = (cate) => {

    setEditingId(cate.id);

    setName(cate.name);

    setDescription(cate.description);

    setShowForm(true);

};

    // =====================
    // Xóa
    // =====================

 const handleDelete = async (id) => {

    if (!window.confirm("Bạn muốn xóa thể loại này?"))
        return;

    try {

        const res = await api.delete(`/category/${id}`);

        toast.success(res.data.message);

        loadCategories();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Xóa thất bại"
        );

    }

};

    // =====================
    // Tìm kiếm
    // =====================

const removeVietnameseTones = (str) => {

    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();

};

const filteredCategories = categories.filter((cate) => {

    const keyword = removeVietnameseTones(search)
        .trim()
        .split(/\s+/);

    const name = removeVietnameseTones(cate.name);

    const description = removeVietnameseTones(cate.description || "");

    return keyword.every(word =>

        name.includes(word) ||

        description.includes(word)

    );

});

    return (

        <Card className="shadow">

            <Card.Body>

                <Row className="mb-4">

                    <Col>

                        <h3>Quản Lý Thể Loại</h3>

                    </Col>

                </Row>
                 <Col className="text-end">

        <Button
            variant="primary"
            onClick={() => {

                setEditingId(null);

                setName("");

                setDescription("");

                setShowForm(true);

            }}
        >
            + Thêm thể loại
        </Button>
        <Row className="mb-3">

                        <Col md={4}>

                            <Form.Control
                                placeholder="Tìm thể loại truyện..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </Col>


                    </Row>

    </Col>

                {
    showForm && (

        <Card className="mb-4 border-primary">

            <Card.Body>

                <Row>

                    <Col md={4}>

                        <Form.Label>

                            Tên thể loại

                        </Form.Label>

                        <Form.Control
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />

                    </Col>

                    <Col md={6}>

                        <Form.Label>

                            Mô tả

                        </Form.Label>

                        <Form.Control
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                        />

                    </Col>

                    <Col
                        md={2}
                        className="d-flex align-items-end"
                    >

                        <Button
                            className="me-2"
                            onClick={handleSave}
                        >

                            {

                                editingId

                                ?

                                "Cập nhật"

                                :

                                "Thêm"

                            }

                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {

                                setShowForm(false);

                                setEditingId(null);

                                setName("");

                                setDescription("");

                            }}
                        >

                            Hủy

                        </Button>

                    </Col>

                </Row>

            </Card.Body>

        </Card>

    )
}

                <Table
                    bordered
                    hover
                    responsive
                >

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Tên thể loại</th>

                            <th>Mô tả</th>

                            <th width="180">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                                                {

                            filteredCategories.length > 0 ?

                            filteredCategories.map((cate) => (

                                <tr key={cate.id}>

                                    <td>{cate.id}</td>

                                    <td>{cate.name}</td>

                                    <td>{cate.description}</td>

                                    <td>

                                        <Button

                                            size="sm"

                                            variant="warning"

                                            className="me-2"

                                            onClick={() => handleEdit(cate)}

                                        >

                                            Sửa

                                        </Button>

                                        <Button

                                            size="sm"

                                            variant="danger"

                                            onClick={() => handleDelete(cate.id)}

                                        >

                                            Xóa

                                        </Button>

                                    </td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td

                                    colSpan={4}

                                    className="text-center text-muted py-4"

                                >

                                    Không tìm thấy thể loại

                                </td>

                            </tr>

                        }

                    </tbody>

                </Table>

                {

                    editingId &&

                    <div className="text-end">

                        <Button

                            variant="secondary"

                            onClick={() => {

                                setEditingId(null);

                                setName("");

                                setDescription("");

                            }}

                        >

                            Hủy chỉnh sửa

                        </Button>

                    </div>

                }

            </Card.Body>

        </Card>

    );

}