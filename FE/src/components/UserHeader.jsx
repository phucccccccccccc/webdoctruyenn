import { Navbar, Nav, Container, Button, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
export default function UserHeader() {
    
const navigate = useNavigate();

const [search, setSearch] = useState("");

const user = JSON.parse(localStorage.getItem("user"));  



const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

};
const handleSearch = (e) => {

    e.preventDefault();

    if (search.trim() === "") {

        navigate("/books");

        return;

    }

    navigate(`/books?search=${encodeURIComponent(search)}`);

};
const handleKeyDown = (e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        handleSearch(e);

    }

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
                        Nạp Tiền
                    </Nav.Link>

                </Nav>
                

                <Nav className="align-items-center">

    <Form className="d-flex me-3">

        <Form.Control
            type="text"
            placeholder="Tìm sách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
                width: "220px",
                
            }}
        />

        <Button
            variant="success"
            onClick={handleSearch}
        >
            <FaSearch />
        </Button>

    </Form>


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
