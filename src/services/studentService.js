import apiEndpoints from "../../api/api";
import { protectedJson } from "./authService";

export async function getStudents() {
  const result = await protectedJson(apiEndpoints.students.list, {
    method: "GET",
  });

  return result?.data?.students || [];
}

export async function getStudentById(id) {
  const result = await protectedJson(`${apiEndpoints.students.view}?id=${id}`, {
    method: "GET",
  });

  return result?.data?.student || null;
}

export async function addStudent(payload) {
  return await protectedJson(apiEndpoints.students.add, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateStudent(payload) {
  return await protectedJson(apiEndpoints.students.update, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteStudent(id) {
  return await protectedJson(apiEndpoints.students.delete, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

export async function getDepartmentDropdown() {
  const result = await protectedJson(apiEndpoints.departments.dropdown, {
    method: "GET",
  });

  return result?.data?.departments || [];
}

export async function getStatusDropdown() {
  const result = await protectedJson(apiEndpoints.status.list, {
    method: "GET",
  });

  return result?.data?.statuses || [];
}
