import React from "react";
import Navbar from "../components/navbar";
import PasswardInput from "../components/passwordInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utilts/axiosInstance";
import validator from "validator";
const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  async function handleLogin(e) {
    e.preventDefault();

    // Validation
    if (!validator.isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");

    try {
      const res = await axiosInstance.post("/login", { email, password });

      if (res.data && !res.data.error) {
        // ✅ only navigate on success
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.errors?.email ||
          err.response?.data?.errors?.password ||
          "Login failed",
      );
    }
  }
  return (
    <div>
      <Navbar />
      <div className="flex mt-28  items-center justify-center">
        <form
          className="w-96 rounded-2xl px-7 py-10 border"
          action=""
          onSubmit={handleLogin}
        >
          <h4 className="text-2xl mb-6">Login</h4>

          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="Email"
            className="input-box"
          />
          <PasswardInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button className="btn-primary">Login</button>
          <p className="text-sm text-center mt-4">
            Not registered yet{" "}
            <Link to="/signup" className="text-primary font-medium underline">
              Create an Acount
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
