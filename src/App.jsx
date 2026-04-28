import { useState, useCallback, useEffect } from "react";
import { S } from "./styles";
import { Toast } from "./components/shared";
import Sidebar from "./components/Sidebar";
import { useBreakpoint } from "./hooks/useBreakpoint";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import AnalyticsPage from "./pages/AnalyticsPage";

import {
  AUTH_EXPIRED_EVENT,
  getStoredUser,
  isAuthenticated,
  logoutUser,
  silentRefresh,
} from "./services/authService";

import { getStudents } from "./services/studentService";
import { getDepartments } from "./services/departmentService";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDesktop } = useBreakpoint();

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }, []);

  // ✅ LOAD INITIAL DATA AFTER LOGIN
  async function loadInitialData() {
    try {
      const [studentsRes, deptRes] = await Promise.all([
        getStudents(),
        getDepartments(),
      ]);

      setStudents(studentsRes);
      setDepartments(deptRes);
    } catch (err) {
      showToast(err.message || "Failed to load data");
    }
  }

  // 🔁 Run when user logs in
  useEffect(() => {
    if (loggedIn) {
      loadInitialData();
    }
  }, [loggedIn]);

  // 🔄 On every page load, silently refresh tokens if the user is already logged in
  useEffect(() => {
    if (!loggedIn) return;
    silentRefresh().then((success) => {
      if (!success) {
        setLoggedIn(false);
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    function handleAuthExpired(event) {
      setLoggedIn(false);
      setCurrentUser(null);
      setPage("dashboard");
      setAuthPage("login");
      setSidebarOpen(false);
      setStudents([]);
      setDepartments([]);
      showToast(event.detail?.message || "Session expired. Please login again.");
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, [showToast]);

  function handleLogin(user) {
    setLoggedIn(true);
    setCurrentUser(user || getStoredUser());
    setPage("dashboard");
    showToast("Login successful");
  }

  async function handleLogout() {
    await logoutUser();

    setLoggedIn(false);
    setCurrentUser(null);
    setPage("dashboard");
    setAuthPage("login");
    setSidebarOpen(false);

    // clear data
    setStudents([]);
    setDepartments([]);

    showToast("Logged out successfully");
  }

  // 🔐 AUTH PAGES
  if (!loggedIn) {
    if (authPage === "signup") {
      return <SignupPage onSwitchToLogin={() => setAuthPage("login")} />;
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthPage("signup")}
      />
    );
  }

  function handleNavClick(id) {
    setPage(id);
    if (!isDesktop) setSidebarOpen(false);
  }

  const sharedProps = {
    students,
    setStudents,
    departments,
    setDepartments,
    setPage,
    showToast,
    onMenuClick: () => setSidebarOpen((o) => !o),
  };

  return (
    <div style={S.appBody}>
      {/* Mobile overlay backdrop */}
      {!isDesktop && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            zIndex: 40,
          }}
        />
      )}

      <Sidebar
        page={page}
        setPage={handleNavClick}
        studentCount={students.length}
        onLogout={handleLogout}
        currentUser={currentUser}
        isOpen={isDesktop || sidebarOpen}
        isMobile={!isDesktop}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={S.main}>
        {page === "dashboard" && <DashboardPage {...sharedProps} />}

        {page === "students" && <StudentsPage {...sharedProps} />}

        {page === "departments" && <DepartmentsPage {...sharedProps} />}

        {page === "analytics" && (
          <AnalyticsPage
            students={students}
            departments={departments}
            onMenuClick={() => setSidebarOpen((o) => !o)}
          />
        )}

        {page === "add" && <AddStudentPage {...sharedProps} />}
      </div>

      <Toast msg={toast} />
    </div>
  );
}
