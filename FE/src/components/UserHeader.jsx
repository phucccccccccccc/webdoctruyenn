import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

export default function UserHeader() {

    const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));

const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

};
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

                    <Nav.Link as={Link} to="/books">
                        Tất cả sách
                    </Nav.Link>

                    <Nav.Link as={Link} to="/membership">
                        Sách đã mua 
                    </Nav.Link>

                    <Nav.Link as={Link} to="/reading-history">
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


                    {
    user ? (
        <>
            <span className="text-white me-3">
    Xin chào, <b>
        {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
    </b>
</span>
            <Button
                variant="outline-danger"
                className="rounded-pill"
                onClick={handleLogout}
            >
                Đăng xuất
            </Button>
        </>
    ) : (
        <>
            <Button
                as={Link}
                to="/register"
                variant="outline-light"
                className="me-2 rounded-pill"
            >
                Đăng ký
            </Button>

            <Button
                as={Link}
                to="/login"
                variant="success"
                className="rounded-pill"
            >
                Đăng nhập
            </Button>
        </>
    )
}

                </Nav>

            </Navbar.Collapse>

        </Container>

    </Navbar>

);

}
