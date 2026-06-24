import { Navbar, Container, Image } from "react-bootstrap";

export default function Header() {

    return (

        <Navbar bg="white" className="shadow-sm">
            <Container fluid className="justify-content-end">
                <span className="me-3">
                    Admin
                </span>

                <Image
                    src=""
                    roundedCircle
                />
            </Container>
        </Navbar>

    );

}