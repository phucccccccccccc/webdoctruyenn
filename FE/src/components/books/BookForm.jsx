import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Offcanvas,
    Form,
    Button,
    Image
} from "react-bootstrap";

export default function BookForm({

    show,
    onHide,
    categories,
    loadBooks,
    editingBook

}) {

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [coinPrice, setCoinPrice] = useState("");
    const [status, setStatus] = useState("ongoing");
    const [coverImage, setCoverImage] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");

    useEffect(() => {

        if (!editingBook) {

            resetForm(setLoading(false));

            return;

        }

        setTitle(editingBook.title);
        setAuthor(editingBook.author);
        setDescription(editingBook.description);
        setCoinPrice(editingBook.coin_price);
        setStatus(editingBook.status);

        setSelectedCategories(
            editingBook.category_ids || []
        );

        setPreview(
            `http://localhost:5000/uploads/${editingBook.cover_image}`
        );

    }, [editingBook]);

    const resetForm = () => {

        setTitle("");
        setAuthor("");
        setDescription("");
        setCoinPrice("");
        setStatus("ongoing");
        setCoverImage(null);
        setSelectedCategories([]);
        setPreview("");

    };

    const handleClose = () => {

        resetForm();

        onHide();

    };

    const handleSubmit = async (e) => {
        if (!title.trim())
            return alert("Nhập tên truyện");

        if (!author.trim())
            return alert("Nhập tác giả");

        if (!editingBook && !coverImage)
            return alert("Chọn ảnh bìa");
        e.preventDefault();

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("title", title);
            formData.append("author", author);
            formData.append("description", description);
            formData.append("coin_price", coinPrice);
            formData.append("status", status);

            if (coverImage) {

                formData.append(
                    "cover_image",
                    coverImage
                );

            }

            formData.append(
                "categories",
                JSON.stringify(selectedCategories)
            );

            if (editingBook) {
                 formData.append(
                            "old_cover_image",
                            editingBook.cover_image
                        );
                await api.put(
                    `/books/${editingBook.id}`,
                    formData
                );

                alert("Cập nhật thành công");

            } else {

                await api.post(
                    "/books",
                    formData
                );

                alert("Thêm truyện thành công");

            }

            handleClose();

            loadBooks();

        } catch (err) {

    console.log(err);

    console.log(err.response);

    console.log(err.response?.data);

    alert(JSON.stringify(err.response?.data));

} finally {

            setLoading(false);

        }

    };

    return (

        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            scroll
            backdrop="static"
        >

            <Offcanvas.Header closeButton>

                <Offcanvas.Title>

                    {
                        editingBook
                            ? "Sửa Truyện"
                            : "Thêm Truyện"
                    }

                </Offcanvas.Title>

            </Offcanvas.Header>

            <Offcanvas.Body>

                <Form onSubmit={handleSubmit}>

                    {/* Ảnh */}
                    <Form.Group className="mb-3">

                        <Form.Label>Ảnh bìa</Form.Label>

                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {

                                const file = e.target.files[0];

                            if (!file) return;

                            setCoverImage(file);

                            setPreview(URL.createObjectURL(file));

                            }}
                        />

                    </Form.Group>

                    {
                        preview &&

                        <Image
                            src={preview}
                            thumbnail
                            className="mb-3"
                            style={{
                                width: 180,
                                height: 240,
                                objectFit: "cover"
                            }}
                        />

                    }

                    {/* Tên */}
                    <Form.Group className="mb-3">

                        <Form.Label>Tên truyện</Form.Label>

                        <Form.Control
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                    </Form.Group>

                    {/* Tác giả */}
                    <Form.Group className="mb-3">

                        <Form.Label>Tác giả</Form.Label>

                        <Form.Control
                            value={author}
                            onChange={(e) =>
                                setAuthor(e.target.value)
                            }
                        />

                    </Form.Group>

                    {/* Mô tả */}
                    <Form.Group className="mb-3">

                        <Form.Label>Mô tả</Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </Form.Group>

                    {/* Coin */}
                    <Form.Group className="mb-3">

                        <Form.Label>Coin</Form.Label>

                        <Form.Control
                            type="number"
                            value={coinPrice}
                            onChange={(e) =>
                                setCoinPrice(e.target.value)
                            }
                        />

                    </Form.Group>

                    {/* Trạng thái */}
                    <Form.Group className="mb-3">

                        <Form.Label>Trạng thái</Form.Label>

                        <Form.Select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >

                            <option value="ongoing">
                                Đang cập nhật
                            </option>

                            <option value="completed">
                                Hoàn thành
                            </option>

                        </Form.Select>

                    </Form.Group>

                    {/* Danh mục */}
                    <Form.Group className="mb-3">

                        <Form.Label>Danh mục</Form.Label>

                        {
                            categories.map((item) => (

                                <Form.Check
                                    key={item.id}
                                    type="checkbox"
                                    label={item.name}
                                    checked={selectedCategories.includes(item.id)}
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            setSelectedCategories(prev => [

                                                ...prev,

                                                item.id

                                            ]);

                                        } else {

                                            setSelectedCategories(prev =>

                                                prev.filter(id => id !== item.id)

                                            );

                                        }

                                    }}
                                />

                            ))
                        }

                    </Form.Group>

                    <div className="d-grid">

                        <Button
                            type="submit"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Đang lưu..."
                                    : editingBook
                                    ? "Cập nhật"
                                    : "Lưu truyện"
                            }

                        </Button>

                    </div>

                </Form>

            </Offcanvas.Body>

        </Offcanvas>

    );

}