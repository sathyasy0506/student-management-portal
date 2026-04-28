// src/api/api.js

// const API_BASE_URL = "http://localhost/backend";
const API_BASE_URL = "https://backend.iamsathya.in";

const apiEndpoints = {
  login: `${API_BASE_URL}/auth/login.php`,
  signup: `${API_BASE_URL}/auth/signup.php`,
  logout: `${API_BASE_URL}/auth/logout.php`,
  refresh: `${API_BASE_URL}/auth/refresh.php`,

  departments: {
    list: `${API_BASE_URL}/departments/list.php`,
    view: `${API_BASE_URL}/departments/view.php`,
    add: `${API_BASE_URL}/departments/add.php`,
    update: `${API_BASE_URL}/departments/update.php`,
    delete: `${API_BASE_URL}/departments/delete.php`,
    dropdown: `${API_BASE_URL}/departments/dropdown.php`,
  },

  students: {
    list: `${API_BASE_URL}/students/list.php`,
    view: `${API_BASE_URL}/students/view.php`,
    add: `${API_BASE_URL}/students/add.php`,
    update: `${API_BASE_URL}/students/update.php`,
    delete: `${API_BASE_URL}/students/delete.php`,
  },

  status: {
    list: `${API_BASE_URL}/status/list.php`,
  },

  stats: {
    studentStats: `${API_BASE_URL}/stats/stats.php`,
  },
};

export default apiEndpoints;
