import { Outlet } from "react-router-dom";
import UserHeader from "../components/UserHeader";

export default function UserLayout() {

    return (

        <>

            <UserHeader />

            <div className="container mt-4">

                <Outlet />

            </div>

        </>

    );

}