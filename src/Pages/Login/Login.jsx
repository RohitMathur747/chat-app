import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");

  const handleToggle = () => {
    setCurrState(currState === "Sign Up" ? "Login" : "Sign Up");
  };

  return (
    <>
      <div className="login">
        <img src={assets.logo_big} alt="profile" className="profile" />
        <form className="login-form">
          <h2>{currState}</h2>

          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Username"
              className="form-input"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="form-input"
            required
          />
          <input
            type="password"
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
