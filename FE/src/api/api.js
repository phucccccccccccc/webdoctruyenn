import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
});

// Tự động gắn JWT
api.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

// Thêm đoạn này
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.data?.code === "ACCOUNT_BLOCKED") {

            alert("Tài khoản của bạn đã bị khóa.");

            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";

        }

        return Promise.reject(error);

    }

);

export default api;