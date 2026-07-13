import { useState } from "react";
import  axios  from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username,setUsername] =useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    const [usernameErr,setUsernameErr] =useState("");
    const [emailErr,setEmailErr] = useState("");
    const [passwordErr,setPasswordErr] = useState("");
    const navigate = useNavigate();

    const handleRegister =async (e) =>{
        e.preventDefault();

        //reset lỗi cũ
        setUsernameErr("");
        setEmailErr("");
        setPasswordErr(""); 

        try{
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    username,
                    email,
                    password,
                }
            );
            console.log(res.data);

alert("Đăng ký thành công!");

navigate("/login");

        }catch(error){

    const errors = error.response.data.errors;

    errors.forEach((err) => {

        if(err.field === "username"){
            setUsernameErr(err.message);
        }

        if(err.field === "email"){
            setEmailErr(err.message);
        }

        if(err.field === "password"){
            setPasswordErr(err.message);
        }
    });

    }
    }
   return (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <form
      noValidate
      onSubmit={handleRegister}
      className="border rounded p-4"
      style={{ width: "400px" }}
    >
      <h1 className="mb-4">Đăng Ký Tài Khoảng</h1>

      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          <b>Username:</b>
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {usernameErr && (
          <p className="text-danger m-0">
            {usernameErr}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <b>Email:</b>
        </label>

        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailErr && (
          <p className="text-danger m-0">
            {emailErr}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          <b>Password:</b>
        </label>

        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {passwordErr && (
          <p className="text-danger m-0">
            {passwordErr}
          </p>
        )}
      </div>

      <button className="btn btn-primary w-100">
        Đăng ký ngay
      </button>
    </form>
  </div>
);
}

export default Register;