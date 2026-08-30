"use client";

import { useEffect, useState } from "react";
import {
  addBanner,
  getBanners,
  deleteBanner,
  updateBanner,
} from "../../../lib/banners";
import { uploadBannerImage } from "../../../lib/storage";

const GREEN = "#5E8F34";
const GREY = "#6B7280";

type Banner = {
  id: string;
  title: string;
  image: string;
  active: boolean;
};

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    const data = await getBanners();
    setBanners(data as Banner[]);
  }

  async function addNewBanner() {
    if (!title || !image) return;

    const url = await uploadBannerImage(image);

    await addBanner({
      title,
      image: url,
      active: true,
    });

    alert("Banner Saved Successfully");

    setTitle("");
    setImage(null);

    loadBanners();
  }

  async function toggle(id: string, active: boolean) {
    await updateBanner(id, !active);
    loadBanners();
  }

  async function remove(id: string) {
    if (!confirm("Delete this banner?")) return;

    await deleteBanner(id);
    loadBanners();
  }

  return (
    <main
      style={{
        background: "#F8F8F6",
        minHeight: "100vh",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ color: GREEN }}>Banner Manager</h1>

        <p style={{ color: GREY }}>
          Home Page Slider Banners
        </p>

        {/* ADD BANNER */}

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            marginTop: 24,
          }}
        >
          <input
            placeholder="Banner Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
            style={{ marginTop: 14 }}
          />

          <button
            onClick={addNewBanner}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 14,
              border: "none",
              borderRadius: 12,
              background: GREEN,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add Banner
          </button>
        </div>

        {/* CURRENT BANNERS */}

        <h2 style={{ color: GREEN, marginTop: 30 }}>
          Current Banners
        </h2>

        {banners.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 30,
              textAlign: "center",
              color: GREY,
            }}
          >
            No banners available
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 14,
                marginTop: 14,
              }}
            >
              <img
                src={b.image}
                alt={b.title}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 14,
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{b.title}</h3>

                  <p
                    style={{
                      color: b.active ? GREEN : GREY,
                      margin: "4px 0 0",
                    }}
                  >
                    {b.active ? "Active" : "Hidden"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggle(b.id, b.active)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: b.active
                        ? "#FEF3C7"
                        : "#DCFCE7",
                    }}
                  >
                    {b.active ? "Hide" : "Show"}
                  </button>

                  <button
                    onClick={() => remove(b.id)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: "#FEE2E2",
                      color: "#DC2626",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  outline: "none",
} as const;