"use client";

import Link from "next/link";
import Image from "next/image";

const GREEN = "#5E8F34";
const GREY = "#6B7280";
const BG = "#F8F8F6";

const cards = [
  { title: "Banners", value: "3", color: "#EEF6E7" },
  { title: "Categories", value: "6", color: "#EEF6E7" },
  { title: "Cakes", value: "128", color: "#EEF6E7" },
  { title: "QR Visits", value: "2.1K", color: "#EEF6E7" },
];

export default function Dashboard() {
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
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Image
            src="/logo.jpeg"
            alt="JBF"
            width={44}
            height={44}
            style={{ borderRadius: "50%" }}
          />

          <div>
            <h2
              style={{
                margin: 0,
                color: GREEN,
                fontSize: 22,
              }}
            >
              JBF Admin
            </h2>

            <p
              style={{
                margin: 0,
                color: GREY,
                fontSize: 13,
              }}
            >
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
          <p
            style={{
              color: "#9CA3AF",
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            MAIN MENU
          </p>

          <Link href="/admin/dashboard" style={menuActive}>
            Dashboard
          </Link>

          <Link href="/admin/banners" style={menu}>
            Banner Manager
          </Link>

          <Link href="/admin/categories" style={menu}>
            Categories
          </Link>

          <Link href="/admin/cakes" style={menu}>
            Cake Manager
          </Link>

          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: "1px solid #F1F1F1",
            }}
          >
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 12,
              }}
            >
              ACCOUNT
            </p>

            <Link href="/admin/login" style={menu}>
              Logout
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <section style={{ padding: 24 }}>
          <h1
            style={{
              marginTop: 0,
              color: GREEN,
              fontSize: 30,
            }}
          >
            Welcome 👋
          </h1>

          <p
            style={{
              color: GREY,
              marginBottom: 24,
            }}
          >
            Manage banners, categories and cake catalog.
          </p>

          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 18,
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
                    borderRadius: 14,
                    background: card.color,
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

                <p
                  style={{
                    margin: 0,
                    color: GREY,
                  }}
                >
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
            <h2
              style={{
                color: GREEN,
                marginTop: 0,
              }}
            >
              Quick Actions
            </h2>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <Link href="/admin/banners" style={btn}>
                + Add Banner
              </Link>

              <Link href="/admin/categories" style={btn}>
                + New Category
              </Link>

              <Link href="/admin/cakes" style={btn}>
                + Add Cake
              </Link>
            </div>
          </div>

          {/* RECENT */}
          <div
            style={{
              marginTop: 30,
              background: "#fff",
              borderRadius: 18,
              padding: 22,
            }}
          >
            <h2
              style={{
                color: GREEN,
                marginTop: 0,
              }}
            >
              Recent Activity
            </h2>

            <table style={{ width: "100%", marginTop: 14 }}>
              <tbody>
                <tr>
                  <td style={td}>JBF001 Added</td>
                  <td style={td}>Today</td>
                </tr>
                <tr>
                  <td style={td}>Wedding Banner Updated</td>
                  <td style={td}>Today</td>
                </tr>
                <tr>
                  <td style={td}>Birthday Category Edited</td>
                  <td style={td}>Yesterday</td>
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