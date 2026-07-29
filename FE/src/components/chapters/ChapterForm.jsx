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
import {
    DndContext,
    closestCenter
} from "@dnd-kit/core";

import {
    SortableContext,
    rectSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import SortableImageCard from "./SortableImageCard";

export default function ChapterForm({

    show,
    onHide,
    loadData,
    editingChapter,
    bookId

}) {

    const [gallery, setGallery] = useState([]);
    const [insertMode, setInsertMode] = useState(false);
    const [insertAfter, setInsertAfter] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");

    const [title, setTitle] = useState("");

    const [images, setImages] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const [oldImages, setOldImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const preview = (url) => {

    window.open(url);

};

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

        setOldImages(editingChapter.images);

        setGallery(
            editingChapter.images.map(img => ({
                ...img,
                isOld: true
            }))
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

    const newImages = files.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        image_url: URL.createObjectURL(file),
        file: file,
        isNew: true
    }));

    setGallery(prev => [
        ...prev,
        ...newImages
    ]);

};
const handleDragEnd = (event) => {

    const {

        active,
        over

    } = event;

    if (!over)
        return;

    if (active.id === over.id)
        return;

    const oldIndex = gallery.findIndex(

        x => x.id === active.id

    );

    const newIndex = gallery.findIndex(

        x => x.id === over.id

    );

    setGallery(

        arrayMove(

            gallery,

            oldIndex,

            newIndex

        )

    );

};
const deleteImage = (id) => {

    setGallery(

        gallery.filter(

            x => x.id !== id

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

    if (!editingChapter && gallery.length === 0) {

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
        formData.append(
    "image_order",
   JSON.stringify(
    gallery?.map((x) => ({
        id: x.id,
        isNew: x.isNew || false
    })) || []
)
);

        gallery
.filter(x=>x.isNew)
.forEach(x=>{

formData.append(

"images",

x.file

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
                            <Form.Check

label="Thêm vào cuối"

checked={!insertMode}

onChange={()=>

setInsertMode(false)

}

/>

<Form.Check

label="Chèn vào vị trí"

checked={insertMode}

onChange={()=>

setInsertMode(true)

}

/>

{
insertMode &&

<Form.Select

className="mt-2"

value={insertAfter}

onChange={(e)=>

setInsertAfter(e.target.value)

}

>

<option value="0">

Đầu chương

</option>

{
    gallery.map((img,index)=>(
        <Col md={3} key={img.id}>

            <Card>

                <Image
                    src={img.image_url}
                    height={220}
                    style={{
                        width:"100%",
                        objectFit:"cover"
                    }}
                />

                <Card.Body>
                    Trang {index + 1}
                </Card.Body>

            </Card>

        </Col>
    ))
}

</Form.Select>

}
                            

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

Đã chọn {gallery.length} ảnh

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

                                <PhotoProvider>

                                    <DndContext
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >

                                    <SortableContext
                                        items={gallery.map(x => x.id)}
                                        strategy={rectSortingStrategy}
                                    >

                                    <Row>

                                    {

                                    gallery.map((img,index)=>(

                                    <Col
                                    md={3}
                                    key={img.id}
                                    className="mb-3"
                                    >

                                    <PhotoView
                                    src={img.image_url}
                                    >

                                    <div>

                                    <SortableImageCard

                                    image={img}

                                    index={index}

                                    onDelete={deleteImage}

                                    onPreview={preview}

                                    />

                                    </div>

                                    </PhotoView>

                                    </Col>

                                    ))

                                    }

                                    </Row>

                                    </SortableContext>

                                    </DndContext>

                                    </PhotoProvider>

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
    onClick={() => {

        setGallery([]);

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