"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, MapPin } from "lucide-react";

const GREEN = "#5E8F34";
const GREY = "#6B7280";

const SIZE_GUIDE = [
  { weight: "Bento (150–200gm)", serving: "2–4 Persons" },
  { weight: "300gm", serving: "4–6 Persons" },
  { weight: "500gm", serving: "8–10 Persons" },
  { weight: "1kg", serving: "18–20 Persons" },
  { weight: "1.2kg", serving: "24–26 Persons" },
  { weight: "1.5kg", serving: "28–30 Persons" },
  { weight: "2kg", serving: "38–40 Persons" },
  { weight: "2.5kg", serving: "48–50 Persons" },
  { weight: "3kg", serving: "60–65 Persons" },
];

const FLAVOURS = [
  "Chocolate",
  "Vanilla",
  "Butterscotch",
  "Black Forest",
  "Strawberry",
  "Pineapple",
  "Red Velvet",
  "Blueberry",
];

const ADDONS = [
  { name: "Candles", price: 20 },
  { name: "Cake Topper", price: 80 },
  { name: "Greeting Card", price: 30 },
  { name: "Party Popper", price: 99 },
];

type ShortlistedCake = {
  code: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export default function EnquiryPage() {
  const [cakes, setCakes] = useState<ShortlistedCake[]>([]);

  const [showSteps, setShowSteps] = useState(false);
  const [step, setStep] = useState(1);

  const [size, setSize] = useState("");
  const [flavours, setFlavours] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [occasion, setOccasion] = useState("");

  const [mode, setMode] = useState<"Pickup" | "Delivery">("Pickup");
  const [time, setTime] = useState("");

  const [recipient, setRecipient] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");

  const [message, setMessage] = useState("");
  const [addons, setAddons] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("jbf_shortlist");

    if (data) {
      const parsed = JSON.parse(data).map((item: any) => ({
        ...item,
        quantity: item.quantity || 1,
      }));

      setCakes(parsed);
    }
  }, []);

  const totalAddon = useMemo(() => {
    return addons.reduce((sum, name) => {
      const found = ADDONS.find((a) => a.name === name);
      return sum + (found?.price || 0);
    }, 0);
  }, [addons]);

  const toggleFlavour = (name: string) => {
    setFlavours((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name]
    );
  };

  const toggleAddon = (name: string) => {
    setAddons((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name]
    );
  };

  const removeCake = (code: string) => {
    const updated = cakes.filter((c) => c.code !== code);
    setCakes(updated);
    localStorage.setItem("jbf_shortlist", JSON.stringify(updated));
  };

  const updateQty = (code: string, change: number) => {
    const updated = cakes.map((c) =>
      c.code === code
        ? {
            ...c,
            quantity: Math.max(1, c.quantity + change),
          }
        : c
    );

    setCakes(updated);
    localStorage.setItem("jbf_shortlist", JSON.stringify(updated));
  };

  const sendWhatsApp = () => {
    const designs = cakes
      .map((c) => `• ${c.code} × ${c.quantity}`)
      .join("\n");

    const text = `🎂 *Cake Enquiry*

${designs}

*Cake Size:* ${size}
*Flavour:* ${flavours.join(", ")}
*Occasion:* ${occasion}
*Date:* ${date}
*Time:* ${time}
*Mode:* ${mode}

${
  mode === "Delivery"
    ? `*Recipient:* ${recipient}
*Mobile:* ${mobile}
*Address:* ${address}`
    : ""
}

*Message:* ${message || "-"}

*Add-ons:* ${addons.join(", ") || "None"}`;

    window.open(
      `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #D1D5DB",
    fontSize: 14,
    outline: "none",
  };

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ color: GREY }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div style={{ marginBottom: 22 }}>
      <h3
        style={{
          marginBottom: 12,
          fontSize: 16,
          color: "#111827",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <main
  style={{
    minHeight: "100vh",
    background: "#F5F5F5",
    paddingBottom: showSteps ? 90 : 20,
  }}
>
  {/* Header */}
  <div
    style={{
      background: "#fff",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      position: "sticky",
      top: 0,
      zIndex: 20,
      borderBottom: "1px solid #E5E7EB",
    }}
  >
    <Link href="/">
      <ArrowLeft size={22} color="#111827" />
    </Link>

    <div>
      <h2 style={{ margin: 0, fontSize: 18 }}>
        Cake Enquiry
      </h2>
      <p
        style={{
          margin: 0,
          color: GREY,
          fontSize: 13,
        }}
      >
        JBF Cakes
      </p>
    </div>
  </div>

  <div style={{ padding: 16 }}>
    {/* SHORTLIST SCREEN */}
    {!showSteps && (
      <>
        <Section title="Your Shortlisted Designs">
          <p
            style={{
              color: GREY,
              marginTop: -6,
              marginBottom: 14,
            }}
          >
            {cakes.length} design(s) selected
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 12,
            }}
          >
            {cakes.map((cake) => (
              <div
                key={cake.code}
                style={{
                  background: "#fff",
                  border: `1px solid ${GREEN}`,
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                  }}
                >
                  <Image
                    src={cake.image}
                    alt={cake.code}
                    fill
                    style={{ objectFit: "cover" }}
                  />

                  {/* Code */}
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
                    {cake.code}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeCake(cake.code)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "none",
                      background: "#fff",
                      color: "#DC2626",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: 10 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {cake.name}
                  </div>

                  <div
                    style={{
                      color: GREEN,
                      fontWeight: 700,
                      fontSize: 13,
                      margin: "4px 0 10px",
                    }}
                  >
                    Starting from ₹{cake.price}
                  </div>

                  {/* Quantity */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #E5E7EB",
                      borderRadius: 999,
                      padding: "6px 8px",
                    }}
                  >
                    <button
                      onClick={() => updateQty(cake.code, -1)}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>

                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {cake.quantity}
                    </span>

                    <button
                      onClick={() => updateQty(cake.code, 1)}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: 18,
                        color: GREEN,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <button
          onClick={() => {
            setShowSteps(true);
            setStep(1);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          style={{
            width: "100%",
            background: GREEN,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: 16,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Continue Enquiry
        </button>
      </>
    )}

    {/* FORM START */}
    {showSteps && (
      <>
        {/* Progress Bar */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 700 }}>
              Step {step} of 4
            </span>

            <span
              style={{
                color: GREEN,
                fontWeight: 700,
              }}
            >
              {step}/4
            </span>
          </div>

          <div
            style={{
              height: 8,
              background: "#E5E7EB",
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: `${step * 25}%`,
                height: "100%",
                background: GREEN,
                borderRadius: 999,
                transition: "0.3s",
              }}
            />
          </div>
        </div>
        {/* STEP 1 */}
{step === 1 && (
  <>
    <Section title="Choose your cake size">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}
      >
        {SIZE_GUIDE.map((s) => (
          <button
            key={s.weight}
            onClick={() => setSize(s.weight)}
            style={{
              border:
                size === s.weight
                  ? `2px solid ${GREEN}`
                  : "1px solid #D1D5DB",
              background:
                size === s.weight ? "#EEF8E9" : "#fff",
              borderRadius: 12,
              padding: 12,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {s.weight}
          </button>
        ))}
      </div>
    </Section>

    <Section title="Choose your favourite flavour(s)">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {FLAVOURS.map((f) => {
          const active = flavours.includes(f);

          return (
            <button
              key={f}
              onClick={() => toggleFlavour(f)}
              style={{
                border: active
                  ? `1px solid ${GREEN}`
                  : "1px solid #D1D5DB",
                background: active ? GREEN : "#fff",
                color: active ? "#fff" : "#333",
                borderRadius: 999,
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>
    </Section>

    <Section title="Choose your date">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={inputStyle}
      />
    </Section>

    <Section title="Occasion">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {[
          "Birthday",
          "Anniversary",
          "Baby Shower",
          "Kids",
          "Wedding",
          "Other",
        ].map((o) => (
          <button
            key={o}
            onClick={() => setOccasion(o)}
            style={{
              border:
                occasion === o
                  ? `1px solid ${GREEN}`
                  : "1px solid #D1D5DB",
              background:
                occasion === o ? GREEN : "#fff",
              color:
                occasion === o ? "#fff" : "#333",
              borderRadius: 999,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </Section>
  </>
)}

{/* STEP 2 */}
{step === 2 && (
  <>
    <Section title="Pickup or Home Delivery">
      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        {["Pickup", "Delivery"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border:
                mode === m
                  ? `2px solid ${GREEN}`
                  : "1px solid #D1D5DB",
              background:
                mode === m ? GREEN : "#fff",
              color:
                mode === m ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {m === "Delivery"
              ? "Home Delivery"
              : "Pickup"}
          </button>
        ))}
      </div>

      {mode === "Delivery" && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "#FFF8E6",
            color: "#9A6700",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Delivery charges may be applied.
        </div>
      )}
    </Section>

    {mode === "Delivery" && (
      <Section title="Recipient Details">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <input type="checkbox" />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Same as my details
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <input
            placeholder="Recipient Name"
            value={recipient}
            onChange={(e) =>
              setRecipient(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value)
            }
            style={inputStyle}
          />

          <textarea
            rows={3}
            placeholder="Full Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            style={{
              ...inputStyle,
              resize: "none",
            }}
          />

          <input
            placeholder="Landmark"
            value={landmark}
            onChange={(e) =>
              setLandmark(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value)
            }
            style={inputStyle}
          />

          <button
            style={{
              border: "1px dashed #9CA3AF",
              borderRadius: 12,
              padding: 12,
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontWeight: 600,
            }}
          >
            <MapPin size={18} />
            Add GPS Location
          </button>
        </div>
      </Section>
    )}

    <Section title="Preferred Time">
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={inputStyle}
      />
    </Section>
  </>
)}
{/* STEP 3 */}
{step === 3 && (
  <>
    <Section title="Message on Cake">
      <textarea
        rows={3}
        placeholder="Happy Birthday Aarav"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ ...inputStyle, resize: "none" }}
      />
    </Section>

    <Section title="Add-ons (Optional)">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 12,
        }}
      >
        {ADDONS.map((a) => {
          const active = addons.includes(a.name);

          return (
            <button
              key={a.name}
              onClick={() => toggleAddon(a.name)}
              style={{
                border: active
                  ? `2px solid ${GREEN}`
                  : "1px solid #D1D5DB",
                background: active ? "#EEF8E9" : "#fff",
                borderRadius: 14,
                padding: 14,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              <div
                style={{
                  color: GREEN,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                ₹{a.price}
              </div>
            </button>
          );
        })}
      </div>
    </Section>
  </>
)}

{/* STEP 4 */}
{step === 4 && (
  <>
    <Section title="Review Your Enquiry">
      <div style={{ display: "grid", gap: 12 }}>
        <Row
          label="Designs"
          value={`${cakes.length} Selected`}
        />

        <Row label="Cake Size" value={size || "-"} />

        <Row
          label="Flavours"
          value={flavours.join(", ") || "-"}
        />

        <Row
          label="Occasion"
          value={occasion || "-"}
        />

        <Row label="Date" value={date || "-"} />

        <Row label="Time" value={time || "-"} />

        <Row label="Mode" value={mode} />

        {mode === "Delivery" && (
          <>
            <Row
              label="Recipient"
              value={recipient || "-"}
            />
            <Row label="Mobile" value={mobile || "-"} />
            <Row
              label="Address"
              value={address || "-"}
            />
          </>
        )}

        <Row
          label="Message"
          value={message || "-"}
        />

        <Row
          label="Add-ons"
          value={addons.join(", ") || "None"}
        />

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <span>Add-ons Total</span>
          <span style={{ color: GREEN }}>
            ₹{totalAddon}
          </span>
        </div>
      </div>
    </Section>
  </>
)}

      </>
    )}
  </div>

  {/* Bottom Navigation */}
  {showSteps && (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #E5E7EB",
        padding: 14,
        display: "flex",
        gap: 10,
      }}
    >
      <button
        onClick={() => {
          if (step === 1) {
            setShowSteps(false);
          } else {
            setStep(step - 1);
          }

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        style={{
          flex: 1,
          border: `1px solid ${GREEN}`,
          background: "#fff",
          color: GREEN,
          borderRadius: 12,
          padding: 14,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Back
      </button>

      <button
        onClick={() => {
          if (step < 4) {
            setStep(step + 1);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else {
            sendWhatsApp();
          }
        }}
        style={{
          flex: 2,
          border: "none",
          background: GREEN,
          color: "#fff",
          borderRadius: 12,
          padding: 14,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        {step === 4 ? "Send Enquiry" : "Next"}
      </button>
    </div>
  )}
</main>
  );
}