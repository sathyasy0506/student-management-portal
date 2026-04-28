import { useState } from "react";
import { S } from "../styles";
import { ModalClose } from "./shared";

export default function DepartmentModal({
  editDept,
  departments,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    editDept
      ? {
          name: editDept.name || "",
          code: editDept.code || "",
          head: editDept.head || "",
          intake: editDept.intake || "",
          is_active: editDept.is_active ?? 1,
        }
      : {
          name: "",
          code: "",
          head: "",
          intake: "",
          is_active: 1,
        },
  );

  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate() {
    const errs = {};

    if (!form.name.trim()) errs.name = "Department name is required";
    if (!form.code.trim()) errs.code = "Code is required";

    if (
      departments.some(
        (d) =>
          d.name?.toLowerCase() === form.name.trim().toLowerCase() &&
          (!editDept || d.id !== editDept.id),
      )
    ) {
      errs.name = "Department already exists";
    }

    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    onSave({
      ...form,
      intake: form.intake ? Number(form.intake) : 0,
      name: form.name.trim(),
      code: form.code.trim(),
      head: form.head.trim(),
    });
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div
        style={{ ...S.modalBox, maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={S.modalHeader}>
          <span style={S.modalTitle}>
            {editDept ? "Edit Department" : "Add Department"}
          </span>
          <ModalClose onClose={onClose} />
        </div>

        <div style={S.modalBody}>
          <div style={{ marginBottom: 12 }}>
            <label style={S.formLabel}>Department Name *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Computer Science"
              style={{
                ...S.formInput,
                marginTop: 4,
                border: errors.name
                  ? "1.5px solid #EF4444"
                  : "1.5px solid #E5E7EB",
              }}
            />
            {errors.name && (
              <p style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>
                {errors.name}
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={S.formLabel}>Code *</label>
              <input
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="e.g. CSE"
                maxLength={10}
                style={{
                  ...S.formInput,
                  marginTop: 4,
                  fontFamily: "'IBM Plex Mono',monospace",
                  border: errors.code
                    ? "1.5px solid #EF4444"
                    : "1.5px solid #E5E7EB",
                }}
              />
              {errors.code && (
                <p style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>
                  {errors.code}
                </p>
              )}
            </div>

            <div>
              <label style={S.formLabel}>Intake</label>
              <input
                type="number"
                value={form.intake}
                onChange={(e) => set("intake", e.target.value)}
                placeholder="e.g. 60"
                style={{ ...S.formInput, marginTop: 4 }}
              />
            </div>
          </div>

          <div>
            <label style={S.formLabel}>Head of Department</label>
            <input
              value={form.head}
              onChange={(e) => set("head", e.target.value)}
              placeholder="e.g. Dr. R. Suresh"
              style={{ ...S.formInput, marginTop: 4 }}
            />
          </div>
        </div>

        <div style={S.modalFooter}>
          <button
            onClick={onClose}
            style={{ ...S.btnOutline, fontSize: 11, padding: "5px 14px" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ ...S.btnPrimary, fontSize: 11, padding: "5px 14px" }}
          >
            {editDept ? "Save Changes" : "Add Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
