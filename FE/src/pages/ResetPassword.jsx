import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

import {
    Card,
    Form,
    Button,
    Spinner,
    InputGroup
} from "react-bootstrap";

import {
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import { toast } from "react-toastify";

export default function ResetPassword() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const email = state?.email;

    useEffect(() => {

        if (!email) {

            navigate("/forgot-password");

        }

    }, []);

    const [otp, setOtp] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [countdown, setCountdown] = useState(300);

    useEffect(() => {

        if (countdown <= 0) return;

        const timer = setInterval(() => {

            setCountdown(prev => prev - 1);

        },1000);

        return ()=>clearInterval(timer);

    },[countdown]);

    const handleResendOTP = async()=>{

        try{

            const res = await api.post(

                "/auth/send-forgot-otp",

                {
                    email
                }

            );

            toast.success(res.data.message);

            setCountdown(300);

        }catch(err){

            toast.error(

                err.response?.data?.message ||

                "Không thể gửi OTP"

            );

        }

    };

    const handleResetPassword = async(e)=>{

        e.preventDefault();

        try{

            setLoading(true);

            await api.post(

                "/auth/verify-forgot-otp",

                {
                    email,
                    otp
                }

            );

            const res = await api.post(

                "/auth/reset-password",

                {
                    email,
                    password,
                    confirmPassword
                }

            );

            toast.success(res.data.message);

            setTimeout(()=>{

                navigate("/login");

            },1000);

        }catch(err){

            toast.error(

                err.response?.data?.message ||

                "Đổi mật khẩu thất bại"

            );

        }finally{

            setLoading(false);

        }

    };
        return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <Card className="shadow">

                        <Card.Body>

                            <h3 className="text-center mb-4">

                                Đặt lại mật khẩu

                            </h3>

                            <p className="text-center text-muted">

                                Email:
                                <br />
                                <b>{email}</b>

                            </p>

                            <Form onSubmit={handleResetPassword}>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Mã OTP

                                    </Form.Label>

                                    <Form.Control

                                        value={otp}

                                        onChange={(e)=>setOtp(e.target.value)}

                                        required

                                    />

                                </Form.Group>

                                <div className="text-center mb-3">

                                    <small className="text-muted">

                                        OTP còn hiệu lực

                                    </small>

                                    <h5 className="text-danger fw-bold">

                                        {String(Math.floor(countdown / 60)).padStart(2,"0")}

                                        :

                                        {String(countdown % 60).padStart(2,"0")}

                                    </h5>

                                </div>

                                <Button

                                    variant="warning"

                                    className="w-100 mb-3"

                                    disabled={countdown > 0}

                                    onClick={handleResendOTP}

                                >

                                    {

                                        countdown > 0

                                        ?

                                        `Gửi lại sau ${countdown}s`

                                        :

                                        "Gửi lại OTP"

                                    }

                                </Button>

                                <Form.Group className="mb-3">

                                    <Form.Label>

                                        Mật khẩu mới

                                    </Form.Label>

                                    <InputGroup>

                                        <Form.Control

                                            type={

                                                showPassword

                                                ?

                                                "text"

                                                :

                                                "password"

                                            }

                                            value={password}

                                            onChange={(e)=>setPassword(e.target.value)}

                                            required

                                        />

                                        <Button

                                            variant="outline-secondary"

                                            onClick={()=>setShowPassword(!showPassword)}

                                        >

                                            {

                                                showPassword

                                                ?

                                                <FaEyeSlash/>

                                                :

                                                <FaEye/>

                                            }

                                        </Button>

                                    </InputGroup>

                                </Form.Group>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Nhập lại mật khẩu

                                    </Form.Label>

                                    <InputGroup>

                                        <Form.Control

                                            type={

                                                showConfirmPassword

                                                ?

                                                "text"

                                                :

                                                "password"

                                            }

                                            value={confirmPassword}

                                            onChange={(e)=>setConfirmPassword(e.target.value)}

                                            required

                                        />

                                        <Button

                                            variant="outline-secondary"

                                            onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

                                        >

                                            {

                                                showConfirmPassword

                                                ?

                                                <FaEyeSlash/>

                                                :

                                                <FaEye/>

                                            }

                                        </Button>

                                    </InputGroup>

                                </Form.Group>

                                <Button

                                    type="submit"

                                    className="w-100"

                                    disabled={loading}

                                >

                                    {

                                        loading

                                        ?

                                        <>

                                            <Spinner

                                                animation="border"

                                                size="sm"

                                                className="me-2"

                                            />

                                            Đang đổi mật khẩu...

                                        </>

                                        :

                                        "Đổi mật khẩu"

                                    }

                                </Button>

                            </Form>

                        </Card.Body>

                    </Card>

                </div>

            </div>

        </div>

    );

}