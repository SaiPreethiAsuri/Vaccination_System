import React, { useEffect } from "react";
import login from "../assets/bg_login.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import { loginActions } from "../apiActions/loginActions";
import "./login.scss";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sessionExpired, setSessionExpired] = useState(false);
    const isTokenExpired = new URLSearchParams(location.search).get('expired') === 'true';
    useEffect(() => {
        if (isTokenExpired) {
            setSessionExpired(true);
        }
    }, [isTokenExpired]);
    const [adminUser, setAdminUser] = useState({ username: "", password: "" });
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(adminUser);
        loginActions(adminUser).then((res) => {
            console.log(res.status);
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard')
            }
            else {
                alert("Invalid credentials");
            }
        }
        ).catch((err) => {
            console.log(err);
            alert("Invalid credentials");
        })


    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminUser({ ...adminUser, [name]: value });


    }
    return (
        <div>
        {sessionExpired && (
            <div className="session-expired-message">
                Session expired, please login again.
            </div>
        )}
        <div className="login_container">
           
            <div className="login_image_container">
                <img
                    src={login}
                    alt="My Image"
                    width={800}
                    height={500}
                    className="login_image"
                />
            </div>
            <div className="custom-form-container">
                <h1>Login</h1>
                <form>
                    <label>
                        Username:
                        <input type="text" name="username" className="login-field" onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" name="password" className="login-field" onChange={handleChange} />
                    </label>
                    <Button label={"Submit"} onClick={handleSubmit} type="submit" className="login_button" />
                </form>
            </div>

        </div>
        </div>
    );
}
export default Login;
