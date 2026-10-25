import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const processed = useRef(false); // 👈 Prevents double-processing

  useEffect(() => {
    if (processed.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log(
      "URL Token detected:",
      token ? "Yes (Length: " + token.length + ")" : "No",
    );

    if (token && token !== "undefined") {
      processed.current = true;
      sessionStorage.setItem("google_access_token", token);

      // Use replace: true so they can't go "back" to the login URL
      navigate("/dashboard", { replace: true });
    } else {
      // If we land here without a token, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <h2>Authenticating...</h2>
    </div>
  );
};

export default AuthSuccess;
