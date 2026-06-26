import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function UserHeader() {

return (

    <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="py-3 shadow-sm"
    >

        <Container>

            <Navbar.Brand
                as={Link}
                to="/"
                className="fw-bold fs-2 text-success"
            >
                BOOK
            </Navbar.Brand>

            <Navbar.Toggle />

            <Navbar.Collapse>

                <Nav className="me-auto ms-4">

                    <Nav.Link as={Link} to="/">
                        Trang chủ
                    </Nav.Link>

                    <Nav.Link as={Link} to="/api/books">
                        Tất cả sách
                    </Nav.Link>

                    <Nav.Link as={Link} to="/membership">
                        Sách đã mua 
                    </Nav.Link>

                    <Nav.Link as={Link} to="/audio-books">
                        Sách đã đọc 
                    </Nav.Link>

                    <Nav.Link as={Link} to="/categories">
                        Thể loại
                    </Nav.Link>

                </Nav>

                <Nav className="align-items-center">

                    <Nav.Link>
                        <FaSearch size={20} />
                    </Nav.Link>


                    <Button
                        variant="outline-light"
                        className="me-2 rounded-pill"
                         href="/register" 
                    >
                        Đăng ký
                    </Button>

                    <Button
                        variant="success"
                        className="rounded-pill"
                        href="/dashboard"
                    >
                        Đăng nhập
                    </Button>

                </Nav>

            </Navbar.Collapse>

        </Container>

    </Navbar>

);

}
