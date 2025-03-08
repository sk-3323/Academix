import React from "react";
import { Gem, CheckCircle, XCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center text-gray-900 dark:text-gray-100">
      <section className="py-16 text-center">
        <div className="mb-12">
          <span className="text-lg font-semibold uppercase text-emerald-500">
            Get plan
          </span>
          <h2 className="text-4xl mt-2 mb-8">Choose a Plan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
          {/* Basic Plan */}
          <div className="max-w-md mx-auto">
            <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-3xl overflow-hidden border-b-8 border-gray-900 dark:border-gray-300">
              <div className="relative pt-12 pb-16 px-8 text-center bg-gray-900 dark:bg-gray-200">
                <div className="absolute left-0 bottom-0 h-20 w-full bg-white dark:bg-gray-800 rounded-t-full"></div>
                <div className="relative z-10">
                  <div className="h-40 w-40 bg-white dark:bg-gray-800 rounded-full mx-auto p-2.5 border-4 border-gray-900 dark:border-gray-300 flex items-center justify-center">
                    <Gem
                      size={70}
                      className="text-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 text-center">
                <div className="text-xl font-semibold">Basic</div>
                <h4 className="text-2xl font-bold my-2">FREE</h4>
                <ul className="my-6 mx-4 space-y-2">
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Conference plans
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Free Lunch And Coffee
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Certificate
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <XCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Easy Access
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <XCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Free Contacts
                  </li>
                </ul>
                <div className="mt-8 mb-4">
                  <Button
                    disabled
                    className="px-6 py-2 font-bold rounded cursor-not-allowed text-gray-900 dark:text-gray-200 border  border-gray-900 dark:border-gray-300 bg-transparent"
                  >
                    Current Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="max-w-sm mx-auto">
            <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-3xl overflow-hidden border-b-8 border-yellow-500">
              <div className="relative pt-12 pb-16 px-8 text-center bg-yellow-500">
                <div className="absolute left-0 bottom-0 h-20 w-full bg-white dark:bg-gray-800 rounded-t-full"></div>
                <div className="relative z-10">
                  <div className="h-40 w-40 bg-white dark:bg-gray-800 rounded-full mx-auto p-2.5 border-4 border-yellow-500 flex items-center justify-center">
                    <Crown size={70} className="text-yellow-500" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 text-center">
                <div className="text-xl font-semibold">Premium</div>
                <h4 className="text-2xl font-bold my-2 text-yellow-500">
                  ₹299
                </h4>
                <ul className="my-6 mx-4 space-y-2">
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Conference plans
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Free Lunch And Coffee
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Certificate
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <CheckCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Easy Access
                  </li>
                  <li className="flex items-center py-2 border-b border-dashed border-gray-300 dark:border-gray-300">
                    <XCircle
                      size={18}
                      className="mr-3 text-gray-900 dark:text-gray-200"
                    />{" "}
                    Free Contacts
                  </li>
                </ul>
                <div className="mt-8 mb-4">
                  <Button className="px-6 py-2 font-bold rounded cursor-pointer text-white hover:bg-yellow-700 bg-yellow-500 border border-yellow-500">
                    Upgrade Premium Plan{" "}
                    <Crown size={16} className="inline-block ml-2 -mt-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
