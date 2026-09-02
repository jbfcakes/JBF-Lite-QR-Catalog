"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCategories, getAllCakes } from "../../../lib/getData";

const GREEN = "#5E8F34";
const BG = "#F8F8F6";

type Category = {
  id: string;
  name: string;
  subs: string[];
};

type Cake = {
  id: string;
  code: string;
  name: string;
  images: string[];
  categories: string[];
  subCategories: string[];
  startingPrice: number;
  minWeight: string;
  serving: string;
};

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [category, setCategory] = useState<Category | null>(null);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [selectedSub, setSelectedSub] = useState("All");

  useEffect(() => {
    load();
  }, [slug]);

  async function load() {
    const cats = (await getCategories()) as any[];
    const all = (await getAllCakes()) as any[];

    const title = decodeURIComponent(slug)
      .replace(/-/g, " ")
      .toLowerCase();

    const cat = cats.find(
      (c) => c.name?.toLowerCase() === title
    );

    if (!cat) return;

    setCategory({
      id: cat.id,
      name: cat.name,
      subs: cat.subs || [],
    });

    const list = all.filter((cake) =>
      cake.categories?.includes(cat.name)
    );

    setCakes(list as Cake[]);
  }

  const filtered = useMemo(() => {
    if (selectedSub === "All") return cakes;

    return cakes.filter((cake) =>
      cake.subCategories?.includes(selectedSub)
    );
  }, [cakes, selectedSub]);

  if (!category) return null;

  return (
    <main style={{ background: BG, minHeight: "100vh" }}>
      <header
        style={{
          background: "#fff",
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link href="/">
          <Image
            src="/logo.jpeg"
            alt="JBF"
            width={46}
            height={46}
            style={{ borderRadius: 999 }}
          />
        </Link>

        <div>
          <h2 style={{ margin: 0, color: GREEN }}>
            {category.name}
          </h2>
          <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
            Premium Cake Collection
          </p>
        </div>
      </header>

      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setSelectedSub("All")}
            style={chip(selectedSub === "All")}
          >
            All
          </button>

          {category.subs.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              style={chip(selectedSub === sub)}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid">
          {filtered.map((cake) => (
            <div key={cake.id} className="card">
              <img src={cake.images?.[0]} className="img" />

              <div style={{ padding: 12 }}>
                <p
                  style={{
                    margin: 0,
                    color: "#888",
                    fontSize: 11,
                  }}
                >
                  {cake.code}
                </p>

                <h3 style={{ margin: "6px 0" }}>
                  {cake.name}
                </h3>

                <p
                  style={{
                    color: GREEN,
                    fontWeight: 700,
                    margin: "6px 0",
                  }}
                >
                  ₹{cake.startingPrice}
                </p>

                <p
                  style={{
                    color: "#666",
                    fontSize: 12,
                    margin: 0,
                  }}
                >
                  {cake.minWeight} • {cake.serving}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
        }
        .img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }
        @media (min-width: 900px) {
          .grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </main>
  );
}

const chip = (active: boolean): React.CSSProperties => ({
  padding: "8px 14px",
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  background: active ? GREEN : "#fff",
  color: active ? "#fff" : "#333",
  whiteSpace: "nowrap",
  fontWeight: 600,
});