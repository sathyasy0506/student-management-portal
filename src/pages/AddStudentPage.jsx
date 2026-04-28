import { useEffect, useState } from "react";
import { S } from "../styles";
import { Topbar } from "../components/shared";
import { useBreakpoint } from "../hooks/useBreakpoint";
import {
  addStudent,
  getDepartmentDropdown,
  getStatusDropdown,
} from "../services/studentService";

const EMPTY_FORM = {
  full_name: "",
  roll_number: "",
  department_id: "",
  batch_start_year: "",
  batch_end_year: "",
  gender: "Male",
  date_of_birth: "",
  email: "",
  phone: "",
  address: "",
  status_id: "",
};

export default function AddStudentPage({
  setStudents,
  setDepartments,
  setPage,
  showToast,
  onMenuClick,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [departments, setDeptOptions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [saving, setSaving] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [deptList, statusList] = await Promise.all([
          getDepartmentDropdown(),
          getStatusDropdown(),
        ]);

        setDeptOptions(deptList);
        setDepartments(deptList);
        setStatuses(statusList);

        if (!form.status_id && statusList.length > 0) {
          const activeStatus =
            statusList.find((s) => s.name === "Active") || statusList[0];
          setForm((prev) => ({ ...prev, status_id: activeStatus.id }));
        }
      } catch (error) {
        showToast(error.message || "Failed to load form data");
      }
    }

    loadDropdowns();
  }, []);

  async function save() {
    if (
      !form.full_name.trim() ||
      !form.roll_number.trim() ||
      !form.department_id
    ) {
      showToast("Name, Roll No and Department are required");
      return;
    }

    if (!form.batch_start_year || !form.batch_end_year) {
      showToast("Please enter the batch years");
      return;
    }

    if (!form.status_id) {
      showToast("Please select status");
      return;
    }

    try {
      setSaving(true);

      await addStudent({
        full_name: form.full_name.trim(),
        roll_number: form.roll_number.trim(),
        gender: form.gender,
        date_of_birth: form.date_of_birth || "",
        address: form.address.trim(),
        department_id: Number(form.department_id),
        batch_start_year: Number(form.batch_start_year),
        batch_end_year: Number(form.batch_end_year),
        status_id: Number(form.status_id),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });

      showToast("Student record created successfully");
      setForm(EMPTY_FORM);
      setStudents([]);
      setPage("students");
    } catch (error) {
      showToast(error.message || "Failed to create student");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Add Student" crumb="new record" onMenuClick={onMenuClick}>
        <button
          onClick={() => setPage("students")}
          style={{ ...S.btnOutline, fontSize: 12, padding: "6px 12px" }}
        >
          ← Back
        </button>
      </Topbar>

      <div style={{ padding: isMobile ? 12 : 28 }}>
        <div style={{ ...S.card, maxWidth: 760 }}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Student Record</span>
            <span
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              Fields marked * are required
            </span>
          </div>

          <div style={S.cardBody}>
            <div style={S.formSection}>Personal Information</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Field label="Full Name *">
                <input
                  value={form.full_name}
                  onChange={(e) => setField("full_name", e.target.value)}
                  placeholder="e.g. Sathya M"
                  style={S.formInput}
                />
              </Field>

              <Field label="Roll Number *">
                <input
                  value={form.roll_number}
                  onChange={(e) => setField("roll_number", e.target.value)}
                  placeholder="e.g. CS2019001"
                  style={S.formInput}
                />
              </Field>

              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                  style={S.formInput}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Field label="Date of Birth">
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => setField("date_of_birth", e.target.value)}
                  style={S.formInput}
                />
              </Field>

              <Field label="Address">
                <input
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="City, State"
                  style={S.formInput}
                />
              </Field>
            </div>

            <div style={S.formSection}>Academic Information</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Field label="Department *">
                <select
                  value={form.department_id}
                  onChange={(e) => setField("department_id", e.target.value)}
                  style={S.formInput}
                >
                  <option value="">Select department…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Batch *">
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={form.batch_start_year}
                    onChange={(e) =>
                      setField("batch_start_year", e.target.value)
                    }
                    placeholder="2019"
                    maxLength={4}
                    style={{ ...S.formInput, width: 72 }}
                  />
                  <span
                    style={{ color: "#9CA3AF", fontSize: 11, flexShrink: 0 }}
                  >
                    to
                  </span>
                  <input
                    value={form.batch_end_year}
                    onChange={(e) => setField("batch_end_year", e.target.value)}
                    placeholder="2023"
                    maxLength={4}
                    style={{ ...S.formInput, width: 72 }}
                  />
                </div>
              </Field>

              <Field label="Status">
                <select
                  value={form.status_id}
                  onChange={(e) => setField("status_id", e.target.value)}
                  style={S.formInput}
                >
                  <option value="">Select status…</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div style={S.formSection}>Contact Information</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="student@email.com"
                  style={S.formInput}
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+91 9999999999"
                  style={S.formInput}
                />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={save}
                disabled={saving}
                style={{ ...S.btnPrimary, padding: "8px 20px", fontSize: 13 }}
              >
                {saving ? "Saving..." : "Save Record"}
              </button>
              <button
                onClick={() => setForm(EMPTY_FORM)}
                style={{ ...S.btnOutline, padding: "8px 20px", fontSize: 13 }}
              >
                Clear Fields
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#6B7280",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
