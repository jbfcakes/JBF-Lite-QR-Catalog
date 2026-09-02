"use client";

import Link from "next/link";
import Image from "next/image";
import {toggleShortlist, isShortlisted, getShortlistCount, getShortlist } from "../lib/shortlist";
import { useEffect, useMemo, useState, useRef } from "react";
import { getAllCakes, getBanners, getCategories } from "../lib/getData";
import { getVisitorByMobile, createVisitor, updateVisitor, addViewedCake, addWhatsappClick, addVisitSeconds } from "../lib/visitors";
import { useRouter } from "next/navigation";
import { House, Grid2x2, Search, Cake, Gift, Heart } from "lucide-react";

const GREEN = "#5E8F34";
const GREY = "#6B7280";
const BG = "#F8F8F6";
const WA = "919875338544";
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("birthday")) return <Cake size={28} color={GREEN} />;
  if (n.includes("wedding")) return <Heart size={28} color={GREEN} />;
  if (n.includes("theme")) return <Gift size={28} color={GREEN} />;
  if (n.includes("photo")) return <Grid2x2 size={28} color={GREEN} />;

  return <Cake size={28} color={GREEN} />;
};

/* =========================
   MAIN CATEGORIES
========================= *

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
  const router = useRouter();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const birthdaySubs = useMemo(() => {
  const birthday = categories.find((c: any) => c.name?.toLowerCase() === "birthday"); return birthday?.subs || [];}, [categories]);
  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState<"home" | "subcategory" | "gallery" >("home");

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [showGate, setShowGate] = useState(false);

  const [visitorName, setVisitorName] = useState("");
  const [visitorMobile, setVisitorMobile] = useState("");
  const [visitorWhatsapp, setVisitorWhatsapp] = useState("");

  const [shortlistCount, setShortlistCount] = useState(0);
  const homeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [showTop, setShowTop] = useState(false);
  const [showShortlist, setShowShortlist] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [cakeSize, setCakeSize] = useState("");
  const [applyToAll, setApplyToAll] = useState(true);

  const [commonForm, setCommonForm] = useState({ flavour: "", weight: "500gm", deliveryType: "Pickup", date: "", time: "", message: "", instruction: "",});
  const [shortlist, setShortlist] = useState(getShortlist()); 

  const [savingVisitor, setSavingVisitor] = useState(false); useEffect(() => { loadCakes(); setShortlistCount(getShortlistCount()); loadBanners(); loadCategories();}, []);
  const [enterTime] = useState(Date.now()); useEffect(() => {
  const id = localStorage.getItem("jbf_visitor");

  if (!id) {
    setShowGate(true);
  }
  }, []);

useEffect(() => {
  const onScroll = () => {
    setShowTop(window.scrollY > 800);
  };

  window.addEventListener("scroll", onScroll);

  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}, []);

useEffect(() => {
  const saveTime = async () => {
    const id = localStorage.getItem("jbf_visitor");

    if (!id) return;

    const seconds = Math.floor(
      (Date.now() - enterTime) / 1000
    );

    if (seconds > 5) {
      await addVisitSeconds(id, seconds);
    }
  };

  window.addEventListener("beforeunload", saveTime);

  return () => {
    saveTime();
    window.removeEventListener("beforeunload", saveTime);
  };
}, [enterTime]);
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

  setCategories(
    data.map((c: any) => ({
      ...c,
      name: c.name || c.title || "",
      subs: c.subs || [],
    }))
  );
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
const visitor = localStorage.getItem("jbf_visitor");

if (visitor) {
  addWhatsappClick(visitor);
}
    window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

function handleShortlist(cake: Cake) {
  toggleShortlist({
    code: cake.code,
    name: cake.name,
    image: cake.images[0],
    price: cake.startingPrice,
  });

  const items = getShortlist();

  setShortlist(items);
  setShortlistCount(items.length);
}

  return (
    <main
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "JBF, sans-serif",
        paddingBottom: 90,
      }}
    >
      {showGate && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(248,248,246,.98)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 24,
        padding: 28,
        boxShadow: "0 10px 30px rgba(0,0,0,.10)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Image
          src="/logo.jpeg"
          alt="JBF"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />

        <h1
          style={{
            color: GREEN,
            marginTop: 14,
            marginBottom: 4,
          }}
        >
          Welcome to JBF Cakes
        </h1>

        <p
          style={{
            color: GREY,
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          Please enter your details to continue
        </p>
      </div>

      <input
        placeholder="Full Name"
        value={visitorName}
        onChange={(e) =>
          setVisitorName(e.target.value)
        }
        style={gateInput}
      />

      <input
        placeholder="Mobile Number"
        maxLength={10}
        value={visitorMobile}
        onChange={(e) =>
          setVisitorMobile(
            e.target.value.replace(/\D/g, "")
          )
        }
        style={gateInput}
      />

      <input
        placeholder="WhatsApp Number"
        maxLength={10}
        value={visitorWhatsapp}
        onChange={(e) =>
          setVisitorWhatsapp(
            e.target.value.replace(/\D/g, "")
          )
        }
        style={gateInput}
      />

      <button
        disabled={savingVisitor}
        onClick={async () => {
          if (!visitorName.trim()) {
            alert("Enter your name");
            return;
          }

          if (!/^[6-9]\d{9}$/.test(visitorMobile)) {
            alert("Enter valid mobile number");
            return;
          }

          setSavingVisitor(true);

          const old = await getVisitorByMobile(
            visitorMobile
          );

          if (old) {
            await updateVisitor(old.id!, {
              name: visitorName,
              whatsapp: visitorWhatsapp,
            });

            localStorage.setItem(
              "jbf_visitor",
              old.id!
            );
          } else {
            const id = await createVisitor({
              name: visitorName,
              mobile: visitorMobile,
              whatsapp: visitorWhatsapp,
              totalSeconds: 0,
              viewedCakes: [],
              whatsappClicks: 0,
            });

            localStorage.setItem(
              "jbf_visitor",
              id
            );
          }

          setShowGate(false);
          setSavingVisitor(false);
        }}
        style={{
          width: "100%",
          marginTop: 16,
          padding: 15,
          border: "none",
          borderRadius: 14,
          background: GREEN,
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        {savingVisitor
          ? "Please wait..."
          : "Continue to Catalog"}
      </button>

      <p
        style={{
          textAlign: "center",
          color: "#9CA3AF",
          fontSize: 11,
          marginTop: 12,
        }}
      >
        Your details are used only for order assistance.
      </p>
    </div>
  </div>
)}
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
            <div
            ref={homeRef}
            style={{ textAlign: "center", marginTop: 5 }}>
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
             {banners.length > 0 && banners[bannerIndex]?.image && (
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
                ref={searchRef}
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
                ref={categoryRef}
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
    setSelectedMain(cat.name.toLowerCase());

    if (cat.name.toLowerCase() === "birthday") {
      setScreen("subcategory");
    } else {
      setSelectedSub(cat.name);
      setScreen("gallery");
    }
  }}
  style={{
    background: "#fff",
    borderRadius: 20,
    padding: 18,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
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
      {getCategoryIcon(cat.name || cat.title)}
    </div>

    <h3 style={{ margin: 0, color: GREEN, fontSize: 17 }}>
      {cat.name || cat.title}
    </h3>
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
                    style={{
  background: isShortlisted(cake.code) ? "#EEF8E9" : "#fff",
  borderRadius: 20,
  overflow: "hidden",
  border: isShortlisted(cake.code)
    ? "2px solid #5E8F34"
    : "1px solid #E5E7EB",
  boxShadow: isShortlisted(cake.code)
    ? "0 8px 20px rgba(94,143,52,.18)"
    : "0 8px 18px rgba(0,0,0,.06)",
  transition: "all .25s ease",
}}
                  >
                    <div
                      onClick={() => {
  const visitor = localStorage.getItem("jbf_visitor");

  if (visitor) {
    addViewedCake(visitor, cake.code);
  }

  setSelectedIndex(list.indexOf(cake));
}}
                      style={{
                        position:"relative",
                        width:"100%",
                        aspectRatio:"1/1",
                        cursor:"pointer",
                      }}
                    >

<div
  style={{
    position: "absolute",
    top: 10,
    left: 10,
    background: "#5E8F34",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    zIndex: 2,
  }}
>
  {cake.code}
</div>

                      <Image
                        src={cake.images[0]}
                        alt={cake.code}
                        fill
                        style={{ objectFit:"cover" }}
                      />
                    </div>

                    <div style={{ padding: 12 }}>
  <div
    style={{
      fontSize: 13,
      fontWeight: 600,
      color: "#1F2937",
      marginBottom: 8,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {cake.name}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    }}
  >
    <div>
      <div
        style={{
          fontSize: 10,
          color: "#6B7280",
        }}
      >
        Starting from
      </div>

      <div
        style={{
          color: GREEN,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        ₹{cake.startingPrice}
      </div>
    </div>

    <button
      onClick={() => handleShortlist(cake)}
      style={{
        border: "none",
        borderRadius: 999,
        padding: "8px 12px",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 12,
        background: isShortlisted(cake.code)
          ? GREEN
          : "#E8F3DD",
        color: isShortlisted(cake.code)
          ? "#fff"
          : "#2F5D1A",
      }}
    >
      {isShortlisted(cake.code)
  ? "❤ Shortlisted"
  : "♡ Shortlist"}
    </button>
  </div>
</div>
                  </div>
                ))}
            </div>
          </>
        )}
        </div>
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
  onClick={() => handleShortlist(list[selectedIndex])}
  style={{
    width: "100%",
    marginTop: 24,
    background: isShortlisted(list[selectedIndex].code)
      ? GREEN
      : "#EEF8E9",
    color: isShortlisted(list[selectedIndex].code)
      ? "#fff"
      : GREEN,
    border: `1px solid ${GREEN}`,
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .25s ease",
  }}
>
  {isShortlisted(list[selectedIndex].code)
    ? "❤ Shortlisted"
    : "♡ Shortlist"}
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
      background: isShortlisted(cake.code) ? "#EEF8E9" : "#fff",
      borderRadius: 14,
      overflow: "hidden",
      cursor: "pointer",
      border: isShortlisted(cake.code)
        ? `2px solid ${GREEN}`
        : "1px solid #E5E7EB",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      <Image
        src={cake.images[0]}
        alt={cake.code}
        fill
        style={{ objectFit: "cover" }}
      />

      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: GREEN,
          color: "#fff",
          padding: "4px 8px",
          borderRadius: 999,
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        {cake.code}
      </div>
    </div>

    <div style={{ padding: 8 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 6,
        }}
      >
        {cake.name}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 8,
              color: "#6B7280",
            }}
          >
            Starting from
          </div>

          <div
            style={{
              color: GREEN,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            ₹{cake.startingPrice}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShortlist(cake);
          }}
          style={{
            border: "none",
            borderRadius: 999,
            padding: "6px 8px",
            fontSize: 9,
            fontWeight: 700,
            cursor: "pointer",
            background: isShortlisted(cake.code)
              ? GREEN
              : "#E8F3DD",
            color: isShortlisted(cake.code)
              ? "#fff"
              : "#2F5D1A",
          }}
        >
          {isShortlisted(cake.code)
            ? "❤ Shortlisted"
            : "♡ Shortlist"}
        </button>
      </div>
    </div>
  </div>
))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHORTLIST DRAWER */}
{showShortlist && (
  <div
    onClick={() => setShowShortlist(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      zIndex: 120,
      display: "flex",
      alignItems: "flex-end",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxHeight: "78vh",
        background: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 18,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: 55,
          height: 5,
          background: "#D1D5DB",
          borderRadius: 999,
          margin: "0 auto 16px",
        }}
      />

      <h2 style={{ margin: 0, color: GREEN }}>
        Shortlisted Designs ({shortlist.length})
      </h2>

      <p style={{ color: GREY, marginTop: 6 }}>
        Review your selected cake designs
      </p>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
    gap: 12,
    marginTop: 16,
  }}
>
  {shortlist.map((item) => (
    <div
      key={item.code}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "5 / 5"
        }}
      >
        <Image
          src={item.image}
          alt={item.code}
          fill
          style={{ objectFit: "cover" }}
        />

        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: GREEN,
            color: "#fff",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {item.code}
        </div>
      </div>

      <div style={{ padding: 10 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </div>

        <div
          style={{
            color: GREEN,
            fontWeight: 700,
            marginTop: 4,
            fontSize: 15,
          }}
        >
          ₹{item.price}
        </div>

        <button
          onClick={() => {
            const updated = shortlist.filter(
              (x) => x.code !== item.code
            );

            localStorage.setItem(
              "jbf_shortlist",
              JSON.stringify(updated)
            );

            setShortlist(updated);
            setShortlistCount(updated.length);
          }}
          style={{
            width: "100%",
            marginTop: 8,
            background: "#FEE2E2",
            color: "#DC2626",
            border: "none",
            borderRadius: 10,
            padding: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</div>

      <button
  onClick={() => {
  setShowShortlist(false);
  router.push("/enquiry");
}}
  style={{
    width: "100%",
    marginTop: 18,
    background: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: 15,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  }}
>
  Continue Enquiry
</button>
    </div>
  </div>
)}

{/* ENQUIRY DRAWER */}

{showEnquiry && (
  <div
    onClick={() => setShowEnquiry(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      zIndex: 130,
      display: "flex",
      alignItems: "flex-end",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxHeight: "88vh",
        overflowY: "auto",
        background: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 18,
      }}
    >
      <div
        style={{
          width: 55,
          height: 5,
          background: "#D1D5DB",
          borderRadius: 999,
          margin: "0 auto 14px",
        }}
      />

      <h2 style={{ margin: 0, color: GREEN }}>
        Cake Enquiry
      </h2>

      <p style={{ color: GREY }}>
        {shortlist.length} shortlisted designs
      </p>

      {/* STEP 1 - CAKE SIZE */}

<div
  style={{
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    border: "1px solid #E5E7EB",
  }}
>
  <h3
    style={{
      margin: "0 0 14px",
      fontSize: 18,
      color: "#111827",
    }}
  >
    Choose your cake size
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: 10,
    }}
  >
    {[
      "Bento (150–200gm)",
      "300gm",
      "500gm",
      "1kg",
      "1.2kg",
      "1.5kg",
      "2kg",
      "2.5kg",
      "3kg",
    ].map((size) => (
      <button
        key={size}
        onClick={() => setCakeSize(size)}
        style={{
          border:
            cakeSize === size
              ? `2px solid ${GREEN}`
              : "1px solid #D1D5DB",
          background:
            cakeSize === size ? "#EEF8E9" : "#fff",
          color:
            cakeSize === size ? GREEN : "#374151",
          borderRadius: 12,
          padding: "12px 10px",
          fontWeight: 700,
          cursor: "pointer",
          transition: ".2s",
        }}
      >
        {size}
      </button>
    ))}
  </div>
</div>

      {/* APPLY MODE */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          margin: "18px 0",
        }}
      >
        <button
          onClick={() => setApplyToAll(true)}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            background: applyToAll ? GREEN : "#EEF2F7",
            color: applyToAll ? "#fff" : "#374151",
          }}
        >
          Apply to All
        </button>

        <button
          onClick={() => setApplyToAll(false)}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            background: !applyToAll ? GREEN : "#EEF2F7",
            color: !applyToAll ? "#fff" : "#374151",
          }}
        >
          Individual
        </button>
      </div>

      <input
        placeholder="Flavour"
        value={commonForm.flavour}
        onChange={(e) =>
          setCommonForm({
            ...commonForm,
            flavour: e.target.value,
          })
        }
        className="input"
      />

      <select
        value={commonForm.weight}
        onChange={(e) =>
          setCommonForm({
            ...commonForm,
            weight: e.target.value,
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <input
          type="date"
          value={commonForm.date}
          onChange={(e) =>
            setCommonForm({
              ...commonForm,
              date: e.target.value,
            })
          }
          className="input"
        />

        <input
          type="time"
          value={commonForm.time}
          onChange={(e) =>
            setCommonForm({
              ...commonForm,
              time: e.target.value,
            })
          }
          className="input"
        />
      </div>

      <select
        value={commonForm.deliveryType}
        onChange={(e) =>
          setCommonForm({
            ...commonForm,
            deliveryType: e.target.value,
          })
        }
        className="input"
      >
        <option>Pickup</option>
        <option>Delivery</option>
      </select>

      <textarea
        rows={3}
        placeholder="Message on Cake"
        value={commonForm.message}
        onChange={(e) =>
          setCommonForm({
            ...commonForm,
            message: e.target.value,
          })
        }
        className="input"
      />

      <textarea
        rows={3}
        placeholder="Special Instruction (Optional)"
        value={commonForm.instruction}
        onChange={(e) =>
          setCommonForm({
            ...commonForm,
            instruction: e.target.value,
          })
        }
        className="input"
      />

      <button
        style={{
          width: "100%",
          marginTop: 18,
          background: GREEN,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        Next →
      </button>
    </div>
  </div>
)}

      {/* FLOATING SHORTLIST */}
{shortlistCount > 0 && (
  <button
    onClick={() => {
  setShortlist(getShortlist());
  setShowShortlist(true);
}}
    style={{
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: 78,
      width: "calc(100% - 32px)",
      maxWidth: 420,
      background: GREEN,
      color: "#fff",
      border: "none",
      borderRadius: 16,
      padding: "15px 18px",
      fontSize: 16,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 10px 25px rgba(0,0,0,.18)",
      zIndex: 55,
    }}
  >
    ✓ Shortlisted ({shortlistCount})
  </button>
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
    zIndex: 50,
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
  onClick={() => {
    setScreen("home");

    setTimeout(() => {
      homeRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <House size={22} color={GREEN} />
      <span style={{ fontSize: 11, color: GREEN }}>Home</span>
    </div>

    <div
  onClick={() => {
    setScreen("home");

    setTimeout(() => {
      categoryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }}
  style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid2x2 size={22} color={GREY} />
      <span style={{ fontSize: 11, color: GREY }}>Category</span>
    </div>

    <div
  onClick={() => {
    setScreen("home");

    setTimeout(() => {
      searchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      searchRef.current?.focus();
    }, 150);
  }}
  style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Search size={22} color={GREY} />
      <span style={{ fontSize: 11, color: GREY }}>Search</span>
       </div>
  </div>
</div>
<style jsx>{`
  .shortlistBtn {
    width: 100%;
    background: #fff;
    color: #5E8F34;
    border: 1px solid #5E8F34;
    border-radius: 12px;
    padding: 12px;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 8px;
  }

  .shortlistActive {
    width: 100%;
    background: #5E8F34;
    color: #fff;
    border: 1px solid #5E8F34;
    border-radius: 12px;
    padding: 12px;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 8px;
  }
`}</style>

<div
  style={{
    textAlign: "center",
    padding: "48px 20px 110px",
    background: "#F8F8F6",
  }}
>
  <div
    style={{
      fontSize: 40,
      fontWeight: 800,
      color: GREEN,
      lineHeight: 1.05,
      letterSpacing: 1,
    }}
  >
    YOU
  </div>

  <div
    style={{
      fontSize: 40,
      fontWeight: 800,
      color: GREEN,
      lineHeight: 1.05,
      letterSpacing: 1,
      marginTop: 4,
    }}
  >
    DESERVE
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    }}
  >
    <span
      style={{
        fontSize: 40,
        fontWeight: 800,
        color: GREEN,
        lineHeight: 1.05,
        letterSpacing: 1,
      }}
    >
      WOW
    </span>

    <Heart size={34} fill={GREEN} color={GREEN} strokeWidth={2} />
  </div>
</div>

</main>
);
}
const gateInput = {
  width: "100%",
  padding: 14,
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  marginBottom: 12,
  fontSize: 15,
  outline: "none",
};
