// import { useEffect, useState } from "react";
// import api from "../api/axios";

// type Plan = {
//   _id: string;
//   name: string;
//   price: number;
//   stripePriceId: string;
//   features: string[];
// };

// function Pricing() {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

//   // useEffect(() => {
//   //   const fetchPlans = async () => {
//   //     try {
//   //       const res = await api.get<Plan[]>("/plans");
//   //       setPlans(res.data);
//   //     } catch (error) {
//   //       console.error("Error fetching plans", error);
//   //     }
//   //   };

//   //   fetchPlans();
//   // }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const plansRes = await api.get<Plan[]>("/plans");
//         setPlans(plansRes.data);

//         const userPlanRes = await api.get("/plans/current-plan");
//         setCurrentPlanId(userPlanRes.data.planId);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleCheckout = async (priceId: string) => {
//     try {
//       const res = await api.post("/billing/create-checkout-session", {
//         price: priceId,
//       });

//       window.location.href = res.data.url;
//     } catch (error) {
//       console.error("Checkout error", error);
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Pricing</h1>

//       <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//         {plans.map(plan => (
//           <div
//             key={plan._id}
//             style={{
//               border: "1px solid #ddd",
//               padding: "20px",
//               borderRadius: "10px",
//               width: "250px",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <h2>{plan.name}</h2>

//             <p style={{ fontSize: "24px", fontWeight: "bold" }}>
//               ${plan.price}/month
//             </p>

//             <ul>
//               {plan.features.map((feature, index) => (
//                 <li key={index}>{feature}</li>
//               ))}
//             </ul>

//             <button
//               disabled={plan._id === currentPlanId}
//               onClick={() => handleCheckout(plan.stripePriceId)}
//               style={{
//                 marginTop: "auto",
//                 padding: "10px",
//                 width: "100%",
//                 cursor: plan._id === currentPlanId ? "default" : "pointer",
//                 backgroundColor:
//                   plan._id === currentPlanId ? "#4CAF50" : "#007bff",
//                 color: "white",
//               }}
//             >
//               {plan._id === currentPlanId ? "✔ Current Plan" : "Upgrade Plan"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Pricing;

import { useEffect, useState } from "react";
import api from "../api/axios";

type Plan = {
  _id: string;
  name: string;
  price: number;
  stripePriceId: string;
  features: string[];
};

function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await api.get<Plan[]>("/plans");
        setPlans(plansRes.data);

        const userPlanRes = await api.get("/plans/current-plan");
        setCurrentPlanId(userPlanRes.data.planId);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);

      const res = await api.post("/billing/create-checkout-session", {
        price: priceId,
      });

      window.location.href = res.data.url;
    } catch (error) {
      console.error("Checkout error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-8 text-3xl font-bold">Choose Your Plan</h1>

      <div className="flex w-full justify-center gap-8">
        {plans.map(plan => (
          <div
            key={plan._id}
            className="flex flex-col w-1/4 rounded-2xl bg-white p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold">{plan.name}</h2>

            <div className="mt-4 text-4xl font-bold">
              ${plan.price}
              <span className="ml-1 text-base font-normal text-gray-500">
                /month
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-gray-600">
              {plan.features.map((feature, index) => (
                <li key={index}>✔ {feature}</li>
              ))}
            </ul>

            <button
              disabled={plan._id === currentPlanId || loading}
              onClick={() => handleCheckout(plan.stripePriceId)}
              className={`mt-auto rounded-lg px-6 py-2 text-white transition 
              ${
                plan._id === currentPlanId
                  ? "bg-green-500 cursor-default"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {plan._id === currentPlanId
                ? "✔ Current Plan"
                : loading
                  ? "Processing..."
                  : "Upgrade Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
