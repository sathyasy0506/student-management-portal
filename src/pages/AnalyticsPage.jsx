import { useEffect, useMemo, useState } from "react";
import { S } from "../styles";
import { Topbar } from "../components/shared";
import { getStudentStats } from "../services/statsService";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function AnalyticsPage({ showToast, onMenuClick }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getStudentStats();
      setStats(data);
    } catch (error) {
      showToast?.(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const total = Number(stats?.overall_count || 0);
  const statusCounts = stats?.status_counts || [];
  const departmentCounts = stats?.department_counts || [];
  const batchCounts = stats?.batch_counts || [];
  const departmentStatusChart = stats?.department_status_chart || [];
  const genderChart = stats?.gender_chart || {
    Male: 0,
    Female: 0,
    Other: 0,
    Unknown: 0,
  };

  const active = useMemo(() => {
    const row = statusCounts.find((s) => s.status_name === "Active");
    return Number(row?.total_students || 0);
  }, [statusCounts]);

  const graduated = useMemo(() => {
    const row = statusCounts.find((s) => s.status_name === "Graduated");
    return Number(row?.total_students || 0);
  }, [statusCounts]);

  const discontinued = useMemo(() => {
    const row = statusCounts.find((s) => s.status_name === "Discontinued");
    return Number(row?.total_students || 0);
  }, [statusCounts]);

  const deptStats = useMemo(() => {
    return departmentCounts
      .map((dept) => {
        const chartRow =
          departmentStatusChart.find(
            (item) => Number(item.department_id) === Number(dept.department_id),
          ) || {};

        return {
          id: Number(dept.department_id),
          name: dept.department_name,
          code: dept.department_code,
          total: Number(dept.total_students || 0),
          active: Number(chartRow.Active || 0),
          graduated: Number(chartRow.Graduated || 0),
          discontinued: Number(chartRow.Discontinued || 0),
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [departmentCounts, departmentStatusChart]);

  const maxDept = Math.max(...deptStats.map((d) => d.total), 1);

  const batchStats = useMemo(() => {
    return batchCounts
      .map((b) => ({
        name: b.batch_name,
        total: Number(b.total_students || 0),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [batchCounts]);

  const maxBatch = Math.max(...batchStats.map((b) => b.total), 1);

  const male = Number(genderChart.Male || 0);
  const female = Number(genderChart.Female || 0);
  const other = Number(genderChart.Other || 0);
  const unknown = Number(genderChart.Unknown || 0);
  const genderTotal = male + female + other + unknown || 1;

  const kpis = [
    {
      label: "Total",
      value: total,
      color: "#6366F1",
      bg: "#EEF2FF",
      icon: "◎",
    },
    {
      label: "Active",
      value: active,
      color: "#10B981",
      bg: "#ECFDF5",
      icon: "●",
    },
    {
      label: "Graduated",
      value: graduated,
      color: "#8B5CF6",
      bg: "#F5F3FF",
      icon: "✓",
    },
    {
      label: "Discontinued",
      value: discontinued,
      color: "#F59E0B",
      bg: "#FFFBEB",
      icon: "○",
    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Analytics" crumb="overview" onMenuClick={onMenuClick} />

      <div style={{ padding: isMobile ? 12 : isTablet ? 20 : 28 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
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
            {kpis.map((k) => (
              <div
                key={k.label}
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
                    {k.label}
                  </span>

                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: k.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: k.color,
                    }}
                  >
                    {k.icon}
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
                    {k.value}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      height: 3,
                      background: "#F1F5F9",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: total ? `${(k.value / total) * 100}%` : "0%",
                        background: k.color,
                        borderRadius: 2,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "3fr 2fr" : "1fr",
              gap: 20,
            }}
          >
            <div style={S.card}>
              <div style={S.cardHeader}>
                <span style={S.cardTitle}>Students by Department</span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#94A3B8",
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  {deptStats.length} depts
                </span>
              </div>

              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {loading ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9CA3AF",
                      padding: 32,
                    }}
                  >
                    Loading analytics...
                  </div>
                ) : deptStats.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9CA3AF",
                      padding: 32,
                      fontFamily: "'IBM Plex Mono',monospace",
                      fontSize: 12,
                    }}
                  >
                    No department data available
                  </div>
                ) : (
                  deptStats.map((d, i) => {
                    const hues = [
                      "#6366F1",
                      "#10B981",
                      "#F59E0B",
                      "#8B5CF6",
                      "#EC4899",
                      "#EF4444",
                    ];
                    const color = hues[i % hues.length];

                    return (
                      <div key={d.id}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: color,
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#334155",
                              }}
                            >
                              {d.name}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "#10B981",
                                fontWeight: 600,
                              }}
                            >
                              {d.active} active
                            </span>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#0F172A",
                                fontFamily: "'IBM Plex Mono',monospace",
                              }}
                            >
                              {d.total}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            height: 6,
                            background: "#F1F5F9",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${(d.total / maxDept) * 100}%`,
                              background: color,
                              borderRadius: 3,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Status</span>
                </div>

                <div
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {[
                    { label: "Active", value: active, color: "#10B981" },
                    { label: "Graduated", value: graduated, color: "#6366F1" },
                    {
                      label: "Discontinued",
                      value: discontinued,
                      color: "#F59E0B",
                    },
                  ].map((row) => {
                    const pct = total
                      ? Math.round((row.value / total) * 100)
                      : 0;

                    return (
                      <div key={row.label}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "#64748B",
                              fontWeight: 500,
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#0F172A",
                              fontFamily: "'IBM Plex Mono',monospace",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>

                        <div
                          style={{
                            height: 5,
                            background: "#F1F5F9",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: row.color,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={S.card}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Gender</span>
                </div>

                <div
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {[
                    { label: "Male", value: male, color: "#6366F1" },
                    { label: "Female", value: female, color: "#EC4899" },
                    { label: "Other", value: other, color: "#F59E0B" },
                    { label: "Unknown", value: unknown, color: "#94A3B8" },
                  ].map((row) => {
                    const pct = Math.round((row.value / genderTotal) * 100);

                    return (
                      <div key={row.label}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "#64748B",
                              fontWeight: 500,
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#0F172A",
                              fontFamily: "'IBM Plex Mono',monospace",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>

                        <div
                          style={{
                            height: 5,
                            background: "#F1F5F9",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: row.color,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>Enrollment by Batch</span>
            </div>

            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "flex-end",
                gap: 12,
                height: 140,
              }}
            >
              {loading ? (
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: "#9CA3AF",
                  }}
                >
                  Loading batch stats...
                </div>
              ) : batchStats.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94A3B8",
                    fontSize: 13,
                  }}
                >
                  No batch data
                </div>
              ) : (
                batchStats.map((batch) => {
                  const h = Math.max(
                    12,
                    Math.round((batch.total / maxBatch) * 90),
                  );

                  return (
                    <div
                      key={batch.name}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#0F172A",
                          fontFamily: "'IBM Plex Mono',monospace",
                        }}
                      >
                        {batch.total}
                      </span>

                      <div
                        style={{
                          width: "100%",
                          maxWidth: 40,
                          height: h,
                          background:
                            "linear-gradient(to top, #6366F1, #8B5CF6)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.5s ease",
                        }}
                      />

                      <span
                        style={{
                          fontSize: 10,
                          color: "#94A3B8",
                          fontFamily: "'IBM Plex Mono',monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {batch.name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>Department Summary</span>
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
                      "Department",
                      "Total",
                      "Active",
                      "Graduated",
                      "Discontinued",
                    ].map((h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          ...S.td,
                          textAlign: "center",
                          color: "#9CA3AF",
                          padding: 48,
                        }}
                      >
                        Loading department summary...
                      </td>
                    </tr>
                  ) : deptStats.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          ...S.td,
                          textAlign: "center",
                          color: "#9CA3AF",
                          padding: 48,
                          fontFamily: "'IBM Plex Mono',monospace",
                          fontSize: 12,
                        }}
                      >
                        No department summary available
                      </td>
                    </tr>
                  ) : (
                    deptStats.map((d) => (
                      <tr key={d.id}>
                        <td style={S.td}>
                          <span
                            style={{
                              background: "#EEF2FF",
                              color: "#4F46E5",
                              border: "1px solid #C7D2FE",
                              padding: "3px 8px",
                              borderRadius: 20,
                              fontFamily: "'IBM Plex Mono',monospace",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {d.code}
                          </span>
                        </td>

                        <td
                          style={{
                            ...S.td,
                            fontWeight: 600,
                            color: "#0F172A",
                          }}
                        >
                          {d.name}
                        </td>

                        <td
                          style={{
                            ...S.td,
                            fontFamily: "'IBM Plex Mono',monospace",
                            fontWeight: 700,
                          }}
                        >
                          {d.total}
                        </td>

                        <td
                          style={{
                            ...S.td,
                            fontFamily: "'IBM Plex Mono',monospace",
                            color: "#10B981",
                            fontWeight: 700,
                          }}
                        >
                          {d.active}
                        </td>

                        <td
                          style={{
                            ...S.td,
                            fontFamily: "'IBM Plex Mono',monospace",
                            color: "#6366F1",
                          }}
                        >
                          {d.graduated}
                        </td>

                        <td
                          style={{
                            ...S.td,
                            fontFamily: "'IBM Plex Mono',monospace",
                            color: "#F59E0B",
                          }}
                        >
                          {d.discontinued}
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
    </div>
  );
}
