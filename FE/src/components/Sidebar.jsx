import {
    Nav,
    Button
} from "react-bootstrap";

import {
    NavLink,
    useNavigate,
    Link
} from "react-router-dom";

import {
    FaChartPie,
    FaBook,
    FaList,
    FaUsers,
    FaCoins,
    FaSignOutAlt
} from "react-icons/fa";

export default function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div
            className="bg-dark text-white d-flex flex-column shadow"
            style={{
                width: "260px",
                minHeight: "100vh"
            }}
        >

            <div className="text-center py-4 border-bottom">

                <h2
                    className="fw-bold"
                >
                    <Link
                        to="/"
                        className="text-success text-decoration-none"
                    >
                         BOOK
                    </Link>
                </h2>

                <small className="text-secondary">
                    Admin Dashboard
                </small>

            </div>

            <Nav
                className="flex-column p-3 gap-2 flex-grow-1"
            >

                <Nav.Link
                    as={NavLink}
                    to="/dashboard"
                    end
                    className="sidebar-link"
                >
                    <FaChartPie className="me-2" />
                    Tổng quan
                </Nav.Link>

                <Nav.Link
                    as={NavLink}
                    to="/dashboard/books"
                    className="sidebar-link"
                >
                    <FaBook className="me-2" />
                    Quản lý sách
                </Nav.Link>

                <Nav.Link
                    as={NavLink}
                    to="/dashboard/categories"
                    className="sidebar-link"
                >
                    <FaList className="me-2" />
                    Danh mục
                </Nav.Link>

                <Nav.Link
                    as={NavLink}
                    to="/dashboard/users"
                    className="sidebar-link"
                >
                    <FaUsers className="me-2" />
                    Người dùng
                </Nav.Link>

                <Nav.Link
                    as={NavLink}
                    to="/dashboard/transactions"
                    className="sidebar-link"
                >
                    <FaCoins className="me-2" />
                    Giao dịch Coin
                </Nav.Link>

            </Nav>

            <div className="p-3 border-top">

                <Button
                    variant="danger"
                    className="w-100"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="me-2" />
                    Đăng xuất
                </Button>

            </div>

        </div>

    );

}