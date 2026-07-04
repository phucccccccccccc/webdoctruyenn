import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function Dashboard() {

    return (

        <div className="d-flex vh-100">

            <Sidebar />

            <div className="flex-grow-1">

                <Header />

                <div className="p-4 bg-light h-100">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}