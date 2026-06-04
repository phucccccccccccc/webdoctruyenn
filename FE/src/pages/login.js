import { useState } from "react"; 
import { axios } from "axios;"

function Login() {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");

    const [usernameErr,setUsernameErr] = useState("");
    const [emailErr,setEmailErr] = useState("");
    const [passwordErr,setPasswordErr] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault(); // ngăn render lại từ đầu mất dữ liệu 

        try{
            const res =await axios.post( 
                "http://localhost:5000/login",
                {
                    username,
                    password,
                }
            );
            console.log(res.data);
            setError("");
            alert("Đăng nhập thành công");

        }catch(error){
            console.log(error);

            setError("")

        }

    }
}