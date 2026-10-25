import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

function Success() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) return;

      await api.post("/billing/verify-session", {
        sessionId,
      });
    };

    verify();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>✅ Subscription Successful</h1>
      <p>Your plan has been activated.</p>
    </div>
  );
}

export default Success;
