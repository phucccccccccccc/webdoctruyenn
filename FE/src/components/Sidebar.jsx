import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Sidebar() {

    return (

        <div
            className="bg-dark text-white p-3"
            style={{
                width: "250px"
            }}
        >

            <h3 className="mb-4">
                Admin
            </h3>

            <Nav className="flex-column">

                <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className="text-white"
                >
                    Tổng quan
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/dashboard/books"
                    className="text-white"
                >
                    Quản lý sách
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/dashboard/categories"
                    className="text-white"
                >
                    Danh mục
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/dashboard/users"
                    className="text-white"
                >
                    Người dùng
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/dashboard/transactions"
                    className="text-white"
                >
                    Giao dịch coin
                </Nav.Link>

            </Nav>

        </div>

    );

}