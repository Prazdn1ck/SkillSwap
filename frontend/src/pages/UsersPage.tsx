import { useState, useEffect } from "react";
import { usersAPI, requestsAPI, User } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { UserCard } from "../components/UserCard";
import { tokens } from "../components/styles";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");
  const [wantsFilter, setWantsFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [textareaFocus, setTextareaFocus] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: { skill?: string; wants?: string } = {};
      if (skillFilter) params.skill = skillFilter;
      if (wantsFilter) params.wants = wantsFilter;
      const { data } = await usersAPI.getAll(params);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSendRequest = async () => {
    if (!selectedUser) return;
    setSending(true);
    setRequestMsg("");
    try {
      await requestsAPI.send({ to: selectedUser._id, message });
      setRequestMsg("success");
      setTimeout(() => {
        setSelectedUser(null);
        setMessage("");
        setRequestMsg("");
      }, 1600);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to send request";
      setRequestMsg(msg);
    } finally {
      setSending(false);
    }
  };

  const clearFilters = () => {
    setSkillFilter("");
    setWantsFilter("");
    setTimeout(loadUsers, 0);
  };

  const filterInputStyle = {
    padding: "10px 14px",
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    fontSize: 14,
    color: tokens.textPrimary,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    minWidth: 190,
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "'DM Sans', sans-serif",
        color: tokens.textPrimary,
      }}
    >
      {/* Page header */}
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
          Community
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: tokens.textPrimary,
            marginBottom: 8,
          }}
        >
          Browse Members
        </h1>
        <p style={{ color: tokens.textSec, fontSize: 15 }}>
          Find someone to exchange skills with.
        </p>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 28,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          style={filterInputStyle}
          placeholder="They know (e.g. Python)"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadUsers()}
        />
        <input
          style={filterInputStyle}
          placeholder="They want (e.g. React)"
          value={wantsFilter}
          onChange={(e) => setWantsFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadUsers()}
        />
        <button
          onClick={loadUsers}
          style={{
            background: tokens.amber,
            color: "#000",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Search
        </button>
        {(skillFilter || wantsFilter) && (
          <button
            onClick={clearFilters}
            style={{
              background: "transparent",
              color: tokens.textSec,
              border: `1px solid ${tokens.border}`,
              borderRadius: 10,
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* User count */}
      {!loading && (
        <div
          style={{
            fontSize: 13,
            color: tokens.textMuted,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {users.length} {users.length === 1 ? "member" : "members"} found
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: tokens.textMuted,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
          Loading members…
        </div>
      ) : users.length === 0 ? (
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 16,
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            No members found
          </div>
          <p style={{ color: tokens.textSec, fontSize: 14 }}>
            Try different filters or clear them to see all members.
          </p>
        </div>
      ) : (
        users.map((u) => (
          <UserCard
            key={u._id}
            user={u}
            currentUserId={currentUser?._id}
            onSendRequest={setSelectedUser}
          />
        ))
      )}

      {/* Request modal */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 24,
          }}
        >
          <div
            style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 20,
              padding: "32px",
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            {requestMsg === "success" ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: tokens.green,
                    marginBottom: 8,
                  }}
                >
                  Request sent!
                </div>
                <p style={{ color: tokens.textSec, fontSize: 14 }}>
                  {selectedUser.name} will be notified.
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: tokens.textMuted,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    Connect with
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 22,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {selectedUser.name}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 500,
                      marginBottom: 8,
                      fontSize: 13,
                      color: tokens.textSec,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Message{" "}
                    <span style={{ color: tokens.textMuted, fontWeight: 400 }}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: tokens.bg,
                      border: `1px solid ${textareaFocus ? tokens.amber : tokens.border}`,
                      borderRadius: 12,
                      fontSize: 14,
                      color: tokens.textPrimary,
                      boxSizing: "border-box",
                      resize: "vertical",
                      minHeight: 100,
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      boxShadow: textareaFocus
                        ? "0 0 0 3px rgba(245,158,11,0.1)"
                        : "none",
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setTextareaFocus(true)}
                    onBlur={() => setTextareaFocus(false)}
                    placeholder="Hi! I know Python and would love to learn React from you…"
                  />
                </div>

                {requestMsg && requestMsg !== "success" && (
                  <div
                    style={{
                      background: tokens.redBg,
                      color: tokens.red,
                      border: `1px solid rgba(248,113,113,0.2)`,
                      padding: "12px 16px",
                      borderRadius: 10,
                      marginBottom: 20,
                      fontSize: 14,
                    }}
                  >
                    {requestMsg}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleSendRequest}
                    disabled={sending}
                    style={{
                      flex: 1,
                      background: sending ? tokens.border : tokens.amber,
                      color: sending ? tokens.textMuted : "#000",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px",
                      cursor: sending ? "not-allowed" : "pointer",
                      fontWeight: 700,
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {sending ? "Sending…" : "Send Request"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setMessage("");
                      setRequestMsg("");
                    }}
                    style={{
                      background: "transparent",
                      color: tokens.textSec,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: 12,
                      padding: "12px 20px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
