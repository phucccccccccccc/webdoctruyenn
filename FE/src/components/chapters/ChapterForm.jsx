import { useEffect, useState } from "react";
import api from "../../api/api";

import {
    Offcanvas,
    Form,
    Button,
    Row,
    Col,
    Image,
    Card
} from "react-bootstrap";

export default function ChapterForm({

    show,
    onHide,
    loadData,
    editingChapter,
    bookId

}) {

    const [chapterNumber, setChapterNumber] = useState("");

    const [title, setTitle] = useState("");

    const [images, setImages] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const [oldImages, setOldImages] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!editingChapter) {

            resetForm();

            return;

        }

        setChapterNumber(
            editingChapter.chapter.chapter_number
        );

        setTitle(
            editingChapter.chapter.title
        );

        setOldImages(
            editingChapter.images
        );

        setPreviewImages([]);

        setImages([]);

    }, [editingChapter]);

    const resetForm = () => {

        setChapterNumber("");

        setTitle("");

        setImages([]);

        setPreviewImages([]);

        setOldImages([]);

        setLoading(false);

    };

    const handleClose = () => {

        resetForm();

        onHide();

    };

    const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    if (files.length === 0)
        return;

    setImages(files);

    setPreviewImages(

        files.map(file =>

            URL.createObjectURL(file)

        )

    );

};
    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!chapterNumber) {

        return alert("Nhập số chương");

    }

    if (!title.trim()) {

        return alert("Nhập tiêu đề");

    }

    if (!editingChapter && images.length === 0) {

        return alert("Chọn ít nhất 1 ảnh");

    }

    setLoading(true);

    try {

        const formData = new FormData();

        formData.append("book_id", bookId);

        formData.append(
            "chapter_number",
            chapterNumber
        );

        formData.append(
            "title",
            title
        );

        images.forEach((image) => {

            formData.append(
                "images",
                image
            );

        });

        if (editingChapter) {

            await api.put(

                `/chapters/${editingChapter.chapter.id}`,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            alert("Cập nhật chương thành công");

        } else {

            await api.post(

                "/chapters",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            alert("Thêm chương thành công");

        }

        loadData();

        handleClose();

    } catch (err) {

        console.log(err);

        alert(

            err.response?.data?.message ||

            "Có lỗi xảy ra"

        );

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
                    editingChapter
                        ? "Sửa chương"
                        : "Thêm chương"
                }

            </Offcanvas.Title>

        </Offcanvas.Header>

        <Offcanvas.Body>

            <Form onSubmit={handleSubmit}>

                <Row>

                    <Col md={4}>

                        <Form.Group className="mb-3">

                            <Form.Label>

                                Số chương

                            </Form.Label>

                            <Form.Control
                                type="number"
                                value={chapterNumber}
                                onChange={(e) =>
                                    setChapterNumber(
                                        e.target.value
                                    )
                                }
                            />
                            

                        </Form.Group>

                    </Col>

                    <Col md={8}>

                        <Form.Group className="mb-3">

                            <Form.Label>

                                Tiêu đề

                            </Form.Label>

                            <Form.Control
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                            />

                        </Form.Group>

                    </Col>

                </Row>

                <Form.Group className="mb-3">

                    <Form.Label>

                        Upload ảnh

                    </Form.Label>

                    <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <Form.Text>

                        Có thể chọn cùng lúc tối đa 200 ảnh.

                    </Form.Text>
                    <Form.Text className="text-success">

Đã chọn {images.length} ảnh

</Form.Text>

                </Form.Group>

                {
                    oldImages.length > 0 &&
                    previewImages.length === 0 &&

                    <>

                        <h6 className="mb-3">

                            Ảnh hiện tại

                        </h6>

                        <Row>

                            {

                                oldImages.map((img) => (

                                    <Col
                                        md={3}
                                        key={img.id}
                                        className="mb-3"
                                    >

                                        <Card className="shadow-sm h-100">

                                            <Image
                                                src={`http://localhost:5000/uploads/${img.image_url}`}
                                                fluid
                                                rounded
                                                style={{
                                                    height: 220,
                                                    width: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />

                                            <Card.Body
                                                className="text-center"
                                            >

                                                Trang {img.page_number}

                                            </Card.Body>

                                        </Card>

                                    </Col>

                                ))

                            }

                        </Row>

                    </>

                }

                {
                    previewImages.length > 0 &&

                    <>

                        <h6 className="mb-3">

                            Ảnh mới ({previewImages.length})

                        </h6>

                        <Row>

                            {

                                previewImages.map((image, index) => (

                                    <Col
                                        md={3}
                                        key={index}
                                        className="mb-3"
                                    >

                                        <Card>

                                            <Image
                                                src={image}
                                                height={220}
                                                style={{
                                                    objectFit: "cover"
                                                }}
                                            />

                                            <Card.Body
                                                className="text-center"
                                            >

                                                Trang {index + 1}

                                            </Card.Body>

                                        </Card>

                                    </Col>

                                ))

                            }

                        </Row>

                    </>

                }

                <div className="d-grid mt-4">

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="success"
                    >

                        {

                            loading
                                ? "Đang lưu..."
                                : editingChapter
                                ? "Cập nhật chương"
                                : "Thêm chương"

                        }

                    </Button>

                </div>
                <Button
variant="outline-danger"
size="sm"
onClick={()=>{

setImages([]);

setPreviewImages([]);
setOldImages([]);

}}
>

Xóa tất cả ảnh

</Button>

            </Form>

        </Offcanvas.Body>

    </Offcanvas>

);
}