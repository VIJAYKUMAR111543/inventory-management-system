import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email.trim() || !password.trim()) {

            toast.error("Please enter email and password.");
            return;

        }

        try {

            setLoading(true);

            await login(email, password);

            toast.success("Login Successful");

            navigate("/");

        } catch (err) {

            console.log(err);

            toast.error("Invalid email or password");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Inventra</h1>


                <p>Please login to continue</p>

                <form onSubmit={handleLogin}>

                    <div className="input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div className="input-group">

                        <label>Password</label>

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>

                    <div className="show-password">

                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />

                        <span>Show Password</span>

                    </div>

                    <button
                        className="login-btn"
                        disabled={loading}
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;