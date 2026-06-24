import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";


createRoot(document.getElementById('root')).render(

    <StrictMode>

        <BrowserRouter>

            <Dashboard />

        </BrowserRouter>

    </StrictMode>

)