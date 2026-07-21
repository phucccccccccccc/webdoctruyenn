import { Outlet } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";

export default function UserLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <UserHeader />

            <main className="container mt-4 flex-grow-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}