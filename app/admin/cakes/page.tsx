"use client";

import { useEffect, useState } from "react";
import {
  addCake,
  getCakes,
  deleteCake,
  getLastCakeCode,
  updateCake,
} from "../../../lib/cakes";
import { uploadCakeImage } from "../../../lib/storage";

const GREEN = "#5E8F34";
const GREY = "#6B7280";

type Cake = {
  id?: string;
  code: string;
  name: string;
  price: string;
  size: string;
  categories: string[];
  flavours: string[];
  images: File[];
};

const allCategories = [
  "Birthday Boy",
  "Birthday Girl",
  "Birthday Men",
  "Birthday Women",
  "Birthday Kids",
  "Wedding",
  "Theme Cake",
  "Trending",
];

const allFlavours = [
  "Chocolate",
  "Vanilla",
  "Red Velvet",
  "Oreo",
  "Butterscotch",
  "Rasmalai",
  "Blueberry",
  "Pineapple",
];

export default function CakeManager() {
  const [cakes, setCakes] = useState<any[]>([]);
  const [nextCode, setNextCode] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [cake, setCake] = useState<Cake>({
    code: "JBF001",
    name: "",
    price: "",
    size: "",
    categories: [],
    flavours: [],
    images: [],
  });

  useEffect(() => {
    loadCakes();
  }, []);

  async function loadCakes() {
    const data = await getCakes();
    setCakes(data);

    const last = await getLastCakeCode();
    const next = Number(last.replace("JBF", "")) + 1;

    setNextCode(next);

    setCake((prev) => ({
      ...prev,
      code: `JBF${String(next).padStart(3, "0")}`,
    }));
  }

  const toggleCategory = (cat: string) => {
    setCake({
      ...cake,
      categories: cake.categories.includes(cat)
        ? cake.categories.filter((c) => c !== cat)
        : [...cake.categories, cat],
    });
  };

  const toggleFlavour = (f: string) => {
    setCake({
      ...cake,
      flavours: cake.flavours.includes(f)
        ? cake.flavours.filter((x) => x !== f)
        : [...cake.flavours, f],
    });
  };

  const saveCake = async () => {
    if (!cake.name) {
      alert("Enter Cake Name");
      return;
    }

    setLoading(true);

    // EDIT MODE
    if (editingId) {
      await updateCake(editingId, {
        code: cake.code,
        name: cake.name,
        startingPrice: Number(cake.price),
        startingSize: cake.size,
        categories: cake.categories,
        flavours: cake.flavours,
      });

      setEditingId(null);
      await loadCakes();
      setLoading(false);

      alert("Cake Updated Successfully");
      return;
    }
setCake({
  code: `JBF${String(nextCode).padStart(3, "0")}`,
  name: "",
  price: "",
  size: "",
  categories: [],
  flavours: [],
  images: [],
});
    try {
      const imageUrls: string[] = [];

      for (const file of cake.images) {
        const url = await uploadCakeImage(file);
        imageUrls.push(url);
      }

      await addCake({
  code: cake.code,
  name: cake.name,
  startingPrice: Number(cake.price),
  startingSize: cake.size,
  categories: cake.categories,
  flavours: cake.flavours,
  images: imageUrls,
});

      await loadCakes();

      alert("Cake Saved Successfully");
    } catch (e) {
      console.error(e);
      alert("Upload Failed");
    }
setCake({
  code: `JBF${String(nextCode).padStart(3, "0")}`,
  name: "",
  price: "",
  size: "",
  categories: [],
  flavours: [],
  images: [],
});
    setLoading(false);
  };
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
        <h1 style={{ color: GREEN }}>Cake Manager</h1>

        <p style={{ color: GREY }}>
          Add Unlimited Cake Designs
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: 22,
            marginTop: 24,
          }}
        >
          <h2 style={{ color: GREEN }}>Cake Details</h2>

          <label style={{ color: GREY }}>Design Code</label>

          <input
            value={cake.code}
            readOnly
            style={{
              ...input,
              background: "#F3F4F6",
              color: GREEN,
              fontWeight: 700,
            }}
          />

          <label style={{ color: GREY, marginTop: 16, display: "block" }}>
            Cake Name
          </label>

          <input
            placeholder="Spider Theme Cake"
            value={cake.name}
            onChange={(e) =>
              setCake({
                ...cake,
                name: e.target.value,
              })
            }
            style={input}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: GREY }}>Starting Price</label>

              <input
                placeholder="699"
                value={cake.price}
                onChange={(e) =>
                  setCake({
                    ...cake,
                    price: e.target.value,
                  })
                }
                style={input}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ color: GREY }}>Starting Size</label>

              <input
                placeholder="0.5 KG"
                value={cake.size}
                onChange={(e) =>
                  setCake({
                    ...cake,
                    size: e.target.value,
                  })
                }
                style={input}
              />
            </div>
          </div>

          {/* IMAGE UPLOAD */}

          <h3 style={{ marginTop: 22, color: GREEN }}>
            Cake Images
          </h3>

          <label
            style={{
              display: "block",
              border: "2px dashed #5E8F34",
              borderRadius: 16,
              padding: 20,
              textAlign: "center",
              background: "#F8FFF4",
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) =>
                setCake({
                  ...cake,
                  images: Array.from(e.target.files || []),
                })
              }
            />

            <div
              style={{
                fontSize: 15,
                color: GREEN,
                fontWeight: 700,
              }}
            >
              Choose Multiple Images
            </div>

            <div
              style={{
                fontSize: 13,
                color: GREY,
                marginTop: 6,
              }}
            >
              Upload up to 10 cake photos
            </div>
          </label>

          {cake.images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginTop: 16,
              }}
            >
              {cake.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    aspectRatio: "1/1",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    onClick={() =>
                      setCake({
                        ...cake,
                        images: cake.images.filter((_, x) => x !== i),
                      })
                    }
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(0,0,0,.65)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CATEGORIES */}

          <h3 style={{ marginTop: 26, color: GREEN }}>
            Categories
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
            }}
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  background: cake.categories.includes(cat)
                    ? GREEN
                    : "#EEF6E7",
                  color: cake.categories.includes(cat)
                    ? "#fff"
                    : GREEN,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FLAVOURS */}

          <h3 style={{ marginTop: 24, color: GREEN }}>
            Available Flavours
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
            }}
          >
            {allFlavours.map((f) => (
              <button
                key={f}
                onClick={() => toggleFlavour(f)}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 14px",
                  cursor: "pointer",
                  background: cake.flavours.includes(f)
                    ? GREEN
                    : "#F3F4F6",
                  color: cake.flavours.includes(f)
                    ? "#fff"
                    : GREY,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={saveCake}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 28,
              padding: 15,
              border: "none",
              borderRadius: 14,
              background: loading ? "#9CA3AF" : GREEN,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading
              ? "Uploading..."
              : editingId
              ? "Update Cake"
              : "Save Cake"}
          </button>
        </div>
                {/* SAVED CAKES */}

        <h2
          style={{
            marginTop: 30,
            color: GREEN,
          }}
        >
          Saved Cakes ({cakes.length})
        </h2>

        {cakes.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 16,
              marginTop: 14,
              boxShadow: "0 4px 14px rgba(0,0,0,.06)",
            }}
          >
            {item.images?.length > 0 && (
              <img
                src={item.images[0]}
                alt=""
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: GREEN,
                }}
              >
                {item.code}
              </h3>

              <div
                style={{
                  background: "#EEF6E7",
                  color: GREEN,
                  padding: "5px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ₹{item.price}
              </div>
            </div>

            <p
              style={{
                margin: "6px 0",
                color: GREY,
              }}
            >
              {item.name}
            </p>

            <p
              style={{
                margin: 0,
                color: "#9CA3AF",
                fontSize: 13,
              }}
            >
              Starting Size : {item.size}
            </p>

            {/* Categories */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 12,
              }}
            >
              {item.categories?.map((c: string) => (
                <div
                  key={c}
                  style={{
                    background: "#EEF6E7",
                    color: GREEN,
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>

            {/* Flavours */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 10,
              }}
            >
              {item.flavours?.map((f: string) => (
                <div
                  key={f}
                  style={{
                    background: "#F3F4F6",
                    color: GREY,
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                  }}
                >
                  {f}
                </div>
              ))}
            </div>

            {/* EDIT BUTTON */}

            <button
              onClick={() => {
                setEditingId(item.id);

                setCake({
                  code: item.code,
                  name: item.name,
                  price: item.price,
                  size: item.size,
                  categories: item.categories,
                  flavours: item.flavours,
                  images: [],
                });

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              style={{
                width: "100%",
                marginTop: 14,
                padding: 12,
                border: "none",
                borderRadius: 10,
                background: "#EEF6E7",
                color: GREEN,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Edit Cake
            </button>

            {/* DELETE BUTTON */}

            <button
              onClick={async () => {
                if (!confirm("Delete this cake?")) return;

                await deleteCake(item.id);
                loadCakes();
              }}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 12,
                border: "none",
                borderRadius: 10,
                background: "#FEE2E2",
                color: "#DC2626",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Delete Cake
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const input = {
  width: "100%",
  padding: 12,
  marginTop: 8,
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  outline: "none",
} as const;