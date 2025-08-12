import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      alert("กรุณากรอกชื่อผู้ใช้ที่ถูกต้องอย่างน้อย 2 ตัวอักษร");
      return;
    }
    localStorage.setItem("username", username.trim());
    navigate("/app"); // หรือ path ที่ใช้แอปหลัก
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>เข้าสู่ระบบ</h2>
        <input
          type="text"
          placeholder="กรอกชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          spellCheck={false}
        />
        <button type="submit" disabled={username.trim() === ""}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}