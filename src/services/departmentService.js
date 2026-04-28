// src/services/departmentService.js
import apiEndpoints from "../../api/api";
import { protectedJson } from "./authService";

export async function getDepartments() {
  const result = await protectedJson(apiEndpoints.departments.list, {
    method: "GET",
  });

  return result?.data?.departments || [];
}

export async function addDepartment(payload) {
  const result = await protectedJson(apiEndpoints.departments.add, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result;
}

export async function updateDepartment(payload) {
  const result = await protectedJson(apiEndpoints.departments.update, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result;
}

export async function deleteDepartment(id) {
  const result = await protectedJson(apiEndpoints.departments.delete, {
    method: "POST",
    body: JSON.stringify({ id }),
  });

  return result;
}
