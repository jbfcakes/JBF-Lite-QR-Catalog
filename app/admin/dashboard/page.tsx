"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const GREEN = "#5E8F34";
const GREY = "#6B7280";
const BG = "#F8F8F6";

export default function Dashboard() {
  const [stats, setStats] = useState({
    banners: 0,
    categories: 0,
    cakes: 0,
    flavours: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [banners, categories, cakes, flavours] = await Promise.all([
      getDocs(collection(db, "banners")),
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "cakes")),
      getDocs(collection(db, "flavours")),
    ]);

    setStats({
      banners: banners.size,
      categories: categories.size,
      cakes: cakes.size,
      flavours: flavours.size,
    });
  }

  const cards = [
    { title: "Banners", value: stats.banners },
    { title: "Categories", value: stats.categories },
    { title: "Cakes", value: stats.cakes },
    { title: "Flavours", value: stats.flavours },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: 72,
          background: "#fff",
          borderBottom: "1px solid #ECECEC",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src="/logo.jpeg"
            alt="JBF"
            width={44}
            height={44}
            style={{ borderRadius: "50%" }}
          />

          <div>
            <h2 style={{ margin: 0, color: GREEN }}>JBF Admin</h2>
            <p style={{ margin: 0, color: GREY, fontSize: 13 }}>
              Catalog Dashboard
            </p>
          </div>
        </div>

        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: GREEN,
            fontWeight: 700,
          }}
        >
          View Website
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          minHeight: "calc(100vh - 72px)",
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            background: "#fff",
            borderRight: "1px solid #ECECEC",
            padding: 18,
          }}
        >
          <p style={{ color: "#9CA3AF", fontSize: 12 }}>MAIN MENU</p>

          <Link href="/admin/dashboard" style={menuActive}>
            Dashboard
          </Link>

          <Link href="/admin/banners" style={menu}>
            Banner Manager
          </Link>

          <Link href="/admin/categories" style={menu}>
            Categories
          </Link>

          <Link href="/admin/flavours" style={menu}>
            Flavours
          </Link>

          <Link href="/admin/cakes" style={menu}>
            Cake Manager
          </Link>

          <div
            style={{
              marginTop: 30,
              borderTop: "1px solid #F1F1F1",
              paddingTop: 18,
            }}
          >
            <Link href="/admin/login" style={menu}>
              Logout
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <section style={{ padding: 24 }}>
          <h1 style={{ color: GREEN, marginTop: 0 }}>
            Welcome 👋
          </h1>

          <p style={{ color: GREY }}>
            Real-time Firestore Dashboard
          </p>

          {/* REAL STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 18,
              marginTop: 24,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "0 6px 18px rgba(0,0,0,.05)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#EEF6E7",
                    display: "grid",
                    placeItems: "center",
                    color: GREEN,
                    fontWeight: 700,
                  }}
                >
                  ●
                </div>

                <h2
                  style={{
                    margin: "14px 0 4px",
                    color: GREEN,
                    fontSize: 30,
                  }}
                >
                  {card.value}
                </h2>

                <p style={{ margin: 0, color: GREY }}>
                  {card.title}
                </p>
              </div>
            ))}
          </div>

          {/* QUICK ACTION */}
          <div
            style={{
              marginTop: 30,
              background: "#fff",
              borderRadius: 18,
              padding: 22,
            }}
          >
            <h2 style={{ color: GREEN, marginTop: 0 }}>
              Quick Actions
            </h2>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <Link href="/admin/banners" style={btn}>
                + Banner
              </Link>

              <Link href="/admin/categories" style={btn}>
                + Category
              </Link>

              <Link href="/admin/flavours" style={btn}>
                + Flavour
              </Link>

              <Link href="/admin/cakes" style={btn}>
                + Cake
              </Link>
            </div>
          </div>

          {/* LIVE SUMMARY */}
          <div
            style={{
              marginTop: 30,
              background: "#fff",
              borderRadius: 18,
              padding: 22,
            }}
          >
            <h2 style={{ color: GREEN, marginTop: 0 }}>
              Store Summary
            </h2>

            <table style={{ width: "100%", marginTop: 12 }}>
              <tbody>
                <tr>
                  <td style={td}>Total Cakes</td>
                  <td style={td}>{stats.cakes}</td>
                </tr>

                <tr>
                  <td style={td}>Categories</td>
                  <td style={td}>{stats.categories}</td>
                </tr>

                <tr>
                  <td style={td}>Flavours</td>
                  <td style={td}>{stats.flavours}</td>
                </tr>

                <tr>
                  <td style={td}>Active Banners</td>
                  <td style={td}>{stats.banners}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

const menu = {
  display: "block",
  textDecoration: "none",
  padding: "12px 14px",
  borderRadius: 12,
  marginBottom: 8,
  color: GREY,
  fontWeight: 600,
};

const menuActive = {
  ...menu,
  background: "#EEF6E7",
  color: GREEN,
};

const btn = {
  textDecoration: "none",
  background: GREEN,
  color: "#fff",
  padding: "12px 18px",
  borderRadius: 12,
  fontWeight: 700,
};

const td = {
  padding: "12px 0",
  borderBottom: "1px solid #F3F4F6",
  color: GREY,
};