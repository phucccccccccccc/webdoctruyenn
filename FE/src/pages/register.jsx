import { useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

import {
    Modal,
    Button,
    Form,
    Spinner
} from "react-bootstrap";

import {
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

function Register() {

    const navigate = useNavigate();

    // ==========================
    // Form
    // ==========================
    const [verifyLoading, setVerifyLoading] = useState(false);
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countdown, setCountdown] = useState(300);
    // ==========================
    // OTP
    // ==========================

    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState("");

    // ==========================
    // Loading
    // ==========================

    const [loading, setLoading] = useState(false);

    // ==========================
    // Show password
    // ==========================

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ==========================
    // Error
    // ==========================

    const [usernameErr, setUsernameErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
    const [otpErr, setOtpErr] = useState("");

    // ==========================
    // Gửi OTP
    // ==========================

    const handleResendOTP = async () => {

    try {

        const res = await api.post(
            "/auth/send-register-otp",
            {
                username,
                email,
                password,
                confirmPassword
            }
        );

        toast.success(res.data.message);

        setCountdown(300);

        setOtp("");

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Không thể gửi lại OTP"
        );

    }

};
    const handleRegister = async (e) => {

        e.preventDefault();

        setUsernameErr("");
        setEmailErr("");
        setPasswordErr("");
        setConfirmPasswordErr("");
        setOtpErr("");

        try {

            setLoading(true);

            const res = await api.post(
                "/auth/send-register-otp",
                {
                    username,
                    email,
                    password,
                    confirmPassword
                }
            );

            toast.success(res.data.message);

            setShowOTPModal(true);
            setCountdown(300);

        } catch (error) {

            if (error.response?.data?.errors) {

                error.response.data.errors.forEach((err) => {

                    if (err.field === "username")
                        setUsernameErr(err.message);

                    if (err.field === "email")
                        setEmailErr(err.message);

                    if (err.field === "password")
                        setPasswordErr(err.message);

                    if (err.field === "confirmPassword")
                        setConfirmPasswordErr(err.message);

                });

            } else {

                toast.error(error.response?.data?.message);

            }

        } finally {

            setLoading(false);

        }

    };

    // ==========================
    // Verify OTP
    // ==========================

    const handleVerifyOTP = async () => {

    try {

        setVerifyLoading(true);

        const res = await api.post(
            "/auth/verify-register-otp",
            {
                email,
                otp
            }
        );

        toast.success(res.data.message);

        setShowOTPModal(false);

        setOtp("");

        setOtpErr("");

        setTimeout(() => {

            navigate("/login");

        }, 1000);

    } catch (err) {

        const message =
            err.response?.data?.message ||
            "OTP không đúng";

        setOtpErr(message);

        toast.error(message);

    } finally {

        setVerifyLoading(false);

    }

};
    useEffect(() => {

    if (!showOTPModal) return;

    if (countdown <= 0) return;

    const timer = setInterval(() => {

        setCountdown((prev) => prev - 1);
        

    }, 1000);

    return () => clearInterval(timer);

}, [showOTPModal, countdown]);

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow-lg border-0">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">

                                Đăng ký tài khoản

                            </h2>

                            <form onSubmit={handleRegister}>

                                <div className="mb-3">

                                    <label className="form-label">

                                        Username

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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

                                        Email

                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    {
                                        emailErr &&
                                        <small className="text-danger">
                                            {emailErr}
                                        </small>
                                    }

                                </div>
                                                                <div className="mb-3">

                                    <label className="form-label">

                                        Mật khẩu

                                    </label>

                                    <div className="input-group">

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
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

                                <div className="mb-4">

                                    <label className="form-label">

                                        Nhập lại mật khẩu

                                    </label>

                                    <div className="input-group">

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {
                                                showConfirmPassword
                                                    ? <FaEyeSlash />
                                                    : <FaEye />
                                            }
                                        </button>

                                    </div>

                                    {
                                        confirmPasswordErr &&
                                        <small className="text-danger">
                                            {confirmPasswordErr}
                                        </small>
                                    }

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >

                                    {
                                        loading
                                            ? <>
                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                Đang gửi OTP...
                                            </>
                                            : "Đăng ký"
                                    }

                                </button>

                                <div className="text-center mt-4">

                                    Đã có tài khoản?

                                    <span
                                        className="text-primary ms-2"
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() =>
                                            navigate("/login")
                                        }
                                    >
                                        Đăng nhập
                                    </span>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

            <Modal
                show={showOTPModal}
                backdrop="static"
                centered
            >

                <Modal.Header>

                    <Modal.Title>

                        Xác thực Email

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <p>

                        Mã OTP đã được gửi tới

                        <br />

                        <b>{email}</b>

                    </p>

                    <Form.Control
                        type="text"
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChange={(e) => {

                            setOtp(e.target.value);

                            setOtpErr("");

                        }}
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                e.preventDefault();

                                handleVerifyOTP();

                            }

                        }}
                    />
                    <div className="text-center mt-3">

                        <div className="text-center mt-3">

                            <small className="text-muted">

                            Mã OTP sẽ hết hạn sau

                            </small>

                            <h4 className="text-danger fw-bold">

                            {String(Math.floor(countdown / 60)).padStart(2, "0")}

                            :

                            {String(countdown % 60).padStart(2, "0")}

                            </h4>

                            </div>

                       

                    </div>

                    {
                        otpErr &&
                        <div className="text-danger mt-2">

                            {otpErr}

                        </div>
                    }

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => {

                            setShowOTPModal(false);

                            setOtp("");

                            setOtpErr("");

                        }}
                    >
                        Hủy
                    </Button>

                    <Button
                            variant="primary"
                            onClick={handleVerifyOTP}
                            disabled={verifyLoading}
                        >

                        {
                        verifyLoading
                        ?

                        <>

                        <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                        />

                        Đang xác nhận...

                        </>

                        :

                        "Xác nhận"

                        }

                        </Button>
                    <Button
                            variant="warning"
                            disabled={countdown>0}
                            onClick={handleResendOTP}
                            >

                            {

                            countdown>0

                            ?

                            `Gửi lại sau ${countdown}s`

                            :

                            "Gửi lại OTP"

                            }

                            </Button>

                </Modal.Footer>

            </Modal>

        </div>

    );

}

export default Register;