"use client";

import { useEffect, useState } from "react";
import {
  getFlavours,
  addFlavour,
  deleteFlavour,
  Flavour,
} from "../../../lib/flavours";

const GREEN = "#5E8F34";
const GREY = "#6B7280";

export default function FlavourManager() {
  const [flavours, setFlavours] = useState<Flavour[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadFlavours();
  }, []);

  async function loadFlavours() {
    const data = await getFlavours();
    setFlavours(data);
  }

  async function saveFlavour() {
    if (!name.trim()) return;

    await addFlavour(name.trim());
    setName("");
    loadFlavours();
  }

  async function remove(id?: string) {
    if (!id) return;

    await deleteFlavour(id);
    loadFlavours();
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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ color: GREEN }}>Flavour Manager</h1>
        <p style={{ color: GREY }}>
          Add / Delete Cake Flavours
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            display: "flex",
            gap: 10,
            marginTop: 20,
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Flavour Name"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              outline: "none",
            }}
          />

          <button
            onClick={saveFlavour}
            style={{
              background: GREEN,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "0 22px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            marginTop: 24,
          }}
        >
          <h3 style={{ color: GREEN }}>All Flavours</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 12,
            }}
          >
            {flavours.map((f) => (
              <div
                key={f.id}
                style={{
                  background: "#EEF6E7",
                  color: GREEN,
                  padding: "8px 12px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {f.name}

                <button
                  onClick={() => remove(f.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#DC2626",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}