import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { authAPI } from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleToggle = () => {
    setCurrState(currState === "Sign Up" ? "Login" : "Sign Up");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currState === "Sign Up") {
        const response = await authAPI.signup({ username, email, password });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        toast.success("Account created! Complete profile.");
        navigate("/profile");
      } else {
        const response = await authAPI.login({ email, password });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        toast.success("Login successful!");
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <>
      <div className="login">
        <img src={assets.logo_big} alt="profile" className="profile" />
        <form className="login-form" onSubmit={onSubmitHandler}>
          <h2>{currState}</h2>

          <div className={currState === "Login" ? "login-hidden" : ""}>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Username"
              className="form-input"
              required={currState === "Sign Up"}
            />
          </div>

          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email Address"
            className="form-input"
            required
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="form-input"
            required
          />
          <button type="submit">{currState}</button>

          {currState === "Sign Up" && (
            <div className="login-term">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                Agree to the terms of use & privacy policy
              </label>
            </div>
          )}

          <div className="login-forgot">
            <p className="login-toggle">
              {currState === "Sign Up" ? (
                <>
                  Already have an account?{" "}
                  <span onClick={handleToggle}>Login Here</span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span onClick={handleToggle}>Sign Up Here</span>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
