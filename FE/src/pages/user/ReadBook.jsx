import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    useParams,
    useNavigate
} from "react-router-dom";

import ReaderHeader from "../../components/ReaderHeader";

import {
    Container,
    Card,
    Button,
    Modal
} from "react-bootstrap";

export default function Reader() {

    const { bookId, chapterNumber } = useParams();

    const navigate = useNavigate();

    const [showBuyModal, setShowBuyModal] = useState(false);

    const [needTopup, setNeedTopup] = useState(false);
    const [notPurchased, setNotPurchased] = useState(false);

    const [coinPrice, setCoinPrice] = useState(0);

    const [chapter, setChapter] = useState(null);
    const [images, setImages] = useState([]);
    const [chapters, setChapters] = useState([]);

    const loadChapter = async () => {

    try {

        const [chapterRes, chaptersRes] = await Promise.all([

            api.get(`/books/${bookId}/chapter/${chapterNumber}`),

            api.get(`/books/${bookId}/chapters`)

        ]);

        setChapter(chapterRes.data.chapter);

        setImages(chapterRes.data.images);

        setChapters(chaptersRes.data);

        setNotPurchased(false);

    } catch (err) {

        console.log(err);

        if (
            err.response?.status === 403 &&
            err.response?.data?.code === "BOOK_NOT_PURCHASED"
        ) {

            setNotPurchased(true);

            setCoinPrice(err.response.data.coin_price);

            setShowBuyModal(true);

            return;

        }

        alert(
            err.response?.data?.message ||
            "Có lỗi xảy ra"
        );

    }

};
const handleBuy = async () => {

    try {

        await api.post("/books/buy", {

            book_id: Number(bookId)

        });

        setShowBuyModal(false);

        setNeedTopup(false);

        setNotPurchased(false);

        loadChapter();

    }
    catch (err) {

       if (err.response?.data?.code === "NOT_ENOUGH_COIN") {

            setNeedTopup(true);

            return;

        }

        alert(err.response?.data?.message);

    }

};

    const saveHistory = () => {

        api.post(
            "/user/history",
            {
                book_id: Number(bookId),
                chapter_number: Number(chapterNumber),
                last_position: 0
            }
        ).catch((err) => {

            console.log(err);

        });

    };

    useEffect(() => {

    window.scrollTo(0, 0);

    loadChapter();
    saveHistory();

}, [bookId, chapterNumber]);

useEffect(() => {

    if (images.length) {
        window.scrollTo(0, 0);
    }

}, [images]);

    const handlePrev = () => {

        if (Number(chapterNumber) <= 1)
            return;

        navigate(
            `/books/${bookId}/chapter/${Number(chapterNumber) - 1}`
        );

    };

    const handleNext = () => {

        navigate(
            `/books/${bookId}/chapter/${Number(chapterNumber) + 1}`
        );

    };

    const handleChangeChapter = (number) => {

        navigate(
            `/books/${bookId}/chapter/${number}`
        );

    };


if (!chapter&&!notPurchased) {

    return (

        <Container className="py-5">

            <h3 className="text-center">
                Đang tải...
            </h3>

        </Container>

    );

}

    return (

        <>

            <ReaderHeader
                book={{
                    id: bookId,
                    title: chapter.book_title
                }}
                chapter={chapter}

                chapters={chapters}

                onPrev={handlePrev}

                onNext={handleNext}

                onChangeChapter={handleChangeChapter}

            />

            <Container
                fluid
                style={{
                    paddingTop: 70,
                    background: "#111",
                    minHeight: "100vh"
                }}
            >

                <Card
                    className="mx-auto shadow"
                    style={{
                        maxWidth: 900
                    }}
                >

                    <Card.Body className="p-0">

                        <div className="py-3">

                            <h2 className="text-center">

                                {chapter.book_title}

                            </h2>

                            <h4 className="text-center">

                                {chapter.title}

                            </h4>

                            <div className="text-center text-muted">

                                Chapter {chapter.chapter_number}

                            </div>

                        </div>

                        {

                            images.map((img) => (

                                <img
                                    key={img.page_number}
                                    src={`http://localhost:5000/uploads/${img.image_url}`}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        display: "block"
                                    }}
                                />

                            ))

                        }

                    </Card.Body>

                </Card>

            </Container>

        </>

    );

}