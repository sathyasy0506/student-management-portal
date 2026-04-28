import apiEndpoints from "../../api/api";
import { protectedJson } from "./authService";

export async function getStudentStats() {
  const result = await protectedJson(apiEndpoints.stats.studentStats, {
    method: "GET",
  });

  return (
    result?.data || {
      overall_count: 0,
      status_labels: [],
      status_counts: [],
      department_counts: [],
      batch_counts: [],
      department_status_counts: [],
      department_status_chart: [],
      gender_counts: [],
      gender_chart: {
        Male: 0,
        Female: 0,
        Other: 0,
        Unknown: 0,
      },
    }
  );
}
