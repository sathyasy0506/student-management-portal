import { S } from "../styles";
import { useBreakpoint } from "../hooks/useBreakpoint";

/* ── Status Badge ── */
export function Badge({ status }) {
  const style =
    status === "Active"
      ? S.badgeActive
      : status === "Graduated"
        ? S.badgeGraduated
        : S.badgeDiscontinued;
  return (
    <span
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
    >
      {status}
    </span>
  );
}

/* ── Department Pill ── */
export function DeptPill({ name }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        background: "#F1F5F9",
        color: "#475569",
        border: "1px solid #E2E8F0",
      }}
    >
      {name}
    </span>
  );
}

/* ── Toast Notification ── */
export function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#0F172A",
        color: "white",
        padding: "12px 18px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderLeft: "3px solid #6366F1",
        boxShadow: "0 8px 32px rgba(15,23,42,0.3)",
        fontFamily: "'IBM Plex Sans',sans-serif",
        letterSpacing: "-0.01em",
      }}
    >
      {msg}
    </div>
  );
}

/* ── Modal Close Button ── */
export function ModalClose({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        cursor: "pointer",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94A3B8",
      }}
    >
      ×
    </button>
  );
}

/* ── Icon Button ── */
export function IconBtn({ icon, title, onClick }) {
  return (
    <button onClick={onClick} title={title} style={S.iconBtn}>
      {icon}
    </button>
  );
}

/* ── Page Topbar ── */
export function Topbar({ title, crumb, children, onMenuClick }) {
  const { isDesktop } = useBreakpoint();

  return (
    <div
      style={{
        ...S.topbar,
        padding: isDesktop ? "0 32px" : "0 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!isDesktop && (
          <button
            onClick={onMenuClick}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 6px",
              borderRadius: 6,
              color: "#475569",
              fontSize: 18,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              marginRight: 4,
            }}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
        <span
          style={{
            fontWeight: 700,
            color: "#0F172A",
            fontSize: 15,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </span>
        {isDesktop && (
          <>
            <span style={{ color: "#CBD5E1", fontSize: 14 }}>/</span>
            <span style={{ color: "#94A3B8", fontSize: 13 }}>{crumb}</span>
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>{children}</div>
    </div>
  );
}
