import React from "react";
import { Gem, CheckCircle, XCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    id: 1,
    title: "Basic",
    price: "FREE",
    icon: Gem,
    features: [
      "Conference plans",
      "Free Lunch And Coffee",
      "Certificate",
      "Easy Access",
      "Free Contacts",
    ],
    available: [true, true, true, false, false],
    color: "#151515",
    buttonText: "Current Plan",
    isDisabled: true,
  },
  {
    id: 2,
    title: "Premium",
    price: "₹299",
    icon: Crown,
    features: [
      "Conference plans",
      "Free Lunch And Coffee",
      "Certificate",
      "Easy Access",
      "Free Contacts",
    ],
    available: [true, true, true, true, false],
    color: "#151515",
    buttonText: "Upgrade Premium Plan",
    isDisabled: false,
  },
];

const page = () => {
  return (
    <div>
      <div className="min-h-screen flex justify-center items-center">
        <section className="py-16 text-center">
          <div className="mb-12">
            <span className="text-lg font-semibold uppercase text-emerald-500">
              Get plan
            </span>
            <h2 className="text-4xl mt-2 mb-8">Choose a Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center">
            {pricingPlans.map((plan) => (
              <div key={plan.id} className="max-w-md mx-auto">
                <div
                  className="relative bg-white dark:bg-black shadow-xl rounded-3xl overflow-hidden"
                  style={{ borderBottom: `20px solid ${plan.color}` }}
                >
                  <div
                    className="relative pt-12 pb-16 px-8 text-center"
                    style={{ backgroundColor: plan.color }}
                  >
                    <div className="absolute left-0 bottom-0 h-20 w-full bg-white dark:bg-black rounded-t-full"></div>
                    <div className="relative z-10">
                      <div className="h-40 w-40 bg-white dark:bg-black rounded-full mx-auto p-2.5">
                        <div
                          className="h-full w-full rounded-full flex items-center justify-center"
                          style={{ border: `5px solid ${plan.color}` }}
                        >
                          <plan.icon
                            size={70}
                            className="transition-transform duration-500 ease-in-out group-hover:rotate-360"
                            style={{ color: plan.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-6">
                    <div className="text-xl font-semibold text-gray-800">
                      {plan.title}
                    </div>
                    <h4
                      className="text-2xl font-bold my-2"
                      style={{ color: plan.color }}
                    >
                      {plan.price}
                    </h4>

                    <ul className="my-6 mx-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className={`flex items-center justify-start py-2 border-b border-dashed border-gray-200 text-gray-600`}
                        >
                          {plan.available[index] ? (
                            <CheckCircle
                              size={18}
                              className="mr-3 text-gray-900"
                            />
                          ) : (
                            <XCircle size={18} className="mr-3 text-gray-900" />
                          )}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 mb-4">
                      <Button
                        disabled={plan.isDisabled}
                        className={`px-6 py-2 font-bold rounded ${plan.isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                        style={{
                          backgroundColor: plan.isDisabled
                            ? "transparent"
                            : plan.color,
                          borderColor: plan.isDisabled
                            ? "transparent"
                            : plan.color,
                          color: plan.isDisabled ? plan.color : "#fff",
                        }}
                      >
                        {plan.buttonText}{" "}
                        {plan.buttonText.includes("Upgrade") && (
                          <Crown
                            size={16}
                            className="inline-block ml-2 relative -mt-1"
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
