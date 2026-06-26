import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Register from "./pages/register"; 
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/user/Home";

import DashBoard from "./pages/Dashboard/Dashboard";
import Overview from "./pages/Dashboard/Overview";

createRoot(document.getElementById('root')).render(

    <StrictMode>

        <BrowserRouter>

            <Routes>

                {/* USER */}

                <Route
                    path="/"
                    element={<UserLayout />}
                >
                    <Route
                        index
                        element={<Home />}
                    />
                </Route>

                {/* ADMIN */}
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={<DashBoard />}
                >
                    <Route
                        index
                        element={<Overview />}
                    />
                </Route>

            </Routes>

        </BrowserRouter>

    </StrictMode>

);