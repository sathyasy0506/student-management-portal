import { useEffect, useState } from "react";
import { S } from "../styles";
import { exportCSV } from "../utils";
import { Badge, DeptPill, Topbar, IconBtn } from "../components/shared";
import { useBreakpoint } from "../hooks/useBreakpoint";
import ProfileModal from "../components/ProfileModal";
import EditModal from "../components/EditModal";
import {
  getStudents,
  updateStudent,
  deleteStudent,
  getStatusDropdown,
} from "../services/studentService";

function getBatch(student) {
  if (!student?.batch_start_year || !student?.batch_end_year) return "—";
  return `${student.batch_start_year}-${student.batch_end_year}`;
}

export default function StudentsPage({
  students,
  setStudents,
  departments,
  setPage,
  showToast,
  onMenuClick,
}) {
  const [search, setSearch] = useState("");
  const [fDept, setFDept] = useState("");
  const [fBatch, setFBatch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [sortKey, setSortKey] = useState("full_name");
  const [sortDir, setSortDir] = useState(-1);
  const [profileId, setProfileId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [pageNo, setCurrentPage] = useState(1);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useBreakpoint();

  const PAGE_SIZE = 10;

  async function loadStudents() {
    try {
      setLoading(true);
      const list = await getStudents();
      setStudents(list);
    } catch (error) {
      showToast(error.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();

    getStatusDropdown()
      .then(setStatuses)
      .catch((error) => showToast(error.message || "Failed to load statuses"));
  }, []);

  const deptNames = departments.map((d) => d.name);

  const batches = [
    ...new Set(students.map((s) => getBatch(s)).filter((b) => b !== "—")),
  ].sort();

  let list = students.filter((s) => {
    const q = search.toLowerCase();

    const matchQ =
      !q ||
      (s.full_name || "").toLowerCase().includes(q) ||
      (s.roll_number || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q);

    return (
      matchQ &&
      (!fDept || s.department_name === fDept) &&
      (!fBatch || getBatch(s) === fBatch) &&
      (!fStatus || s.status_name === fStatus)
    );
  });

  list = [...list].sort((a, b) => {
    const va = (a[sortKey] || "").toString().toLowerCase();
    const vb = (b[sortKey] || "").toString().toLowerCase();
    return va < vb ? sortDir : va > vb ? -sortDir : 0;
  });

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(pageNo, totalPages);
  const paged = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => -d);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function sortArrow(key) {
    return (
      <span style={{ color: "#D1D5DB" }}>
        {sortKey === key ? (sortDir === 1 ? "↑" : "↓") : "↕"}
      </span>
    );
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student record? This cannot be undone."))
      return;

    try {
      await deleteStudent(id);
      showToast("Student record deleted");
      await loadStudents();
    } catch (error) {
      showToast(error.message || "Failed to delete student");
    }
  }

  async function saveEdit(updated) {
    try {
      await updateStudent(updated);
      setEditStudent(null);
      showToast("Student record updated");
      await loadStudents();
    } catch (error) {
      showToast(error.message || "Failed to update student");
    }
  }

  const profileStudent = students.find((s) => s.id === profileId);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Students" crumb="all records" onMenuClick={onMenuClick}>
        <button
          onClick={() => exportCSV(students)}
          disabled={!students || students.length === 0}
          style={{
            ...S.btnOutline,
            fontSize: 12,
            padding: "6px 12px",
            opacity: !students?.length ? 0.5 : 1,
            cursor: !students?.length ? "not-allowed" : "pointer",
          }}
        >
          ↓ Export CSV
        </button>
        <button
          onClick={() => setPage("add")}
          style={{ ...S.btnPrimary, fontSize: 12, padding: "6px 12px" }}
        >
          + New Student
        </button>
      </Topbar>

      <div style={{ padding: isMobile ? 12 : 28 }}>
        <div style={S.card}>
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #F3F4F6",
              background: "#F9FAFB",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{ position: "relative", flex: "1 1 160px", minWidth: 140 }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  fontSize: 12,
                }}
              >
                ⌕
              </span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name, roll, email…"
                style={{
                  ...S.filterInput,
                  paddingLeft: 28,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <select
              value={fDept}
              onChange={(e) => {
                setFDept(e.target.value);
                setCurrentPage(1);
              }}
              style={{ ...S.filterInput, minWidth: 140 }}
            >
              <option value="">All Departments</option>
              {deptNames.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <select
              value={fBatch}
              onChange={(e) => {
                setFBatch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ ...S.filterInput, minWidth: 120 }}
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

            <select
              value={fStatus}
              onChange={(e) => {
                setFStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{ ...S.filterInput, minWidth: 110 }}
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>

            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "#9CA3AF",
                fontFamily: "'IBM Plex Mono',monospace",
                whiteSpace: "nowrap",
              }}
            >
              {list.length} of {students.length} records · page {safePage}/
              {totalPages}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead
                style={{
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <tr>
                  <th
                    onClick={() => handleSort("full_name")}
                    style={{ ...S.th, cursor: "pointer" }}
                  >
                    Name {sortArrow("full_name")}
                  </th>
                  <th
                    onClick={() => handleSort("roll_number")}
                    style={{ ...S.th, cursor: "pointer" }}
                  >
                    Roll No {sortArrow("roll_number")}
                  </th>
                  <th
                    onClick={() => handleSort("department_name")}
                    style={{ ...S.th, cursor: "pointer" }}
                  >
                    Department {sortArrow("department_name")}
                  </th>
                  <th style={S.th}>Batch</th>
                  <th style={S.th}>Email</th>
                  <th
                    onClick={() => handleSort("status_name")}
                    style={{ ...S.th, cursor: "pointer" }}
                  >
                    Status {sortArrow("status_name")}
                  </th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        ...S.td,
                        textAlign: "center",
                        color: "#9CA3AF",
                        padding: 48,
                      }}
                    >
                      Loading students...
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        ...S.td,
                        textAlign: "center",
                        color: "#9CA3AF",
                        padding: 48,
                        fontFamily: "'IBM Plex Mono',monospace",
                        fontSize: 12,
                      }}
                    >
                      No records match the selected filters
                    </td>
                  </tr>
                ) : (
                  paged.map((s) => (
                    <tr key={s.id}>
                      <td style={S.td}>
                        <strong
                          onClick={() => setProfileId(s.id)}
                          style={{ color: "#1D4ED8", cursor: "pointer" }}
                        >
                          {s.full_name}
                        </strong>
                      </td>

                      <td
                        style={{
                          ...S.td,
                          fontFamily: "'IBM Plex Mono',monospace",
                          fontSize: 11,
                          color: "#9CA3AF",
                        }}
                      >
                        {s.roll_number}
                      </td>

                      <td style={S.td}>
                        <DeptPill name={s.department_name} />
                      </td>

                      <td
                        style={{
                          ...S.td,
                          fontFamily: "'IBM Plex Mono',monospace",
                          fontSize: 11,
                          color: "#6B7280",
                        }}
                      >
                        {getBatch(s)}
                      </td>

                      <td style={{ ...S.td, fontSize: 12, color: "#9CA3AF" }}>
                        {s.email || "—"}
                      </td>

                      <td style={S.td}>
                        <Badge status={s.status_name} />
                      </td>

                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <IconBtn
                            icon="👁"
                            title="View"
                            onClick={() => setProfileId(s.id)}
                          />
                          <IconBtn
                            icon="✎"
                            title="Edit"
                            onClick={() => setEditStudent({ ...s })}
                          />
                          <IconBtn
                            icon="✕"
                            title="Delete"
                            onClick={() => handleDelete(s.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid #F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#FAFAFA",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, list.length)} of {list.length}
              </span>

              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage === 1}
                  style={{
                    ...S.btnOutline,
                    padding: "4px 8px",
                    fontSize: 11,
                    opacity: safePage === 1 ? 0.4 : 1,
                  }}
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={safePage === 1}
                  style={{
                    ...S.btnOutline,
                    padding: "4px 8px",
                    fontSize: 11,
                    opacity: safePage === 1 ? 0.4 : 1,
                  }}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safePage) <= 1,
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`ellipsis-${i}`}
                        style={{
                          padding: "4px 6px",
                          fontSize: 11,
                          color: "#9CA3AF",
                        }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        style={{
                          ...S.btnOutline,
                          padding: "4px 8px",
                          fontSize: 11,
                          minWidth: 28,
                          background: p === safePage ? "#1D4ED8" : "white",
                          color: p === safePage ? "white" : "#6B7280",
                          borderColor: p === safePage ? "#1D4ED8" : "#D1D5DB",
                        }}
                      >
                        {p}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={safePage === totalPages}
                  style={{
                    ...S.btnOutline,
                    padding: "4px 8px",
                    fontSize: 11,
                    opacity: safePage === totalPages ? 0.4 : 1,
                  }}
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage === totalPages}
                  style={{
                    ...S.btnOutline,
                    padding: "4px 8px",
                    fontSize: 11,
                    opacity: safePage === totalPages ? 0.4 : 1,
                  }}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        student={profileStudent}
        onClose={() => setProfileId(null)}
        onEdit={() => {
          setProfileId(null);
          setEditStudent({ ...profileStudent });
        }}
      />

      {editStudent && (
        <EditModal
          student={editStudent}
          departments={departments}
          statuses={statuses}
          onSave={saveEdit}
          onClose={() => setEditStudent(null)}
        />
      )}
    </div>
  );
}
