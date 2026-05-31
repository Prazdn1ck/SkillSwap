import { useState, useEffect } from "react";
import { requestsAPI, SkillRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../components/styles";

const StatusBadge = ({ status }: { status: SkillRequest["status"] }) => {
  const config = {
    pending: { bg: tokens.yellowBg, color: tokens.yellow, label: "Pending" },
    accepted: { bg: tokens.greenBg, color: tokens.green, label: "Accepted" },
    rejected: { bg: tokens.redBg, color: tokens.red, label: "Declined" },
  };
  const { bg, color, label } = config[status];
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
};

const RequestCard = ({
  request,
  isSent,
  onAccept,
  onReject,
}: {
  request: SkillRequest;
  isSent: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const person = isSent ? request.to : request.from;
  const date = new Date(request.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.surface,
        border: `1px solid ${hovered ? tokens.borderHov : tokens.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        marginBottom: 12,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 1px 6px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: tokens.textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              {isSent ? `→ ${person.name}` : person.name}
            </div>
          </div>
          <div
            style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 8 }}
          >
            {isSent ? "Sent to" : "From"}: {person.contact || person.email} ·{" "}
            {date}
          </div>
          {request.message && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${tokens.border}`,
                borderLeft: `3px solid ${tokens.amber}`,
                borderRadius: "0 8px 8px 0",
                padding: "8px 12px",
                fontSize: 13,
                color: tokens.textSec,
                fontStyle: "italic",
                margin: "10px 0",
                lineHeight: 1.5,
              }}
            >
              "{request.message}"
            </div>
          )}
          {request.status === "accepted" && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: tokens.greenBg,
                border: `1px solid rgba(74,222,128,0.2)`,
                borderRadius: 8,
                padding: "6px 12px",
                marginTop: 8,
                fontSize: 13,
                color: tokens.green,
                fontWeight: 600,
              }}
            >
              Contact: {person.contact || person.email}
            </div>
          )}
        </div>

        <div
          style={{
            marginLeft: 16,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <StatusBadge status={request.status} />

          {!isSent && request.status === "pending" && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={onAccept}
                style={{
                  background: tokens.greenBg,
                  color: tokens.green,
                  border: `1px solid rgba(74,222,128,0.3)`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.2s",
                }}
              >
                ✓ Accept
              </button>
              <button
                onClick={onReject}
                style={{
                  background: tokens.redBg,
                  color: tokens.red,
                  border: `1px solid rgba(248,113,113,0.25)`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.2s",
                }}
              >
                ✕ Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div
    style={{
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      borderRadius: 14,
      padding: "36px 24px",
      textAlign: "center",
      marginBottom: 12,
    }}
  >
    <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
    <p style={{ color: tokens.textMuted, fontSize: 14 }}>{message}</p>
  </div>
);

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"incoming" | "sent">("incoming");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await requestsAPI.getAll();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await requestsAPI.updateStatus(id, status);
      load();
    } catch {
      alert("Failed to update request");
    }
  };

  const incoming = requests.filter((r) => r.to._id === user?._id);
  const outgoing = requests.filter((r) => r.from._id === user?._id);
  const pendingCount = incoming.filter((r) => r.status === "pending").length;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: tokens.textMuted,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading requests…
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "'DM Sans', sans-serif",
        color: tokens.textPrimary,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(45,212,191,0.08)",
            border: "1px solid rgba(45,212,191,0.18)",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: tokens.teal,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Skill Requests
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: tokens.textPrimary,
          }}
        >
          Connections
        </h1>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
          gap: 4,
        }}
      >
        {[
          { key: "incoming", label: "Incoming", count: incoming.length },
          { key: "sent", label: "Sent", count: outgoing.length },
        ].map(({ key, label, count }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as "incoming" | "sent")}
              style={{
                flex: 1,
                background: isActive ? tokens.bg : "transparent",
                color: isActive ? tokens.textPrimary : tokens.textSec,
                border: isActive
                  ? `1px solid ${tokens.border}`
                  : "1px solid transparent",
                borderRadius: 9,
                padding: "10px",
                cursor: "pointer",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {label}
              <span
                style={{
                  background: isActive
                    ? key === "incoming" && pendingCount > 0
                      ? tokens.amber
                      : tokens.border
                    : tokens.border,
                  color:
                    isActive && key === "incoming" && pendingCount > 0
                      ? "#000"
                      : tokens.textMuted,
                  borderRadius: 6,
                  padding: "1px 8px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pending action hint */}
      {activeTab === "incoming" && pendingCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 20,
            fontSize: 13,
            color: tokens.amber,
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 16 }}>⏳</span>
          {pendingCount} request{pendingCount > 1 ? "s" : ""} waiting for your
          response
        </div>
      )}

      {/* Request lists */}
      {activeTab === "incoming" ? (
        incoming.length === 0 ? (
          <EmptyState message="No incoming requests yet. Share your profile to attract partners!" />
        ) : (
          incoming.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              isSent={false}
              onAccept={() => handleStatus(r._id, "accepted")}
              onReject={() => handleStatus(r._id, "rejected")}
            />
          ))
        )
      ) : outgoing.length === 0 ? (
        <EmptyState message="You haven't sent any requests yet. Browse members to get started!" />
      ) : (
        outgoing.map((r) => (
          <RequestCard key={r._id} request={r} isSent={true} />
        ))
      )}
    </div>
  );
}
