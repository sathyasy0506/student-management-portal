import { useEffect, useState } from "react";
import { S } from "../styles";
import { Topbar, IconBtn } from "../components/shared";
import { useBreakpoint } from "../hooks/useBreakpoint";
import DepartmentModal from "../components/DepartmentModal";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";

export default function DepartmentsPage({
  departments,
  setDepartments,
  showToast,
  onMenuClick,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useBreakpoint();

  async function loadDepartments() {
    try {
      setLoading(true);
      const list = await getDepartments();
      setDepartments(list);
    } catch (error) {
      showToast(error.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  function openAdd() {
    setEditDept(null);
    setShowModal(true);
  }

  function openEdit(dept) {
    setEditDept(dept);
    setShowModal(true);
  }

  async function handleSave(form) {
    try {
      if (editDept) {
        await updateDepartment({
          id: editDept.id,
          name: form.name,
          code: form.code,
          intake: Number(form.intake || 0),
          head: form.head,
          is_active: editDept.is_active ?? 1,
        });
        showToast("Department updated successfully");
      } else {
        await addDepartment({
          name: form.name,
          code: form.code,
          intake: Number(form.intake || 0),
          head: form.head,
        });
        showToast("Department added successfully");
      }

      setShowModal(false);
      setEditDept(null);
      await loadDepartments();
    } catch (error) {
      showToast(error.message || "Failed to save department");
    }
  }

  async function handleDelete(id, deptName) {
    if (!window.confirm(`Delete department "${deptName}"?`)) return;

    try {
      await deleteDepartment(id);
      showToast("Department deleted successfully");
      await loadDepartments();
    } catch (error) {
      showToast(error.message || "Failed to delete department");
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Departments" crumb="manage" onMenuClick={onMenuClick}>
        <button
          onClick={openAdd}
          style={{ ...S.btnPrimary, fontSize: 12, padding: "6px 12px" }}
        >
          + Add Department
        </button>
      </Topbar>

      <div style={{ padding: isMobile ? 12 : 28 }}>
        {loading ? (
          <div style={S.card}>Loading departments...</div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  style={{ ...S.card, padding: 0, overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          background: "#EFF6FF",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#1D4ED8",
                          fontFamily: "'IBM Plex Mono',monospace",
                          border: "1px solid #DBEAFE",
                        }}
                      >
                        {dept.code}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#111827",
                          }}
                        >
                          {dept.name}
                        </div>
                        {dept.head && (
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                            HOD: {dept.head}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 4 }}>
                      <IconBtn
                        icon="✎"
                        title="Edit"
                        onClick={() => openEdit(dept)}
                      />
                      <IconBtn
                        icon="✕"
                        title="Delete"
                        onClick={() => handleDelete(dept.id, dept.name)}
                      />
                    </div>
                  </div>

                  <div
                    style={{ padding: "10px 18px", display: "flex", gap: 20 }}
                  >
                    <Stat
                      label="Total"
                      value={dept.student_count || 0}
                      color="#111827"
                    />
                    <Stat
                      label="Active"
                      value={dept.student_count || 0}
                      color="#10B981"
                    />
                    <Stat
                      label="Intake"
                      value={dept.intake || 0}
                      color="#6366F1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>
                  All Departments ({departments.length})
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
                      {[
                        "Code",
                        "Department Name",
                        "HOD",
                        "Intake",
                        "Students",
                        "Actions",
                      ].map((h) => (
                        <th key={h} style={S.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id}>
                        <td style={S.td}>
                          <span
                            style={{
                              background: "#EFF6FF",
                              color: "#1D4ED8",
                              border: "1px solid #DBEAFE",
                              padding: "2px 6px",
                              borderRadius: 3,
                              fontFamily: "'IBM Plex Mono',monospace",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {dept.code}
                          </span>
                        </td>

                        <td style={{ ...S.td, fontWeight: 600 }}>
                          {dept.name}
                        </td>
                        <td style={{ ...S.td, color: "#6B7280", fontSize: 12 }}>
                          {dept.head || "—"}
                        </td>
                        <td
                          style={{
                            ...S.td,
                            fontFamily: "'IBM Plex Mono',monospace",
                            fontSize: 12,
                          }}
                        >
                          {dept.intake || "—"}
                        </td>
                        <td
                          style={{
                            ...S.td,
                            fontFamily: "'IBM Plex Mono',monospace",
                            fontSize: 12,
                          }}
                        >
                          {dept.student_count || 0}
                        </td>

                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <IconBtn
                              icon="✎"
                              title="Edit"
                              onClick={() => openEdit(dept)}
                            />
                            <IconBtn
                              icon="✕"
                              title="Delete"
                              onClick={() => handleDelete(dept.id, dept.name)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <DepartmentModal
          editDept={editDept}
          departments={departments}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "'IBM Plex Mono',monospace",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
