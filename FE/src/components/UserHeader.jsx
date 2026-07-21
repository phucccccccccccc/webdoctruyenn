import {
    Navbar,
    Nav,
    Container,
    Button,
    Form,
    Dropdown,
    Image,
    NavDropdown 
} from "react-bootstrap";import { FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../api/api";
export default function UserHeader() {
    
const navigate = useNavigate();

const [search, setSearch] = useState("");

const [categories, setCategories] = useState([]);

const [coin, setCoin] = useState(0);

const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));


const handleLogout = () => {
localStorage.removeItem("user");
localStorage.removeItem("token");

sessionStorage.removeItem("user");
sessionStorage.removeItem("token");


window.location.reload();
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
useEffect(() => {

    if (!user) return;

    api.get("/user/profile")
        .then((res) => {

            setCoin(res.data.total_coin);

        })
        .catch(console.log);
        api.get("/category")
    .then((res) => {

        setCategories(res.data);

    })
    .catch(console.log);

}, [user]);


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
                     <NavDropdown
                        title="Thể loại"
                        id="category-dropdown"
                    >

                        <NavDropdown.Item
                            as={Link}
                            to="/books"
                        >
                            Tất cả sách
                        </NavDropdown.Item>

                        <NavDropdown.Divider />

                        {

                            categories.map((category) => (

                                <NavDropdown.Item
                                    key={category.id}
                                    as={Link}
                                    to={`/books/category/${category.id}`}
                                >
                                    {category.name}
                                </NavDropdown.Item>

                            ))

                        }

                    </NavDropdown>

                    <Nav.Link as={Link} to="/membership">
                        Sách đã mua 
                    </Nav.Link>

                    <Nav.Link as={Link} to="/reading-history">
                        Sách đã đọc 
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
            <span className="text-warning fw-bold me-4">
                💰 {coin} Coin
            </span>

            <Dropdown align="end">

                <Dropdown.Toggle
                    variant="dark"
                    className="border-0 d-flex align-items-center"
                >

                    <Image
                        src={
                            user.avatar
                                ? user.avatar
                                : "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(user.username)
                        }
                        roundedCircle
                        width={38}
                        height={38}
                        className="me-2"
                    />

                    <span
                        style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {user.username}
                    </span>

                </Dropdown.Toggle>

              <Dropdown.Menu>

    <Dropdown.Item
        as={Link}
        to="/profile"
    >
        Hồ sơ
    </Dropdown.Item>

    <Dropdown.Item
        as={Link}
        to="/wallet"
    >
        Ví của tôi
    </Dropdown.Item>
    <Dropdown.Item
        as={Link}
        to="/buy"
    >
        Nạp tiền
    </Dropdown.Item>

    <Dropdown.Item
        as={Link}
        to="/transactions"
    >
        Lịch sử giao dịch
    </Dropdown.Item>

    {
        user.role === "admin" && (

            <>

                <Dropdown.Divider />

                <Dropdown.Item
                    as={Link}
                    to="/dashboard"
                    className="text-primary fw-bold"
                >
                    🛠 Quản lý hệ thống
                </Dropdown.Item>

            </>

        )
    }

    <Dropdown.Divider />

    <Dropdown.Item
        className="text-danger"
        onClick={handleLogout}
    >
        Đăng xuất
    </Dropdown.Item>

</Dropdown.Menu>

            </Dropdown>
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
