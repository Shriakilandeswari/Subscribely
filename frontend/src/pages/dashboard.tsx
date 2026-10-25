import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
type Pdf = {
  id: number;
  title: string;
};

const pdfs: Pdf[] = [
  { id: 1, title: "PDF 1" },
  { id: 2, title: "PDF 2" },
  { id: 3, title: "PDF 3" },
  { id: 4, title: "PDF 4" },
];
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const goToPricing = () => {
    navigate("/pricing");
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const openPdf = async (pdf: Pdf) => {
    try {
      const response = await api.get(`/plans/pdf/${pdf.id}`, {
        responseType: "blob",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);

      window.open(url);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setShowUpgradeModal(true);
        return;
      }

      console.error("Error opening PDF", error);
    }
  };

  return (
    <>
      {showUpgradeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold mb-4">Upgrade Required</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-sm mb-4"
              >
                Close
              </button>
            </div>

            <p className="mb-4">
              This PDF is available only for Premium users.
            </p>

            <button
              onClick={() => navigate("/pricing")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Plans
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex gap-5">
            <button
              onClick={goToPricing}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Plans
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="p-10">
          <h2 className="text-3xl font-bold mb-6">Available PDFs</h2>
          <div className="grid grid-cols-4 gap-6">
            {pdfs.map(pdf => {
              return (
                <div
                  key={pdf.id}
                  className="bg-white p-6 rounded-lg shadow flex flex-col gap-3 m-10"
                >
                  <h3 className="text-xl font-semibold">{pdf.title}</h3>

                  <button
                    onClick={() => openPdf(pdf)}
                    className={"px-4 py-2 rounded bg-blue-600 text-black"}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
