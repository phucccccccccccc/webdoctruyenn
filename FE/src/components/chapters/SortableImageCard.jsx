import { Card, Image, Button } from "react-bootstrap";
import { FaGripVertical, FaTimes, FaSearchPlus } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableImageCard({
    image,
    index,
    onDelete
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: image.id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="shadow-sm">
                <div
                    style={{
                        position: "relative"
                    }}
                >
                    <Image
                        src={image.image_url}
                        style={{
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                            cursor: "pointer"
                        }}
                    />

                    <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(image.id);
                        }}
                        style={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            padding: 0
                        }}
                    >
                        <FaTimes />
                    </Button>

                    <Button
                        size="sm"
                        variant="dark"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        style={{
                            position: "absolute",
                            left: 8,
                            top: 8,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            padding: 0
                        }}
                    >
                        <FaSearchPlus />
                    </Button>
                </div>

                <Card.Body className="d-flex justify-content-between align-items-center">
                    <span>Trang {index + 1}</span>

                    <span
                        {...attributes}
                        {...listeners}
                        style={{
                            cursor: "grab",
                            fontSize: 22
                        }}
                    >
                        <FaGripVertical />
                    </span>
                </Card.Body>
            </Card>
        </div>
    );
}