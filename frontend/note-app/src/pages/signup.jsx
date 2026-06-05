import React from "react";
import Navbar from "../components/navbar";
import PasswardInput from "../components/passwordInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import validator from "validator";
import axiosInstance from "../utilts/axiosInstance";
const Signup = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  async function handleSignup(e) {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validator.isEmail(email)) {
      setError("Please enter valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const res = await axiosInstance.post("/create-account", {
        fullName: name,
        email,
        password,
      });

      if (res.data && !res.data.error) {
        // ✅ only navigate on success
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.errors?.email ||
          err.response?.data?.errors?.password ||
          "Signup failed",
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
          onSubmit={handleSignup}
        >
          <h4 className="text-2xl mb-6">Signup</h4>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Name"
            className="input-box"
          />
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
          <button className="btn-primary">Create Account</button>
          <p className="text-sm text-center mt-4">
            Already have an account?
            <Link to="/login" className="text-primary font-medium underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
