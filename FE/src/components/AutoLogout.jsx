import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AutoLogout() {

    const navigate = useNavigate();

    useEffect(() => {

        const updateActivity = () => {
            localStorage.setItem("lastActivity", Date.now());
        };

        updateActivity();

        window.addEventListener("click", updateActivity);
        window.addEventListener("keydown", updateActivity);
        window.addEventListener("mousemove", updateActivity);
        window.addEventListener("scroll", updateActivity);

        const timer = setInterval(() => {

            const last = Number(localStorage.getItem("lastActivity"));

            if (!last) return;

            const now = Date.now();

            // 3 giờ
            if (now - last > 3 * 60 * 60 * 1000) {

                localStorage.clear();
                sessionStorage.clear();

                alert("Phiên đăng nhập đã hết hạn.");

                navigate("/login");

            }

        }, 60000);

        return () => {

            clearInterval(timer);

            window.removeEventListener("click", updateActivity);
            window.removeEventListener("keydown", updateActivity);
            window.removeEventListener("mousemove", updateActivity);
            window.removeEventListener("scroll", updateActivity);

        };

    }, [navigate]);

    return null;
}