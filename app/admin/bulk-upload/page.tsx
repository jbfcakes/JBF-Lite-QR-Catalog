"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  CheckCircle,
} from "lucide-react";

import {
  addCake,
  getNextCakeCode,
} from "../../../lib/cakes";

import { getCategories } from "../../../lib/categories";
import { getFlavours } from "../../../lib/flavours";
import { uploadCakeImage } from "../../../lib/storage";

const GREEN = "#5E8F34";
const BG = "#F8F8F6";
const th = {
  textAlign: "left" as const,
  padding: 12,
  fontSize: 13,
  color: "#374151",
};

const td = {
  padding: 10,
  borderTop: "1px solid #F3F4F6",
};
type Category = {
  id: string;
  name: string;
  subs: string[];
};

type Flavour = {
  id: string;
  name: string;
};

function generateCakeName(fileName: string, code: string) {
  const number = code.replace("JBF", "");

  const clean = fileName
    .replace(/\.[^/.]+$/, "") // extension remove
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return `${clean} ${number}`;
}

type UploadRow = {
  id: number;
  code: string;

  file: File;
  preview: string;

  name: string;

  startingPrice: number;
  minWeight: string;
  serving: string;

  categories: string[];
  subCategories: string[];
  flavours: string[];

};

export default function BulkUploadStudio() {
  const [rows, setRows] = useState<UploadRow[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [flavours, setFlavours] = useState<Flavour[]>([]);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [common, setCommon] = useState({
  startingPrice: 599,
  minWeight: "Bento (150–200gm)",
  serving: "2–4 Persons",
  categories: [] as string[],
  subCategories: [] as string[],
  flavours: [] as string[],
});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setCategories((await getCategories()) as Category[]);
    setFlavours((await getFlavours()) as Flavour[]);
  }

  async function addFiles(files: File[]) {
    if (files.length === 0) return;

    const next = await getNextCakeCode();
    const start = Number(next.replace("JBF", ""));

    const newRows: UploadRow[] = files
  .slice(0, 50)
  .map((file, index) => ({
  id: Date.now() + index,
  code: `JBF${String(start + index).padStart(3, "0")}`,
  file,
  preview: URL.createObjectURL(file),
  name: generateCakeName(
  file.name,
  `JBF${String(start + index).padStart(3, "0")}`
),
        startingPrice: common.startingPrice,
minWeight: common.minWeight,
serving: common.serving,

categories: [...common.categories],
subCategories: [...common.subCategories],
flavours: [...common.flavours],

      }));

    setRows(newRows);
  }

  function updateRow(
    id: number,
    key: keyof UploadRow,
    value: any
  ) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      )
    );
  }

  function deleteRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function copyPrevious(id: number) {
  const index = rows.findIndex((r) => r.id === id);
  if (index <= 0) return;

  const prev = rows[index - 1];

  setRows((p) =>
    p.map((r) =>
      r.id !== id
        ? r
        : {
            ...r,
            startingPrice: prev.startingPrice,
            minWeight: prev.minWeight,
            serving: prev.serving,
            categories: [...prev.categories],
            subCategories: [...prev.subCategories],
            flavours: [...prev.flavours],
          }
    )
  );
}

function applyToAll() {
  setRows((prev) =>
    prev.map((r) => ({
      ...r,
      startingPrice: common.startingPrice,
      minWeight: common.minWeight,
      serving: common.serving,
      categories: [...common.categories],
      subCategories: [...common.subCategories],
      flavours: [...common.flavours],
    }))
  );
}

function bulkRename() {
  if (!findText.trim()) return;

  setRows((prev) =>
    prev.map((r) => ({
      ...r,
      name: r.name.replaceAll(findText, replaceText),
    }))
  );
}

function isDuplicateName(name: string, currentId: number) {
  const clean = name.trim().toLowerCase();

  return rows.some(
    (r) =>
      r.id !== currentId &&
      r.name.trim().toLowerCase() === clean
  );
}

function getServingByWeight(weight: string) {
  switch (weight) {
    case "Bento (150–200gm)":
      return "2–4 Persons";
    case "300gm":
      return "4–6 Persons";
    case "500gm":
      return "8–10 Persons";
    case "1kg":
      return "18–20 Persons";
    case "1.2kg":
      return "24–26 Persons";
    case "1.5kg":
      return "28–30 Persons";
    case "2kg":
      return "38–40 Persons";
    case "2.5kg":
      return "48–50 Persons";
    case "3kg":
      return "60–65 Persons";
    default:
      return "2–4 Persons";
  }
}

  async function uploadAll() {
  if (rows.length === 0) {
    alert("Please select images first");
    return;
  }

  // Validation
  for (const r of rows) {
    if (!r.name.trim()) {
      alert(`${r.code} : Cake name is required`);
      return;
    }

    if (r.startingPrice <= 0) {
      alert(`${r.code} : Starting price is required`);
      return;
    }

    if (r.categories.length === 0) {
      alert(`${r.code} : Select at least one category`);
      return;
    }

    if (r.flavours.length === 0) {
      alert(`${r.code} : Select at least one flavour`);
      return;
    }

    if (isDuplicateName(r.name, r.id)) {
  alert(`${r.code} : Duplicate cake name`);
  return;
}
  }

  // Duplicate image protection
  const names = rows.map((r) => r.file.name);
  if (new Set(names).size !== names.length) {
    alert("Duplicate images detected.");
    return;
  }

  try {
    setUploading(true);
    setProgress(0);

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      const imageUrl = await uploadCakeImage(
        r.file,
        r.code,
        0
      );

      await addCake({
        code: r.code,
        name: r.name,
        images: [imageUrl],

        categories: r.categories,
        subCategories: r.subCategories,
        flavours: r.flavours,

        startingPrice: r.startingPrice,
        minWeight: r.minWeight,
        serving: r.serving,

        active: true,
        keywords: [],
      });

      setProgress(
        Math.round(((i + 1) / rows.length) * 100)
      );
    }

    alert(`🎉 Success! ${rows.length} cakes uploaded.`);

    setRows([]);
    setProgress(0);
  } catch (err) {
    console.error(err);
    alert("Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
}

  return (
    <main
      style={{
        background: BG,
        minHeight: "100vh",
        padding: 24,
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
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: GREEN,
                fontSize: 32,
              }}
            >
              Bulk Upload Studio
            </h1>

            <p
              style={{
                marginTop: 6,
                color: "#6B7280",
              }}
            >
              Upload 50 Cakes in One Click
            </p>
          </div>

          <div
            style={{
              background: "#DCFCE7",
              color: GREEN,
              padding: "10px 16px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {rows.length} / 50
          </div>
        </div>
                {/* DRAG & DROP */}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(Array.from(e.dataTransfer.files));
          }}
          style={{
            background: "#EEF6E7",
            border: "2px dashed #5E8F34",
            borderRadius: 18,
            padding: 30,
            textAlign: "center",
          }}
        >
          <ImageIcon size={46} color={GREEN} />

          <h2
            style={{
              margin: "12px 0 6px",
              color: GREEN,
            }}
          >
            Drag & Drop Cake Images
          </h2>

          <p style={{ color: "#4B5563" }}>
            PNG • JPG • JPEG → Auto WebP • Max 50 Images
          </p>

          <input
            id="picker"
            hidden
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              addFiles(Array.from(e.target.files || []))
            }
          />

          <button
            onClick={() =>
              document.getElementById("picker")?.click()
            }
            style={{
              marginTop: 16,
              background: GREEN,
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Upload size={18} />
            Select Images
          </button>
        </div>

        {rows.length > 0 && (
  <div
    style={{
      background: "#fff",
      borderRadius: 18,
      padding: 18,
      marginTop: 20,
    }}
  >
    <h2 style={{ marginTop: 0, color: GREEN }}>
      Apply to All Cakes
    </h2>

    <div className="twoCol">
      <input
        type="number"
        placeholder="Starting Price"
        value={common.startingPrice}
        onChange={(e) =>
          setCommon({
            ...common,
            startingPrice: Number(e.target.value),
          })
        }
        className="input"
      />

      <select
  value={common.minWeight}
  onChange={(e) =>
  setCommon({
    ...common,
    minWeight: e.target.value,
    serving: getServingByWeight(e.target.value),
  })
}
  className="input"
>
  <option>Bento (150–200gm)</option>
  <option>300gm</option>
  <option>500gm</option>
  <option>1kg</option>
  <option>1.2kg</option>
  <option>1.5kg</option>
  <option>2kg</option>
  <option>2.5kg</option>
  <option>3kg</option>


  </select>
  </div>

 <input
  value={common.serving}
  readOnly
  className="input"
  style={{
    background: "#F9FAFB",
    color: "#374151",
    fontWeight: 600,
    }}
     />

     <div style={{ marginTop: 14 }}>
     <p className="label">Categories</p>
      <div className="chipWrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setCommon({
                ...common,
                categories: common.categories.includes(cat.name)
                  ? common.categories.filter(
                      (x) => x !== cat.name
                    )
                  : [...common.categories, cat.name],
              })
            }
            className={
              common.categories.includes(cat.name)
                ? "chipActive"
                : "chip"
            }
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>

   
<div style={{ marginTop: 14 }}>
  <p className="label">Sub Categories</p>

  <div className="chipWrap">
    {categories
      .filter((c) => common.categories.includes(c.name))
      .flatMap((c) => c.subs)
      .map((sub) => (
        <button
          key={sub}
          onClick={() =>
            setCommon({
              ...common,
              subCategories: common.subCategories.includes(sub)
                ? common.subCategories.filter((x) => x !== sub)
                : [...common.subCategories, sub],
            })
          }
          className={
            common.subCategories.includes(sub)
              ? "chipActive"
              : "chip"
          }
        >
          {sub}
        </button>
      ))}
  </div>
</div>

    <div style={{ marginTop: 14 }}>
      <p className="label">Flavours</p>

      <div className="chipWrap">
        {flavours.map((f) => (
          <button
            key={f.id}
            onClick={() =>
              setCommon({
                ...common,
                flavours: common.flavours.includes(f.name)
                  ? common.flavours.filter(
                      (x) => x !== f.name
                    )
                  : [...common.flavours, f.name],
              })
            }
            className={
              common.flavours.includes(f.name)
                ? "chipActive"
                : "chip"
            }
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={applyToAll}
      style={{
        width: "100%",
        marginTop: 18,
        background: GREEN,
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: 14,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      
      Apply Settings to All {rows.length} Cakes
    </button>
    
  </div>
)}

<div
  style={{
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
  }}
>
  <h3 style={{ marginTop: 0, color: GREEN }}>
    Bulk Rename
  </h3>

  <div className="twoCol">
    <input
      placeholder="Find (Bday)"
      value={findText}
      onChange={(e) => setFindText(e.target.value)}
      className="input"
    />

    <input
      placeholder="Replace (Birthday)"
      value={replaceText}
      onChange={(e) => setReplaceText(e.target.value)}
      className="input"
    />
  </div>

  <button
    onClick={bulkRename}
    style={{
      width: "100%",
      marginTop: 12,
      background: "#111827",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: 12,
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Rename All Cakes
  </button>
</div>

        {/* PROGRESS */}

        {uploading && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 18,
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <strong>Uploading Cakes...</strong>

              <span>{progress}%</span>
            </div>

            <div
              style={{
                width: "100%",
                height: 12,
                background: "#E5E7EB",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: GREEN,
                  borderRadius: 999,
                  transition: "0.3s",
                }}
              />
            </div>
          </div>
        )}

        {/* QUEUE TITLE */}

        {rows.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "24px 0 16px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: GREEN,
              }}
            >
              Upload Queue
            </h2>

            <div
              style={{
                background: "#DCFCE7",
                color: GREEN,
                padding: "8px 14px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {rows.length} Cakes Ready
            </div>
          </div>
        )}

        {/* SMART PREVIEW TABLE */}

{rows.length > 0 && (
  <div
    style={{
      background: "#fff",
      borderRadius: 18,
      padding: 18,
      marginBottom: 20,
      overflowX: "auto",
    }}
  >
    <h3 style={{ marginTop: 0, color: GREEN }}>
      Name Preview
    </h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr style={{ background: "#F3F4F6" }}>
          <th style={th}>Preview</th>
          <th style={th}>Code</th>
          <th style={th}>Cake Name</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td style={td}>
              <img
                src={r.preview}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 10,
                  objectFit: "cover",
                }}
              />
            </td>

            <td style={td}>
              <strong>{r.code}</strong>
            </td>

            <td style={td}>
              <input
                value={r.name}
                onChange={(e) =>
                  updateRow(r.id, "name", e.target.value)
                }
                className="input"
                style={{ margin: 0 }}
              />
              {isDuplicateName(r.name, r.id) && (
  <div
    style={{
      marginTop: 6,
      color: "#DC2626",
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    ⚠ Duplicate cake name
  </div>
)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        {/* GRID START */}

        <div className="cakeGrid">
          {rows.map((r) => (
            <div key={r.id} className="cakeCard">
              <div className="imageWrap">
                <img
                  src={r.preview}
                  alt=""
                  className="cakeImage"
                />

                <div className="codeBadge">
                  {r.code}
                </div>
              </div>

              <div style={{ padding: 12 }}>
                <input
                  placeholder="Cake Name"
                  value={r.name}
                  onChange={(e) =>
                    updateRow(r.id, "name", e.target.value)
                  }
                  className="input"
                />

                <div className="twoCol">
                  <input
                    type="number"
                    placeholder="₹ Price"
                    value={r.startingPrice || ""}
                    onChange={(e) =>
                      updateRow(
                        r.id,
                        "startingPrice",
                        Number(e.target.value)
                      )
                    }
                    className="input"
                  />

                  <select
  value={r.minWeight}
  onChange={(e) => {
  const weight = e.target.value;

  setRows((prev) =>
    prev.map((row) =>
      row.id === r.id
        ? {
            ...row,
            minWeight: weight,
            serving: getServingByWeight(weight),
          }
        : row
    )
  );
}}
  className="input"
>
  <option value="Bento (150–200gm)">
    Bento (150–200gm)
  </option>
  <option value="300gm">300gm</option>
  <option value="500gm">500gm</option>
  <option value="1kg">1kg</option>
  <option value="1.2kg">1.2kg</option>
  <option value="1.5kg">1.5kg</option>
  <option value="2kg">2kg</option>
  <option value="2.5kg">2.5kg</option>
  <option value="3kg">3kg</option>
</select>
                </div>

                <input
  value={r.serving}
  readOnly
  className="input"
  style={{
    background: "#F9FAFB",
    color: "#374151",
    fontWeight: 600,
  }}
/>
                                {/* CATEGORIES */}

                <div style={{ marginTop: 12 }}>
                  <p className="label">Categories</p>

                  <div className="chipWrap">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() =>
                          updateRow(
                            r.id,
                            "categories",
                            r.categories.includes(cat.name)
                              ? r.categories.filter((x) => x !== cat.name)
                              : [...r.categories, cat.name]
                          )
                        }
                        className={
                          r.categories.includes(cat.name)
                            ? "chipActive"
                            : "chip"
                        }
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SUB CATEGORIES */}

                <div style={{ marginTop: 12 }}>
                  <p className="label">Sub Categories</p>

                  <div className="chipWrap">
                    {categories
                      .filter((c) => r.categories.includes(c.name))
                      .flatMap((c) => c.subs)
                      .map((sub) => (
                        <button
                          key={sub}
                          onClick={() =>
                            updateRow(
                              r.id,
                              "subCategories",
                              r.subCategories.includes(sub)
                                ? r.subCategories.filter((x) => x !== sub)
                                : [...r.subCategories, sub]
                            )
                          }
                          className={
                            r.subCategories.includes(sub)
                              ? "chipActive"
                              : "chip"
                          }
                        >
                          {sub}
                        </button>
                      ))}
                  </div>
                </div>

                {/* FLAVOURS */}

                <div style={{ marginTop: 12 }}>
                  <p className="label">Flavours</p>

                  <div className="chipWrap">
                    {flavours.map((f) => (
                      <button
                        key={f.id}
                        onClick={() =>
                          updateRow(
                            r.id,
                            "flavours",
                            r.flavours.includes(f.name)
                              ? r.flavours.filter((x) => x !== f.name)
                              : [...r.flavours, f.name]
                          )
                        }
                        className={
                          r.flavours.includes(f.name)
                            ? "chipActive"
                            : "chip"
                        }
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>


                {/* ACTION BUTTONS */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginTop: 14,
                  }}
                >
                  <button
                    onClick={() => copyPrevious(r.id)}
                    className="copyBtn"
                  >
                    <Copy size={15} />
                    Copy Prev
                  </button>

                  <button
                    onClick={() => deleteRow(r.id)}
                    className="deleteBtn"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
                {/* FLOATING UPLOAD BUTTON */}

        {rows.length > 0 && (
            <button
              onClick={uploadAll}
              disabled={uploading || rows.length === 0}
              style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              background: GREEN,
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "16px 22px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,.25)",
              zIndex: 100,
            }}
          >
            <CheckCircle size={20} />
            {uploading
              ? `Uploading ${progress}%`
              : `Upload ${rows.length} Cakes`}
          </button>
        )}

      </div>

      {/* CSS */}

      <style jsx>{`
        .cakeGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .cakeCard {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }

        .imageWrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .cakeImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .codeBadge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: bold;
        }

        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          margin-top: 8px;
          font-size: 14px;
        }

        .twoCol {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 8px;
        }

        .label {
          font-size: 12px;
          font-weight: 700;
          color: #4b5563;
          margin-bottom: 6px;
        }

        .chipWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip,
        .chipActive {
          border: none;
          padding: 7px 12px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .chip {
          background: #f3f4f6;
          color: #374151;
        }

        .chipActive {
          background: #5e8f34;
          color: white;
        }

        .copyBtn,
        .deleteBtn {
          border: none;
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-weight: 700;
        }

         th {
  text-align: left;
  padding: 12px;
  font-size: 13px;
  color: #374151;
}

td {
  padding: 10px;
  border-top: 1px solid #f3f4f6;
}

        .copyBtn {
          background: #f3f4f6;
          color: #374151;
        }

        .deleteBtn {
          background: #fee2e2;
          color: #dc2626;
        }

        @media (min-width: 900px) {
          .cakeGrid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </main>
  );
}