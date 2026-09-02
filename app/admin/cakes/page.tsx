"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  Plus,
  Filter,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  getCakes,
  deleteCake,
  duplicateCake,
  updateCake,
} from "../../../lib/cakes";

import type { Cake } from "../../../lib/cakes";

import { getCategories } from "../../../lib/categories";

const GREEN = "#5E8F34";
const BG = "#F8F8F6";
const GREY = "#6B7280";


type Category = {
  id: string;
  name: string;
  subs: string[];
};

export default function CakeManager() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");

  const [mainCategory, setMainCategory] =
    useState("All");

  const [subCategory, setSubCategory] =
    useState("All");
const [loadingId, setLoadingId] = useState("");
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  const all = (await getCakes()) as Cake[];
  const cats = (await getCategories()) as Category[];

  setCakes(all);
  setCategories(cats);
}

  async function removeCake(id: string) {
    const ok = confirm("Delete this cake?");

    if (!ok) return;

    await deleteCake(id);

    loadData();
  }
async function toggleActive(cake: Cake) {
  setLoadingId(cake.id ?? "");

await updateCake(cake.id!, {
    active: !cake.active,
  });

  await loadData();
  setLoadingId("");
}
  const currentSubs = useMemo(() => {
    if (mainCategory === "All") return [];

    const cat = categories.find(
      (c) => c.name === mainCategory
    );

    return cat?.subs || [];
  }, [mainCategory, categories]);
async function copyCake(cake: Cake) {
  setLoadingId(cake.id ?? "");

  await duplicateCake(cake);

  await loadData();

  setLoadingId("");
  alert("Cake duplicated successfully");
}
  const filtered = useMemo(() => {
    return cakes.filter((cake) => {
      const codeMatch =
        cake.code
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        cake.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const mainMatch =
        mainCategory === "All" ||
        cake.categories.includes(mainCategory);

      const subMatch =
        subCategory === "All" ||
        cake.subCategories.includes(subCategory);

      return codeMatch && mainMatch && subMatch;
    });
  }, [
    cakes,
    search,
    mainCategory,
    subCategory,
  ]);

  return (
    <main
      style={{
        background: BG,
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: GREEN,
                fontSize: 30,
              }}
            >
              Cake Manager
            </h1>

            <p
              style={{
                color: GREY,
                marginTop: 4,
              }}
            >
              Search, Edit & Delete Cakes
            </p>
          </div>

          <Link
            href="/admin/bulk-upload"
            style={{
              textDecoration: "none",
              background: GREEN,
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
            }}
          >
            <Plus size={18} />
            Bulk Upload
          </Link>
        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <Search color={GREY} size={20} />

          <input
            placeholder="Search JBF001 or Cake Name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
            }}
          />
        </div>

        {/* FILTER BAR */}

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <Filter
              color={GREEN}
              size={18}
            />

            <strong>Category Filter</strong>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                setMainCategory("All");
                setSubCategory("All");
              }}
              style={chip(mainCategory === "All")}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setMainCategory(cat.name);
                  setSubCategory("All");
                }}
                style={chip(
                  mainCategory === cat.name
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {currentSubs.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <button
                onClick={() =>
                  setSubCategory("All")
                }
                style={subChip(
                  subCategory === "All"
                )}
              >
                All
              </button>

              {currentSubs.map((sub) => (
                <button
                  key={sub}
                  onClick={() =>
                    setSubCategory(sub)
                  }
                  style={subChip(
                    subCategory === sub
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GRID STARTS HERE */}
                {/* RESULT COUNT */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: GREEN,
              fontSize: 20,
            }}
          >
            Saved Cakes
          </h2>

          <div
            style={{
              background: "#EEF6E7",
              color: GREEN,
              padding: "8px 14px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {filtered.length} Cakes
          </div>
        </div>

        {/* CAKE GRID */}

        <div className="cake-grid">
          {filtered.map((cake) => (
            <div key={cake.id} className="cake-card">
              {/* COVER IMAGE */}

              <div className="image-wrap">
                <img
                  src={cake.images?.[0]}
                  alt={cake.name}
                  className="cake-img"
                />

                <div className="code-badge">
                  {cake.code}
                </div>
              </div>
              <div
  style={{
    position: "absolute",
    top: 10,
    right: 10,
    background: cake.active ? "#16A34A" : "#DC2626",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
  }}
>
  {cake.active ? "LIVE" : "HIDDEN"}
</div>

              {/* DETAILS */}

              <div style={{ padding: 14 }}>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: 16,
                    color: "#111827",
                  }}
                >
                  {cake.name}
                </h3>

                <div
                  style={{
                    color: GREEN,
                    fontWeight: 800,
                    fontSize: 20,
                  }}
                >
                  ₹{cake.startingPrice}
                </div>

                <p
                  style={{
                    margin: "6px 0",
                    color: GREY,
                    fontSize: 13,
                  }}
                >
                  {cake.minWeight} • {cake.serving}
                </p>

                {/* CATEGORY */}

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 10,
                  }}
                >
                  {cake.categories.map((cat) => (
                    <div
                      key={cat}
                      style={{
                        background: "#EEF6E7",
                        color: GREEN,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>

                {/* SUB CATEGORY */}

                {cake.subCategories?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    {cake.subCategories.map((sub) => (
                      <div
                        key={sub}
                        style={{
                          background: "#F3F4F6",
                          color: "#555",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                        }}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTIONS */}

                <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 8,
    marginTop: 16,
  }}
>
  <Link
    href={`/admin/cakes/edit/${cake.id}`}
    style={{ textDecoration: "none" }}
  >
    <button className="editBtn">
      <Pencil size={16} />
    </button>
  </Link>

  <button
    className="copyBtn"
    onClick={() => copyCake(cake)}
    disabled={loadingId === cake.id}
  >
    <Copy size={16} />
  </button>

  <button
    className="hideBtn"
    onClick={() => toggleActive(cake)}
    disabled={loadingId === cake.id}
  >
    {cake.active ? (
      <Eye size={16} />
    ) : (
      <EyeOff size={16} />
    )}
  </button>

  <button
    className="deleteBtn"
    onClick={() => removeCake(cake.id!)}
  >
    <Trash2 size={16} />
  </button>
</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 50,
              textAlign: "center",
              color: GREY,
            }}
          >
            <Image
              src="/logo.jpeg"
              alt="JBF"
              width={70}
              height={70}
              style={{
                borderRadius: 999,
                opacity: 0.15,
              }}
            />

            <h3 style={{ marginBottom: 6 }}>
              No Cakes Found
            </h3>

            <p>
              Try changing category or search code.
            </p>
          </div>
        )}

        {/* GRID END */}
                {/* LOADING / EMPTY SPACE */}

        <div style={{ height: 20 }} />

      </div>

      {/* RESPONSIVE CSS */}

      <style jsx>{`
        .cake-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .cake-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          transition: 0.25s;
        }

        .cake-card:hover {
          transform: translateY(-3px);
        }

        .image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f3f4f6;
        }

        .cake-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .code-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.78);
          color: #fff;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
          .editBtn,
.copyBtn,
.hideBtn,
.deleteBtn{
  border:none;
  height:42px;
  border-radius:10px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}

.editBtn{
  background:#DCFCE7;
  color:#166534;
}

.copyBtn{
  background:#DBEAFE;
  color:#1D4ED8;
}

.hideBtn{
  background:#FEF3C7;
  color:#92400E;
}

.deleteBtn{
  background:#FEE2E2;
  color:#B91C1C;
}

        @media (min-width: 900px) {
          .cake-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </main>
  );
}

/* BUTTON STYLES */

const chip = (active: boolean): React.CSSProperties => ({
  padding: "9px 15px",
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  background: active ? GREEN : "#F3F4F6",
  color: active ? "#fff" : "#374151",
  fontWeight: 700,
  fontSize: 13,
});

const subChip = (active: boolean): React.CSSProperties => ({
  padding: "7px 13px",
  borderRadius: 999,
  border: "1px solid #E5E7EB",
  cursor: "pointer",
  background: active ? "#DCFCE7" : "#fff",
  color: active ? "#166534" : "#555",
  fontWeight: 600,
  fontSize: 12,
});