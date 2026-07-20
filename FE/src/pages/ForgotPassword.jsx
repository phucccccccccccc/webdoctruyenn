import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { Button, Card, Form, Spinner } from "react-bootstrap";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await api.post(
                "/auth/send-forgot-otp",
                { email }
            );

            toast.success(res.data.message);

            navigate("/reset-password", {
                state: { email }
            });

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Không thể gửi OTP"
            );

        } finally {

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

                                Quên mật khẩu

                            </h3>

                            <Form onSubmit={handleSendOTP}>

                                <Form.Group>

                                    <Form.Label>

                                        Email

                                    </Form.Label>

                                    <Form.Control

                                        type="email"

                                        value={email}

                                        onChange={(e)=>setEmail(e.target.value)}

                                        required

                                    />

                                </Form.Group>

                                <Button

                                    className="w-100 mt-4"

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

                                            Đang gửi...

                                        </>

                                        :

                                        "Gửi OTP"

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