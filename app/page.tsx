"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getAllCakes, getBanners, getCategories } from "../lib/getData";
import {
  House,
  Grid2x2,
  Search,
  Cake,
  Gift,
  Heart,
} from "lucide-react";

const GREEN = "#5E8F34";
const GREY = "#6B7280";
const BG = "#F8F8F6";
const WA = "919875338544";

/* =========================
   MAIN CATEGORIES
========================= */

const homeCategories = [
  {
    id: "birthday",
    title: "Birthday",
    icon: "birthday",
    subtitle: "Boy • Girl • Men • Women • Kids",
  },
  {
    id: "new",
    title: "New Collection",
    icon: "new",
    subtitle: "Latest Cake Designs",
  },
  {
    id: "wedding",
    title: "Wedding",
    icon: "wedding",
    subtitle: "Reception & Engagement",
  },
  {
    id: "theme",
    title: "Theme Cake",
    icon: "theme",
    subtitle: "Cartoon • Sports • Anime",
  },
  {
    id: "photo",
    title: "Photo Cake",
    icon: "photo",
    subtitle: "Edible Photo Print",
  },
  {
    id: "trending",
    title: "Trending",
    icon: "trending",
    subtitle: "Most Ordered Designs",
  },
];

/* =========================
   SUB CATEGORIES
========================= */

/* =========================
   CAKES
========================= */

type Cake = {
  id?: string;
  code: string;
  name: string;
  images: string[];
  categories: string[];
  startingPrice: number;
  startingSize: string;
  flavours: string[];
};


/* =========================
   PAGE
========================= */

export default function Home() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const birthdaySubs = useMemo(() => {
  const birthday = categories.find(
    (c: any) => c.title?.toLowerCase() === "birthday"
  );

  return birthday?.subs || [];
}, [categories]);
  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState<"home" | "subcategory" | "gallery">(
    "home"
  );

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);

useEffect(() => {
  loadCakes();
  loadBanners();
  loadCategories();
}, []);

useEffect(() => {
  if (banners.length === 0) return;

  const timer = setInterval(() => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  }, 3500);

  return () => clearInterval(timer);
}, [banners]);

async function loadCakes() {
  const data = await getAllCakes();
  setCakes(data as Cake[]);
}

async function loadBanners() {
  const data = await getBanners();
  setBanners(data);
}
async function loadCategories() {
  const data = await getCategories();
  setCategories(data);
}

  const list = useMemo(() => {
    if (selectedSub === "") return cakes;

    return cakes.filter((cake) =>
      cake.categories.includes(selectedSub)
    );
}, [selectedSub, cakes]);
    const share = (cake: (typeof cakes)[0]) => {
    const text = `JBF CAKES

Cake Code : ${cake.code}

Available Flavours:
${cake.flavours.join(", ")}

Please share price & weight.`;

    window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <main
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "JBF, sans-serif",
        paddingBottom: 90,
      }}
    >
      {/* HEADER */}
<div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#FFFFFF",
    borderBottom: "1px solid #F1F1F1",
  }}
>
  <div
    style={{
      maxWidth: 900,
      margin: "0 auto",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image
      src="/logo.jpeg"
      alt="JBF Cakes"
      width={60}
      height={60}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  </div>
</div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 16,
        }}
      >
        {/* HERO */}
        {screen === "home" && (
          <>
            <div style={{ textAlign: "center", marginTop: 5 }}>
              <h1
                style={{
                  color: GREEN,
                  fontSize: 20,
                  marginBottom: 4,
                }}
              >
                Made with Love • Premium Bakery
              </h1>
            </div>

            <div
              style={{
                marginTop: 20,
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
              }}
            >
             {banners.length > 0 && (
  <Image
    src={banners[bannerIndex].image}
    alt="Banner"
    width={900}
    height={420}
    style={{
      width: "100%",
      height: "auto",
      objectFit: "cover",
    }}
  />
)}
            </div>

            {/* SEARCH */}
            <div
              style={{
                marginTop: 20,
                background: "#fff",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 4px 12px rgba(0,0,0,.05)",
              }}
            >
              <input
                placeholder="Search Cake Code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: 16,
                  background: "transparent",
                }}
              />
            </div>

            {/* CATEGORY TITLE */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 28,
                marginBottom: 14,
              }}
            >
              <h2 style={{ color: GREEN, margin: 0 }}>Categories</h2>

              <span style={{ color: GREY, fontSize: 14 }}>
                Premium Collection
              </span>
            </div>

            {/* CATEGORY GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(170px,1fr))",
                gap: 14,
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === "birthday") {
                      setSelectedMain(cat.id);
                      setScreen("subcategory");
                    } else {
                      setSelectedSub(cat.title);
                      setScreen("gallery");
                    }
                  }}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 18,
                    cursor: "pointer",
                    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
                    transition: ".25s",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: "#EEF6E7",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Image
                      src={`/icons/${cat.icon}.png`}
                      alt={cat.title}
                      width={28}
                      height={28}
                    />
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: GREEN,
                      fontSize: 17,
                    }}
                  >
                    {cat.title}
                  </h3>

                  <p
                    style={{
                      marginTop: 8,
                      color: GREY,
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {cat.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
                {/* SUB CATEGORY SCREEN */}
        {screen === "subcategory" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
              <button
                onClick={() => setScreen("home")}
                style={{
                  width:42, height:42, borderRadius:"50%",
                  border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer"
                }}
              >
                ←
              </button>

              <div>
                <h2 style={{ margin:0, color:GREEN }}>Birthday Cakes</h2>
                <p style={{ margin:"4px 0 0", color:GREY, fontSize:13 }}>
                  Choose your collection
                </p>
              </div>
            </div>

            <div
              style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",
                gap:14,
                marginTop:22,
              }}
            >
              {birthdaySubs.map((sub: string) => (
                <div
                  key={sub}
                  onClick={() => {
                    setSelectedSub(sub);
                    setScreen("gallery");
                  }}
                  style={{
                    background:"#fff",
                    borderRadius:18,
                    padding:18,
                    cursor:"pointer",
                    boxShadow:"0 5px 14px rgba(0,0,0,.05)",
                  }}
                >
                  <div
                    style={{
                      width:48,
                      height:48,
                      borderRadius:14,
                      background:"#EEF6E7",
                      display:"grid",
                      placeItems:"center",
                      marginBottom:12,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" stroke={GREEN} strokeWidth="1.8"/>
                      <path d="M5 19C6.5 15.8 9 14.5 12 14.5C15 14.5 17.5 15.8 19 19"
                        stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>

                  <h3 style={{ margin:0, color:GREEN, fontSize:16 }}>{sub}</h3>

                  <p style={{ marginTop:8, color:GREY, fontSize:12 }}>
                    Premium Designs
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* GALLERY */}
        {screen === "gallery" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
              <button
                onClick={() =>
                  selectedMain === "birthday"
                    ? setScreen("subcategory")
                    : setScreen("home")
                }
                style={{
                  width:42, height:42, borderRadius:"50%",
                  border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer"
                }}
              >
                ←
              </button>

              <div>
                <h2 style={{ margin:0, color:GREEN }}>{selectedSub}</h2>
                <p style={{ margin:"4px 0 0", color:GREY, fontSize:13 }}>
                  {list.length} Cake Designs
                </p>
              </div>
            </div>

            <div
              style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",
                gap:16,
                marginTop:22,
              }}
            >
              {list
                .filter((cake) =>
                  cake.code.toLowerCase().includes(search.toLowerCase())
                )
                .map((cake) => (
                  <div
                    key={cake.code}
                    style={{
                      background:"#fff",
                      borderRadius:20,
                      overflow:"hidden",
                      boxShadow:"0 8px 18px rgba(0,0,0,.06)",
                    }}
                  >
                    <div
                      onClick={() => setSelectedIndex(list.indexOf(cake))}
                      style={{
                        position:"relative",
                        width:"100%",
                        aspectRatio:"1/1",
                        cursor:"pointer",
                      }}
                    >
                      <Image
                        src={cake.images[0]}
                        alt={cake.code}
                        fill
                        style={{ objectFit:"cover" }}
                      />
                    </div>

                    <div style={{ padding:14 }}>
                      <h3
                        style={{
                          margin:0,
                          textAlign:"center",
                          color:GREEN,
                          letterSpacing:1,
                        }}
                      >
                        {cake.code}
                      </h3>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        </div>   //
              {/* FULL SCREEN DETAIL */}
      {selectedIndex !== null && (
        <div
          onClick={() => setSelectedIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            zIndex: 100,
            overflowY: "auto",
            padding: 18,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 700,
              margin: "20px auto",
              background: "#fff",
              borderRadius: 24,
              padding: 18,
            }}
          >
            {/* IMAGE SWIPE */}
            <div
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const end = e.changedTouches[0].clientX;

                if (touchStart - end > 50 && selectedIndex < list.length - 1)
                  setSelectedIndex(selectedIndex + 1);

                if (end - touchStart > 50 && selectedIndex > 0)
                  setSelectedIndex(selectedIndex - 1);
              }}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 20,
                overflow: "hidden",
                background: "#F5F5F5",
              }}
            >
              <Image
                src={list[selectedIndex].images[0]}
                alt={list[selectedIndex].code}
                fill
                style={{ objectFit: "contain" }}
              />

              {selectedIndex > 0 && (
                <button
                  onClick={() => setSelectedIndex(selectedIndex - 1)}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,.92)",
                    cursor: "pointer",
                    fontSize: 22,
                  }}
                >
                  ‹
                </button>
              )}

              {selectedIndex < list.length - 1 && (
                <button
                  onClick={() => setSelectedIndex(selectedIndex + 1)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,.92)",
                    cursor: "pointer",
                    fontSize: 22,
                  }}
                >
                  ›
                </button>
              )}
            </div>

            {/* DETAILS */}
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#EEF6E7",
                  color: GREEN,
                  padding: "7px 14px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                {list[selectedIndex].code}
              </div>

              <h2 style={{ margin: "12px 0 6px", color: GREEN }}>
                {list[selectedIndex].name}
              </h2>

              <p style={{ color: GREY, margin: 0 }}>Starting From</p>

              <h1 style={{ margin: "4px 0", color: GREEN }}>
                ₹{list[selectedIndex].startingPrice}
              </h1>

              <p style={{ color: GREY }}>
                Starting Size : {list[selectedIndex].startingSize}
              </p>

              {/* FLAVOURS */}
              <h3 style={{ color: GREEN, marginTop: 22 }}>
                Available Flavours
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {list[selectedIndex].flavours.map((f) => (
                  <div
                    key={f}
                    style={{
                      background: "#F3F4F6",
                      padding: "8px 14px",
                      borderRadius: 999,
                      color: GREY,
                      fontSize: 13,
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>

              {/* SHARE */}
              <button
                onClick={() => share(list[selectedIndex])}
                style={{
                  width: "100%",
                  marginTop: 24,
                  background: GREEN,
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  padding: 15,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Share on WhatsApp
              </button>

              {/* MORE DESIGNS */}
              <h3 style={{ color: GREEN, marginTop: 28 }}>
                More Cake Designs
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                {list.map((cake, i) => (
                  <div
                    key={cake.code}
                    onClick={() => setSelectedIndex(i)}
                    style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        i === selectedIndex
                          ? `2px solid ${GREEN}`
                          : "1px solid #E5E7EB",
                    }}
                  >
                    <Image
                      src={cake.images[0]}
                      alt={cake.code}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #ECECEC",
          padding: "10px 0",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div
            onClick={() => setScreen("home")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
           {/* FOOTER */}
<div
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#fff",
    borderTop: "1px solid #ECECEC",
    padding: "10px 0",
  }}
>
  <div
    style={{
      maxWidth: 900,
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-around",
    }}
  >
    <div
      onClick={() => setScreen("home")}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <House size={22} color={GREEN} strokeWidth={2.2} />
      <span style={{ fontSize: 11, color: GREEN }}>Home</span>
    </div>

    <div
      onClick={() => setScreen("home")}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Grid2x2 size={22} color={GREY} strokeWidth={2.2} />
      <span style={{ fontSize: 11, color: GREY }}>Category</span>
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Search size={22} color={GREY} strokeWidth={2.2} />
      <span style={{ fontSize: 11, color: GREY }}>Search</span>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </main>
  );
}