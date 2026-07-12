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

    useEffect(()=>{

        axios
        .get(
            `http://localhost:5000/api/books/${bookId}/chapter/${chapterNumber}`
        )
        .then((res)=>{

            setChapter(res.data);

        });

    },[bookId,chapterNumber]);

    return(

        <Container className="py-5">

            <Card className="shadow">

                <Card.Body>

                    <h2 className="text-center">

                        {chapter.book_title}

                    </h2>

                   

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

                            <Button variant="success">

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