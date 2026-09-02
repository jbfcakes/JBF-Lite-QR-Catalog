"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GREEN = "#5E8F34";
const GREY = "#6B7280";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleLogin = () => {
  if (user === "admin" && pass === "1234") {
    document.cookie =
      "jbf_admin=logged_in; path=/; max-age=86400";

    router.push("/admin/dashboard");
  } else {
    alert("Invalid Username or Password");
  }
};

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8F8F6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        fontFamily: "JBF, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 24,
          padding: 30,
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src="/logo.jpeg"
            alt="JBF"
            width={80}
            height={80}
            style={{ borderRadius: "50%" }}
          />

          <h1
            style={{
              color: GREEN,
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            JBF Admin
          </h1>

          <p style={{ color: GREY, margin: 0 }}>
            Login to manage your catalog
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <label style={{ color: GREY, fontSize: 14 }}>Username</label>

          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter username"
            style={{
              width: "100%",
              marginTop: 8,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              outline: "none",
              fontSize: 15,
            }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ color: GREY, fontSize: 14 }}>Password</label>

          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              marginTop: 8,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              outline: "none",
              fontSize: 15,
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: 26,
            padding: 14,
            border: "none",
            borderRadius: 14,
            background: GREEN,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: 12,
            marginTop: 18,
          }}
        >
          JBF Cakes • Admin Panel
        </p>
      </div>
    </main>
  );
}