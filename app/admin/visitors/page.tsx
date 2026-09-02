"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

const GREEN = "#5E8F34";
const GREY = "#6B7280";
const BG = "#F8F8F6";

type Visitor = {
  id: string;
  name?: string;
  mobile?: string;
  whatsapp?: string;
  createdAt?: any;
  lastSeen?: any;
  totalSeconds?: number;
  viewedCakes?: string[];
  whatsappClicks?: number;
};

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVisitors();
  }, []);

  async function loadVisitors() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "visitors"),
        orderBy("lastSeen", "desc")
      );

      const snap = await getDocs(q);

      const data: Visitor[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Visitor, "id">),
      }));

      setVisitors(data);
    } catch (error) {
      console.error("Failed to load visitors:", error);
      alert("Unable to load customer visitors");
    } finally {
      setLoading(false);
    }
  }

  function formatTime(totalSeconds: number = 0) {
    const seconds = Math.max(0, totalSeconds);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
  }

  function formatDate(timestamp: any) {
    if (!timestamp) return "-";

    try {
      if (typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleString("en-IN");
      }

      return new Date(timestamp).toLocaleString("en-IN");
    } catch {
      return "-";
    }
  }

  const filteredVisitors = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return visitors;

    return visitors.filter((visitor) => {
      return (
        visitor.name?.toLowerCase().includes(value) ||
        visitor.mobile?.includes(value) ||
        visitor.whatsapp?.includes(value)
      );
    });
  }, [visitors, search]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        padding: 24,
        fontFamily: "sans-serif",
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
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
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
              Customer Visitors
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: GREY,
              }}
            >
              Customer activity & catalog analytics
            </p>
          </div>

          <button
            onClick={loadVisitors}
            disabled={loading}
            style={{
              border: "none",
              background: GREEN,
              color: "#fff",
              padding: "11px 16px",
              borderRadius: 12,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* SUMMARY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginTop: 24,
          }}
        >
          <div style={summaryCard}>
            <div style={summaryLabel}>Total Visitors</div>

            <div style={summaryValue}>
              {visitors.length}
            </div>
          </div>

          <div style={summaryCard}>
            <div style={summaryLabel}>Cakes Viewed</div>

            <div style={summaryValue}>
              {visitors.reduce(
                (total, visitor) =>
                  total +
                  (visitor.viewedCakes?.length || 0),
                0
              )}
            </div>
          </div>

          <div style={summaryCard}>
            <div style={summaryLabel}>WhatsApp Clicks</div>

            <div style={summaryValue}>
              {visitors.reduce(
                (total, visitor) =>
                  total +
                  (visitor.whatsappClicks || 0),
                0
              )}
            </div>
          </div>

          <div style={summaryCard}>
            <div style={summaryLabel}>Total Time</div>

            <div style={summaryValue}>
              {formatTime(
                visitors.reduce(
                  (total, visitor) =>
                    total +
                    (visitor.totalSeconds || 0),
                  0
                )
              )}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            marginTop: 20,
            boxShadow: "0 5px 16px rgba(0,0,0,.05)",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name or mobile..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 15,
              background: "transparent",
            }}
          />
        </div>

        {/* TABLE */}
        <div
          style={{
            marginTop: 20,
            background: "#fff",
            borderRadius: 18,
            overflowX: "auto",
            boxShadow: "0 6px 18px rgba(0,0,0,.05)",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 1050,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#F3F4F6",
                }}
              >
                <th style={th}>Customer</th>
                <th style={th}>Mobile</th>
                <th style={th}>WhatsApp</th>
                <th style={th}>Viewed Cakes</th>
                <th style={th}>Time Spent</th>
                <th style={th}>WA Clicks</th>
                <th style={th}>Last Visit</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 30,
                      textAlign: "center",
                      color: GREY,
                    }}
                  >
                    Loading visitors...
                  </td>
                </tr>
              ) : filteredVisitors.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 30,
                      textAlign: "center",
                      color: GREY,
                    }}
                  >
                    No visitors found
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td style={td}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {visitor.name || "-"}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: "#9CA3AF",
                          marginTop: 3,
                        }}
                      >
                        ID: {visitor.id.slice(0, 8)}
                      </div>
                    </td>

                    <td style={td}>
                      {visitor.mobile || "-"}
                    </td>

                    <td style={td}>
                      {visitor.whatsapp || "-"}
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          display: "inline-block",
                          minWidth: 32,
                          textAlign: "center",
                          background: "#EEF6E7",
                          color: GREEN,
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 700,
                        }}
                      >
                        {visitor.viewedCakes?.length || 0}
                      </span>
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#374151",
                        }}
                      >
                        {formatTime(
                          visitor.totalSeconds || 0
                        )}
                      </span>
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          display: "inline-block",
                          minWidth: 32,
                          textAlign: "center",
                          background: "#DBEAFE",
                          color: "#1D4ED8",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 700,
                        }}
                      >
                        {visitor.whatsappClicks || 0}
                      </span>
                    </td>

                    <td style={td}>
                      {formatDate(visitor.lastSeen)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

const summaryCard = {
  background: "#FFFFFF",
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 5px 16px rgba(0,0,0,.05)",
};

const summaryLabel = {
  color: GREY,
  fontSize: 13,
};

const summaryValue = {
  color: GREEN,
  fontSize: 28,
  fontWeight: 800,
  marginTop: 6,
};

const th = {
  textAlign: "left" as const,
  padding: 14,
  fontSize: 12,
  color: "#374151",
  whiteSpace: "nowrap" as const,
};

const td = {
  padding: 14,
  borderTop: "1px solid #F3F4F6",
  fontSize: 13,
  color: GREY,
  whiteSpace: "nowrap" as const,
};