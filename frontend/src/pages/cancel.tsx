import { useNavigate } from "react-router-dom";

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Payment Cancelled</h1>

      <p className="mt-4 text-gray-600">
        Your payment was cancelled. You can try again anytime.
      </p>

      <button
        onClick={() => navigate("/pricing")}
        className="mt-6 bg-black text-white px-6 py-2 rounded-lg"
      >
        Go Back to Pricing
      </button>
    </div>
  );
}
