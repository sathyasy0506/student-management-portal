import { S } from "../styles";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊡" },
  { id: "students", label: "Students", icon: "◎", hasCount: true },
  { id: "departments", label: "Departments", icon: "⊞" },
  { id: "analytics", label: "Analytics", icon: "◈" },
  { id: "add", label: "Add Student", icon: "+" },
];

export default function Sidebar({
  page,
  setPage,
  studentCount,
  onLogout,
  currentUser,
  isOpen,
  isMobile,
  onClose,
}) {
  const username = currentUser?.username || "Admin";
  const avatarLetter = username?.charAt(0)?.toUpperCase() || "A";

  const sidebarStyle = isMobile
    ? {
        ...S.sidebar,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        width: 240,
        height: "100vh",
        overflowY: "auto",
      }
    : {
        ...S.sidebar,
        width: 240,
        position: "relative",
      };

  if (!isOpen && !isMobile) return null;

  return (
    <aside style={sidebarStyle}>
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            S
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "-0.02em",
              }}
            >
              SMS Portal
            </div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 1 }}>
              Student Management
            </div>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#64748B",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#334155",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0 10px",
            marginBottom: 8,
          }}
        >
          Menu
        </div>

        {NAV_ITEMS.map((item) => {
          const active = page === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                textAlign: "left",
                background: active ? "#1E293B" : "transparent",
                color: active ? "white" : "#64748B",
                fontFamily: "'IBM Plex Sans',sans-serif",
                transition: "all 0.15s",
                position: "relative",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 16,
                    background: "#6366F1",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}

              <span
                style={{
                  fontSize: 13,
                  width: 18,
                  textAlign: "center",
                  opacity: active ? 1 : 0.6,
                }}
              >
                {item.icon}
              </span>

              {item.label}

              {item.hasCount && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: active ? "#6366F1" : "#1E293B",
                    color: active ? "white" : "#64748B",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono',monospace",
                    padding: "2px 7px",
                    borderRadius: 20,
                    fontWeight: 600,
                  }}
                >
                  {studentCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {avatarLetter}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600 }}>
            {username}
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: 10,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Authenticated User
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Logout"
          style={{
            background: "none",
            border: "none",
            color: "#475569",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            padding: 4,
            borderRadius: 6,
          }}
        >
          ⏏
        </button>
      </div>
    </aside>
  );
}
