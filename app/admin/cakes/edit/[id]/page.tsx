"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import {
  getCakeById,
  updateCake,
} from "../../../../../lib/cakes";

import { getCategories } from "../../../../../lib/categories";
import { getFlavours } from "../../../../../lib/flavours";
import {
  uploadCakeImage,
  deleteCakeImage,
} from "../../../../../lib/storage";

const GREEN = "#5E8F34";

export default function EditCake() {
  const { id } = useParams();
  const router = useRouter();

  const [cake, setCake] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [flavours, setFlavours] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getCakeById(String(id));
    const cats = await getCategories();
    const flv = await getFlavours();

    setCake(data);
    setCategories(cats);
    setFlavours(flv);
  }

  async function addImages(files: FileList | null) {
    if (!files || !cake) return;

    const urls = [...cake.images];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadCakeImage(
        files[i],
        cake.code,
        urls.length + i
      );

      urls.push(url);
    }

    setCake({
      ...cake,
      images: urls,
    });
  }

  function moveLeft(index: number) {
    if (index === 0) return;

    const arr = [...cake.images];

    [arr[index - 1], arr[index]] = [
      arr[index],
      arr[index - 1],
    ];

    setCake({
      ...cake,
      images: arr,
    });
  }

  function moveRight(index: number) {
    if (index === cake.images.length - 1) return;

    const arr = [...cake.images];

    [arr[index + 1], arr[index]] = [
      arr[index],
      arr[index + 1],
    ];

    setCake({
      ...cake,
      images: arr,
    });
  }

  function deleteImage(index: number) {
  const arr = cake.images.filter(
    (_: any, i: number) => i !== index
  );

  setCake({
    ...cake,
    images: arr,
  });
}

function makeCover(index: number) {
  if (index === 0) return;

  const arr = [...cake.images];
  const cover = arr.splice(index, 1)[0];
  arr.unshift(cover);

  setCake({
    ...cake,
    images: arr,
  });
}

async function replaceImage(
  file: File,
  index: number
) {
  try {
    // Purani image delete
    await deleteCakeImage(cake.images[index]);

    // New image upload
    const url = await uploadCakeImage(
      file,
      cake.code,
      index
    );

    const arr = [...cake.images];
    arr[index] = url;

    setCake({
      ...cake,
      images: arr,
    });
  } catch (err) {
    alert("Image replace failed");
    console.error(err);
  }
}

function dropImage(dropIndex: number) {
  if (dragIndex === null || dragIndex === dropIndex) return;

  const arr = [...cake.images];
  const dragged = arr.splice(dragIndex, 1)[0];
  arr.splice(dropIndex, 0, dragged);

  setCake({
    ...cake,
    images: arr,
  });

  setDragIndex(null);
}

  function toggleCategory(name: string) {
    const list = cake.categories.includes(name)
      ? cake.categories.filter((x: string) => x !== name)
      : [...cake.categories, name];

    setCake({
      ...cake,
      categories: list,
      subCategories: cake.subCategories.filter((s: string) =>
        categories
          .filter((c: any) => list.includes(c.name))
          .flatMap((c: any) => c.subs)
          .includes(s)
      ),
    });
  }

  function toggleFlavour(name: string) {
    const list = cake.flavours.includes(name)
      ? cake.flavours.filter((x: string) => x !== name)
      : [...cake.flavours, name];

    setCake({
      ...cake,
      flavours: list,
    });
  }

  async function saveCake() {
    setSaving(true);

    await updateCake(cake.id, cake);

    alert("Cake Updated Successfully");

    router.push("/admin/cakes");
  }

  if (!cake) return null;

  return (
    <main
      style={{
        background: "#F8F8F6",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
              {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => router.push("/admin/cakes")}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1
              style={{
                margin: 0,
                color: GREEN,
                fontSize: 28,
              }}
            >
              Edit Cake
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                color: "#6B7280",
              }}
            >
              {cake.code}
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
          }}
        >
          {/* Name */}
          <div>
            <label style={label}>Cake Name</label>

            <input
              value={cake.name}
              onChange={(e) =>
                setCake({
                  ...cake,
                  name: e.target.value,
                })
              }
              style={input}
            />
          </div>

          {/* Price / Weight / Serving */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 14,
              marginTop: 22,
            }}
          >
            <div>
              <label style={label}>Starting Price</label>

              <input
                type="number"
                value={cake.startingPrice}
                onChange={(e) =>
                  setCake({
                    ...cake,
                    startingPrice: Number(e.target.value),
                  })
                }
                style={input}
              />
            </div>

            <div>
              <label style={label}>Minimum Weight</label>

              <input
                value={cake.minWeight}
                onChange={(e) =>
                  setCake({
                    ...cake,
                    minWeight: e.target.value,
                  })
                }
                style={input}
              />
            </div>

            <div>
              <label style={label}>Serving</label>

              <input
                value={cake.serving}
                onChange={(e) =>
                  setCake({
                    ...cake,
                    serving: e.target.value,
                  })
                }
                style={input}
              />
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginTop: 28 }}>
            <h3 style={title}>Categories</h3>

            <div style={wrap}>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  style={
                    cake.categories.includes(cat.name)
                      ? chipActive
                      : chip
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Categories */}
          <div style={{ marginTop: 24 }}>
            <h3 style={title}>Sub Categories</h3>

            <div style={wrap}>
              {categories
                .filter((c: any) =>
                  cake.categories.includes(c.name)
                )
                .flatMap((c: any) => c.subs)
                .map((sub: string) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      const list = cake.subCategories.includes(sub)
                        ? cake.subCategories.filter(
                            (x: string) => x !== sub
                          )
                        : [...cake.subCategories, sub];

                      setCake({
                        ...cake,
                        subCategories: list,
                      });
                    }}
                    style={
                      cake.subCategories.includes(sub)
                        ? chipActive
                        : chip
                    }
                  >
                    {sub}
                  </button>
                ))}
            </div>
          </div>

          {/* Flavours */}
          <div style={{ marginTop: 24 }}>
            <h3 style={title}>Flavours</h3>

            <div style={wrap}>
              {flavours.map((f: any) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFlavour(f.name)}
                  style={
                    cake.flavours.includes(f.name)
                      ? chipActive
                      : chip
                  }
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

         {/* Images Start */}
<div style={{ marginTop: 28 }}>
  <h3 style={title}>Cake Images</h3>

  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      border: "2px dashed #D1D5DB",
      borderRadius: 12,
      padding: 14,
      cursor: "pointer",
      marginBottom: 18,
    }}
  >
    <Upload size={20} color={GREEN} />

    <span
      style={{
        fontWeight: 600,
        color: "#374151",
      }}
    >
      Upload More Images
    </span>

    <input
      hidden
      multiple
      type="file"
      accept="image/*"
      onChange={(e) => addImages(e.target.files)}
    />
  </label>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(170px,1fr))",
      gap: 16,
    }}
  >
    {cake.images.map((img: string, index: number) => (
      <div
  key={index}
  draggable
  onDragStart={() => setDragIndex(index)}
  onDragOver={(e) => e.preventDefault()}
  onDrop={() => dropImage(index)}
>
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1",
          }}
        >
          <img
            src={img}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />

          {index === 0 && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: GREEN,
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              COVER
            </div>
          )}
        </div>

        {/* Replace */}
        <label
          style={{
            display: "block",
            background: "#EFF6FF",
            color: "#1D4ED8",
            textAlign: "center",
            padding: 8,
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
            marginTop: 8,
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Replace

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                replaceImage(
                  e.target.files[0],
                  index
                );
              }
            }}
          />
        </label>

        {/* Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          <button
            type="button"
            onClick={() => makeCover(index)}
            style={{
              ...btn,
              background: "#DCFCE7",
              color: "#166534",
            }}
          >
            Cover
          </button>

          <button
            type="button"
            onClick={() => deleteImage(index)}
            style={{
              ...btn,
              background: "#FEE2E2",
              color: "#DC2626",
            }}
          >
            <Trash2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => moveLeft(index)}
            style={btn}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => moveRight(index)}
            style={btn}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Save */}
<button
  onClick={saveCake}
  disabled={saving}
  style={{
    width: "100%",
    marginTop: 30,
    padding: 16,
    border: "none",
    borderRadius: 12,
    background: GREEN,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: saving ? "not-allowed" : "pointer",
    opacity: saving ? 0.7 : 1,
  }}
>
  {saving ? "Saving..." : "Save Changes"}
</button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Styles ---------- */

const label = {
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
};

const title = {
  margin: "0 0 12px",
  color: "#111827",
};

const input = {
  width: "100%",
  padding: 12,
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  marginTop: 6,
  fontSize: 14,
};

const btn = {
  flex: 1,
  padding: 8,
  border: "none",
  borderRadius: 8,
  background: "#F3F4F6",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const wrap = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 8,
};

const chip = {
  padding: "9px 14px",
  borderRadius: 999,
  border: "1px solid #E5E7EB",
  background: "#FFFFFF",
  cursor: "pointer",
  fontSize: 13,
};

const chipActive = {
  ...chip,
  background: GREEN,
  color: "#FFFFFF",
  border: "1px solid #5E8F34",
};