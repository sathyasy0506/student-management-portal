export function getBatch(s) {
  if (s?.batch_start_year && s?.batch_end_year) {
    return `${s.batch_start_year}-${s.batch_end_year}`;
  }
  return "—";
}

export function exportCSV(students) {
  if (!students.length) return;

  const headers = [
    "Name",
    "Roll No",
    "Department",
    "Batch",
    "Gender",
    "DOB",
    "Email",
    "Phone",
    "Address",
    "Status",
  ];

  const rows = students.map((s) => [
    s.full_name || "",
    s.roll_number || "",
    s.department_name || "",
    getBatch(s),
    s.gender || "",
    s.date_of_birth || "",
    s.email || "",
    s.phone || "",
    s.address || "",
    s.status_name || "",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "students_export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}