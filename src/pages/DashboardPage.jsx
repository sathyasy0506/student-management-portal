import { useEffect, useMemo, useState } from "react";
import { S } from "../styles";
import { getBatch, exportCSV } from "../utils";
import { Badge, DeptPill, Topbar } from "../components/shared";
import { getStudentStats } from "../services/statsService";
import { getStudents } from "../services/studentService";
import { useBreakpoint } from "../hooks/useBreakpoint";

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Students",
    sub: "All records",
    color: "#6366F1",
    bg: "#EEF2FF",
    icon: "◎",
  },
  {
    key: "active",
    label: "Active",
    sub: "Currently enrolled",
    color: "#10B981",
    bg: "#ECFDF5",
    icon: "●",
  },
  {
    key: "grad",
    label: "Graduated",
    sub: "Completed",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    icon: "✓",
  },
  {
    key: "depts",
    label: "Departments",
    sub: "Total departments",
    color: "#F59E0B",
    bg: "#FFFBEB",
    icon: "⊞",
  },
];

export default function DashboardPage({ setPage, showToast, onMenuClick }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [statsData, setStatsData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  async function loadDashboard() {
    try {
      setLoadingStats(true);
      setLoadingStudents(true);

      const [stats, studentList] = await Promise.all([
        getStudentStats(),
        getStudents(),
      ]);

      setStatsData(stats);
      setStudents(studentList || []);
    } catch (error) {
      showToast?.(error.message || "Failed to load dashboard");
    } finally {
      setLoadingStats(false);
      setLoadingStudents(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const total = Number(statsData?.overall_count || 0);

  const active = useMemo(() => {
    const row = (statsData?.status_counts || []).find(
      (item) => item.status_name === "Active",
    );
    return Number(row?.total_students || 0);
  }, [statsData]);

  const grad = useMemo(() => {
    const row = (statsData?.status_counts || []).find(
      (item) => item.status_name === "Graduated",
    );
    return Number(row?.total_students || 0);
  }, [statsData]);

  const depts = Number((statsData?.department_counts || []).length || 0);

  const stats = {
    total,
    active,
    grad,
    depts,
  };

  const recent = useMemo(() => {
    const list = [...students];

    list.sort((a, b) => {
      const aTime = new Date(
        a.created_on || a.createdOn || a.added || 0,
      ).getTime();
      const bTime = new Date(
        b.created_on || b.createdOn || b.added || 0,
      ).getTime();

      return bTime - aTime;
    });

    return list.slice(0, 8);
  }, [students]);

  const isLoading = loadingStats || loadingStudents;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Dashboard" crumb="overview" onMenuClick={onMenuClick}>
        <button
          onClick={() => exportCSV(students)}
          style={{ ...S.btnOutline, fontSize: 12 }}
        >
          ↓ Export CSV
        </button>

        <button
          onClick={() => setPage("add")}
          style={{ ...S.btnPrimary, fontSize: 12 }}
        >
          + New Student
        </button>
      </Topbar>

      <div
        style={{
          padding: isMobile ? 12 : isTablet ? 20 : 28,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : isTablet
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
            gap: isMobile ? 10 : 16,
          }}
        >
          {STAT_CARDS.map((sc) => (
            <div
              key={sc.key}
              style={{
                ...S.statCard,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#64748B",
                  }}
                >
                  {sc.label}
                </span>

                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: sc.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: sc.color,
                  }}
                >
                  {sc.icon}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#0F172A",
                    fontFamily: "'IBM Plex Mono',monospace",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {loadingStats ? "..." : stats[sc.key]}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#94A3B8",
                    marginTop: 4,
                  }}
                >
                  {sc.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Recent Students</span>

            <button
              onClick={() => setPage("students")}
              style={{ ...S.btnOutline, fontSize: 12, padding: "6px 12px" }}
            >
              View All →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Name", "Roll No", "Department", "Batch", "Status"].map(
                    (h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        ...S.td,
                        textAlign: "center",
                        color: "#94A3B8",
                        padding: 48,
                      }}
                    >
                      Loading records...
                    </td>
                  </tr>
                ) : recent.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        ...S.td,
                        textAlign: "center",
                        color: "#94A3B8",
                        padding: 48,
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  recent.map((s) => (
                    <tr key={s.id} style={{ transition: "background 0.1s" }}>
                      <td style={S.td}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#6366F1",
                            cursor: "pointer",
                          }}
                        >
                          {s.full_name || s.name || "—"}
                        </span>
                      </td>

                      <td
                        style={{
                          ...S.td,
                          fontFamily: "'IBM Plex Mono',monospace",
                          fontSize: 12,
                          color: "#94A3B8",
                        }}
                      >
                        {s.roll_number || s.roll || "—"}
                      </td>

                      <td style={S.td}>
                        <DeptPill name={s.department_name || s.dept || "—"} />
                      </td>

                      <td
                        style={{
                          ...S.td,
                          fontFamily: "'IBM Plex Mono',monospace",
                          fontSize: 12,
                          color: "#64748B",
                        }}
                      >
                        {getBatch(s)}
                      </td>

                      <td style={S.td}>
                        <Badge status={s.status_name || s.status || "—"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
