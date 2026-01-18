// pages/Register.jsx
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    const res = await axios.post("/auth/register", form);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 p-6 border rounded">
        <h2 className="text-xl mb-4">Register</h2>
        <input
          className="input"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input mt-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="input mt-2"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={submit} className="btn mt-4 w-full">
          Register
        </button>
      </div>
    </div>
  );
}
