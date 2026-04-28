import { useState } from "react";
import { S } from "../../styles";
import { loginUser } from "../../services/authService";

export default function LoginPage({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const errs = {};
    if (!username.trim()) errs.username = "Username is required";
    if (!password) errs.password = "Password is required";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await loginUser({
        username: username.trim(),
        password,
      });

      onLogin(result?.data?.user || { username });
    } catch (error) {
      setErrors({
        login: error.message || "Invalid username or password.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'IBM Plex Sans',sans-serif",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 22,
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
              marginBottom: 16,
            }}
          >
            S
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 4px",
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            Sign in to SMS Portal
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #F1F5F9",
            boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
            padding: 28,
          }}
        >
          <div
            style={{
              background: "#F8FAFF",
              border: "1px solid #E0E7FF",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 24,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#6366F1", fontSize: 14, marginTop: 1 }}>
              ℹ
            </span>
            <div style={{ fontSize: 12, color: "#4338CA" }}>
              Use your registered account to continue
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", ...S.formLabel, marginBottom: 6 }}
              >
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  ...S.formInput,
                  border: errors.username
                    ? "1.5px solid #EF4444"
                    : "1px solid #E2E8F0",
                }}
              />
              {errors.username && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: 11,
                    marginTop: 4,
                    margin: "4px 0 0",
                  }}
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{ display: "block", ...S.formLabel, marginBottom: 6 }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{
                    ...S.formInput,
                    paddingRight: 40,
                    border: errors.password
                      ? "1.5px solid #EF4444"
                      : "1px solid #E2E8F0",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    fontSize: 14,
                  }}
                >
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && (
                <p
                  style={{ color: "#EF4444", fontSize: 11, margin: "4px 0 0" }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {errors.login && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 12,
                  color: "#DC2626",
                }}
              >
                {errors.login}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...S.btnPrimary,
                width: "100%",
                justifyContent: "center",
                padding: "11px 0",
                fontSize: 14,
                opacity: loading ? 0.7 : 1,
                borderRadius: 10,
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "#64748B" }}>
              Don’t have an account?{" "}
            </span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              style={{
                background: "none",
                border: "none",
                color: "#6366F1",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Create account
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#CBD5E1",
            marginTop: 20,
          }}
        >
          SMS Portal v2.0 · SNS College of Technology
        </p>
      </div>
    </div>
  );
}
