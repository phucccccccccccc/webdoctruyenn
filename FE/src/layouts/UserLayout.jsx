import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";

export default function UserLayout() {

    const location = useLocation();

    const isReader = location.pathname.includes("/chapter/");

    return (
        <div className="d-flex flex-column min-vh-100">

            {!isReader && <UserHeader />}

            <main
                className={
                    isReader
                        ? "flex-grow-1 p-0 m-0"
                        : "container-fluid px-4 mt-4 flex-grow-1"
                }
            >
                <Outlet />
            </main>

            {!isReader && <Footer />}

        </div>
    );
}