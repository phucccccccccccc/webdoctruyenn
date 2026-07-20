import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

  const saveLogin = (token, user) => {

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

};

    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const res = await api.post("/auth/google", {
                credential: credentialResponse.credential
            });

            saveLogin(res.data.token, res.data.user);
            localStorage.setItem("lastActivity", Date.now());
            alert("Đăng nhập thành công");

            if (res.data.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {

            console.log(err);

            setError("Đăng nhập Google thất bại");

        }

    };

    const handleGoogleError = () => {

        setError("Đăng nhập Google thất bại");

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        setUsernameErr("");
        setPasswordErr("");
        setError("");

        let check = true;

        if (username.trim() === "") {
            setUsernameErr("Vui lòng nhập tên đăng nhập");
            check = false;
        }

        if (password.trim() === "") {
            setPasswordErr("Vui lòng nhập mật khẩu");
            check = false;
        }

        if (!check) return;

        try {

            const res = await api.post("/auth/login", {
                username,
                password
            });

            saveLogin(res.data.token, res.data.user);

            alert("Đăng nhập thành công");

            if (res.data.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {

            console.log(err);

            if (err.response?.data?.errors) {

                err.response.data.errors.forEach((item) => {

                    if (item.field === "username") {
                        setUsernameErr(item.message);
                    }

                    if (item.field === "password") {
                        setPasswordErr(item.message);
                    }

                });

            } else {

                setError(
                    err.response?.data?.message ||
                    "Không thể kết nối đến máy chủ."
                );

            }

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h3 className="text-center mb-4">
                                Đăng nhập
                            </h3>

                            {
                                error &&
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            }

                            <form onSubmit={handleLogin}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Tên đăng nhập
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setUsernameErr("");
                                        }}
                                    />

                                    {
                                        usernameErr &&
                                        <small className="text-danger">
                                            {usernameErr}
                                        </small>
                                    }

                                </div>

                               <div className="mb-3">

                                    <label className="form-label">
                                        Mật khẩu
                                    </label>

                                    <div className="input-group">

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setPasswordErr("");
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {
                                                showPassword
                                                    ? <FaEyeSlash />
                                                    : <FaEye />
                                            }
                                        </button>

                                    </div>

                                    {
                                        passwordErr &&
                                        <small className="text-danger">
                                            {passwordErr}
                                        </small>
                                    }

                                </div>

                                <div className="form-check mb-3">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="remember"
                                        checked={remember}
                                        onChange={(e) =>
                                            setRemember(e.target.checked)
                                        }
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="remember"
                                    >
                                        Ghi nhớ đăng nhập
                                    </label>

                                </div>

                                <div className="text-end mb-3">

                                    <span
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            navigate("/forgot-password")
                                        }
                                    >
                                        Quên mật khẩu?
                                    </span>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Đăng nhập
                                </button>

                                <div className="text-center my-3">
                                    <hr />
                                    <span>Hoặc</span>
                                </div>

                                <div className="d-flex justify-content-center">

                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                    />

                                </div>

                                <div className="text-center mt-4">

                                    Chưa có tài khoản?{" "}

                                    <span
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate("/register")}
                                    >
                                        Đăng ký ngay
                                    </span>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}