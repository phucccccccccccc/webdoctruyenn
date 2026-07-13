import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Register from "./pages/register"; 
import Login from "./pages/login";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/user/Home";
import Books from "./pages/user/Books";
import BookDetail from "./pages/user/BookDetail";
import Reader from "./pages/user/ReadBook";
// import BookDetail from "./pages/user/BookDetail";

import DashBoard from "./pages/Dashboard/Dashboard";
import Overview from "./pages/Dashboard/Overview";
import BooksDB from "./pages/Dashboard/Books";
import CategoriesDB from "./pages/Dashboard/Categories";
import UserDB from "./pages/Dashboard/Users";
import TransactionDB from "./pages/Dashboard/Transactions";
import Membership from "./pages/user/Membership";
import ReadingHistory from "./pages/user/ReadingHistory";
createRoot(document.getElementById('root')).render(

    <StrictMode>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">

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
                    <Route
                        path="books"
                        element={<Books/>}
                    />
                    
                     <Route 
                    path="books/:id"
                    element={<BookDetail />}
                    /> 
                    <Route
path="books/:bookId/chapter/:chapterNumber"
element={
    <ProtectedRoute>

        <Reader/>

    </ProtectedRoute>
    
}
/>
<Route
    path="membership"
    element={
        <ProtectedRoute>
            <Membership />
        </ProtectedRoute>
    }
/>
<Route
    path="reading-history"
    element={
        <ProtectedRoute>
            <ReadingHistory />
        </ProtectedRoute>
    }
/>
                    
                </Route>

                {/* ADMIN */}
                <Route
    path="/login"
    element={<Login />}
/>

<Route
    path="/register"
    element={<Register />}
/>

                <Route
path="/dashboard"
element={
    <AdminRoute>

        <DashBoard/>

    </AdminRoute>
}
>
                    <Route
                        index
                        element={<Overview />}
                    />
                    <Route
                        path="books"
                        element={<BooksDB />}
                    />
                       <Route
                        path="categories"
                        element={<CategoriesDB />}
                    />
                       <Route
                        path="users"
                        element={<UserDB />}
                    />
                    <Route
                        path="transactions"
                        element={<TransactionDB />}
                    />
                    
                </Route>

            </Routes>

        </BrowserRouter>
        </GoogleOAuthProvider>

    </StrictMode>

);