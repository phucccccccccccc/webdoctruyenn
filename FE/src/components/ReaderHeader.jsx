import { Container, Button, Form } from "react-bootstrap";
import {  Link } from "react-router-dom";

export default function ReaderHeader({

    book,

    chapter,

    chapters,

    onPrev,

    onNext,

    onChangeChapter

}) {

    return (

        <div
            className="bg-dark"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 55,
                zIndex: 9999,
                borderBottom: "1px solid #333"
            }}
        >

            <Container
                fluid
                className="d-flex justify-content-between align-items-center h-100"
            >

                        <Link
                            to={`/books/${book.id}`}
                            style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "bold",
                                fontSize: 18
                            }}
                        >
                            🏠 {book.title}
                        </Link>

                <div className="d-flex gap-2">

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onPrev}
                        disabled={chapter.chapter_number === 1}
                    >
                        ← Chương trước
                    </Button>

                    <Form.Select
                        size="sm"
                        style={{
                            width: 180
                        }}
                        value={chapter.chapter_number}
                        onChange={(e) =>
                            onChangeChapter(
                                Number(e.target.value)
                            )
                        }
                    >

                        {

                            chapters.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.chapter_number}
                                >

                                    Chapter {item.chapter_number}

                                </option>

                            ))

                        }

                    </Form.Select>

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={onNext}
                    >
                        Chương sau →
                    </Button>

                </div>

            </Container>

        </div>

    );

}