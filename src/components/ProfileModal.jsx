import { S } from "../styles";
import { Badge, ModalClose } from "./shared";

export default function ProfileModal({ student, onClose, onEdit }) {
  if (!student) return null;

  const initials = (student.full_name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const batch =
    student.batch_start_year && student.batch_end_year
      ? `${student.batch_start_year} - ${student.batch_end_year}`
      : "—";

  const fields = [
    ["Batch", batch],
    ["Gender", student.gender || "—"],
    ["Date of Birth", student.date_of_birth || "—"],
    ["Phone", student.phone || "—"],
    ["Email", student.email || "—"],
    ["Address", student.address || "—"],
  ];

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <span style={S.modalTitle}>Student Profile</span>
          <ModalClose onClose={onClose} />
        </div>

        <div style={S.modalBody}>
          <div
            style={{
              background: "#0F172A",
              padding: 18,
              margin: "-18px -22px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#1D4ED8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                borderRadius: 6,
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "white" }}>
                {student.full_name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748B",
                  fontFamily: "'IBM Plex Mono',monospace",
                  marginTop: 2,
                }}
              >
                {student.roll_number} · {student.department_name}
              </div>
              <div style={{ marginTop: 8 }}>
                <Badge status={student.status_name} />
              </div>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {fields.map(([label, val]) => (
              <div key={label}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#9CA3AF",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  {label}
                </label>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.modalFooter}>
          <button
            onClick={onClose}
            style={{ ...S.btnOutline, fontSize: 11, padding: "5px 14px" }}
          >
            Close
          </button>
          <button
            onClick={onEdit}
            style={{ ...S.btnPrimary, fontSize: 11, padding: "5px 14px" }}
          >
            Edit Record
          </button>
        </div>
      </div>
    </div>
  );
}
