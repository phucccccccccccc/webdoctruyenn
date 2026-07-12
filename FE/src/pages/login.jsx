import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [error, setError] = useState("");

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

            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    username,
                    password
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            alert("Đăng nhập thành công");

            if (res.data.user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {

            console.log(err);

            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Không thể kết nối đến máy chủ.");
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

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordErr("");
                                        }}
                                    />

                                    {
                                        passwordErr &&
                                        <small className="text-danger">
                                            {passwordErr}
                                        </small>
                                    }

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Đăng nhập
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}