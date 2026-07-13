import { useEffect, useState } from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";

import {
    Container,
    Card,
    Button
} from "react-bootstrap";

export default function Reader(){

    const { bookId, chapterNumber } = useParams();

    const [chapter,setChapter]=useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const loadChapter = () => {

    axios
        .get(
            `http://localhost:5000/api/books/${bookId}/chapter/${chapterNumber}`
        )
        .then((res) => {

            setChapter(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

};
const saveHistory = () => {

    axios.post(
        "http://localhost:5000/api/user/history",
        {
            user_id: user.id,
            book_id: bookId,
            chapter_number: chapterNumber,
            last_position: 0
        }
    )
    .catch((err) => {

        console.log(err);

    });

};
   useEffect(() => {

    loadChapter();

    saveHistory();

}, [bookId, chapterNumber]);

    return(

        <Container className="py-5">

            <Card className="shadow">

                <Card.Body>

                    <h2 className="text-center">
    {chapter.title}
</h2>

<h5 className="text-center text-muted">
    Chương {chapter.chapter_number}
</h5>

                   

                    <hr/>

                 <Card.Body>

    <div
        className="reader-content"
        dangerouslySetInnerHTML={{
            __html: chapter.content
        }}
    />

</Card.Body>

                        


                    <hr/>

                    <div className="d-flex justify-content-between">

                        <Link
                            to={`/books/${bookId}/chapter/${Number(chapterNumber)-1}`}
                        >

                           <Button
    as={Link}
    to={`/books/${bookId}/chapter/${Number(chapterNumber)-1}`}
    variant="success"
    disabled={Number(chapterNumber) === 1}
>
    ← Chương trước
</Button>

                        </Link>

                        <Link
                            to={`/books/${bookId}/chapter/${Number(chapterNumber)+1}`}
                        >

                            <Button variant="success">

                                Chương sau →

                            </Button>

                        </Link>

                    </div>

                </Card.Body>

            </Card>

        </Container>

    );

}