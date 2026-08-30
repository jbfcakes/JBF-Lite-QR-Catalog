"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  addSubCategory,
  deleteCategory,
} from "../../../lib/categories";

const GREEN = "#5E8F34";
const GREY = "#6B7280";

type Category = {
  id: string;
  name: string;
  subs: string[];
};

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [subInput, setSubInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data as Category[]);
  }

  async function addCategoryData() {
    if (!newCategory.trim()) return;

    await addCategory(newCategory);
    setNewCategory("");
    loadCategories();
  }

  async function addSub(id: string) {
    const value = subInput[id];
    if (!value?.trim()) return;

    const cat = categories.find((c) => c.id === id);
    if (!cat) return;

    await addSubCategory(id, [...cat.subs, value]);

    setSubInput({ ...subInput, [id]: "" });
    loadCategories();
  }

  async function removeCategory(id: string) {
    await deleteCategory(id);
    loadCategories();
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
        <h1 style={{ color: GREEN }}>Category Manager</h1>

        <p style={{ color: GREY }}>
          Unlimited Categories & Sub Categories
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            display: "flex",
            gap: 12,
            marginTop: 24,
          }}
        >
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              outline: "none",
            }}
          />

          <button
            onClick={addCategoryData}
            style={{
              background: GREEN,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0 22px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <div style={{ marginTop: 28 }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: 18,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: 0, color: GREEN }}>{cat.name}</h2>

                <button
                  onClick={() => removeCategory(cat.id)}
                  style={{
                    background: "#FEE2E2",
                    color: "#DC2626",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                {cat.subs.map((sub) => (
                  <div
                    key={sub}
                    style={{
                      background: "#EEF6E7",
                      color: GREEN,
                      padding: "8px 12px",
                      borderRadius: 999,
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <input
                  value={subInput[cat.id] || ""}
                  onChange={(e) =>
                    setSubInput({
                      ...subInput,
                      [cat.id]: e.target.value,
                    })
                  }
                  placeholder="Add Sub Category"
                  style={{
                    flex: 1,
                    padding: 11,
                    borderRadius: 10,
                    border: "1px solid #E5E7EB",
                    outline: "none",
                  }}
                />

                <button
                  onClick={() => addSub(cat.id)}
                  style={{
                    background: GREEN,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "0 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}