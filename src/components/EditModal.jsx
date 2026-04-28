import { useMemo, useState } from "react";
import { S } from "../styles";
import { ModalClose } from "./shared";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function EditModal({
  student,
  departments,
  statuses,
  onSave,
  onClose,
}) {
  const initialForm = useMemo(
    () => ({
      id: student?.id || "",
      full_name: student?.full_name || "",
      roll_number: student?.roll_number || "",
      gender: student?.gender || "Male",
      date_of_birth: student?.date_of_birth || "",
      address: student?.address || "",
      department_id: student?.department_id || "",
      batch_start_year: student?.batch_start_year || "",
      batch_end_year: student?.batch_end_year || "",
      status_id: student?.status_id || "",
      email: student?.email || "",
      phone: student?.phone || "",
    }),
    [student],
  );

  const [form, setForm] = useState(initialForm);
  const { isMobile } = useBreakpoint();
  const twoCol = isMobile ? "1fr" : "1fr 1fr";

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave({
      ...form,
      id: Number(form.id),
      department_id: Number(form.department_id),
      batch_start_year: Number(form.batch_start_year),
      batch_end_year: Number(form.batch_end_year),
      status_id: Number(form.status_id),
    });
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <span style={S.modalTitle}>Edit Student</span>
          <ModalClose onClose={onClose} />
        </div>

        <div style={S.modalBody}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: twoCol,
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={S.formLabel}>Full Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setField("full_name", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              />
            </div>
            <div>
              <label style={S.formLabel}>Roll No</label>
              <input
                value={form.roll_number}
                onChange={(e) => setField("roll_number", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: twoCol,
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={S.formLabel}>Department</label>
              <select
                value={form.department_id}
                onChange={(e) => setField("department_id", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={S.formLabel}>Batch</label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <input
                  value={form.batch_start_year}
                  onChange={(e) => setField("batch_start_year", e.target.value)}
                  placeholder="2019"
                  maxLength={4}
                  style={{ ...S.formInput, width: 80 }}
                />
                <span style={{ color: "#9CA3AF", fontSize: 11, flexShrink: 0 }}>
                  to
                </span>
                <input
                  value={form.batch_end_year}
                  onChange={(e) => setField("batch_end_year", e.target.value)}
                  placeholder="2023"
                  maxLength={4}
                  style={{ ...S.formInput, width: 80 }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: twoCol,
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={S.formLabel}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={S.formLabel}>Date of Birth</label>
              <input
                type="date"
                value={form.date_of_birth || ""}
                onChange={(e) => setField("date_of_birth", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: twoCol,
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={S.formLabel}>Email</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setField("email", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              />
            </div>
            <div>
              <label style={S.formLabel}>Phone</label>
              <input
                value={form.phone || ""}
                onChange={(e) => setField("phone", e.target.value)}
                style={{ ...S.formInput, marginTop: 4 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={S.formLabel}>Address</label>
            <input
              value={form.address || ""}
              onChange={(e) => setField("address", e.target.value)}
              style={{ ...S.formInput, marginTop: 4 }}
            />
          </div>

          <div>
            <label style={S.formLabel}>Status</label>
            <select
              value={form.status_id}
              onChange={(e) => setField("status_id", e.target.value)}
              style={{ ...S.formInput, marginTop: 4 }}
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
