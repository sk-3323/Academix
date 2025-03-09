"use client";

import React from "react";
import { Gem, CheckCircle, XCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming you have a utility for className merging

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold uppercase tracking-wide">
            Select Your Plan
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-emerald-400">
            Pricing That Fits Your Needs
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Unlock the full potential of your learning journey with our plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Plan */}
          <div className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 rounded-full p-3 flex items-center justify-center">
                  <Gem size={40} className="text-gray-900 dark:text-gray-200" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-3xl font-extrabold mb-6">
                FREE
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {" "}
                  / forever
                </span>
              </p>
              <ul className="space-y-4 text-left mx-4 mb-8">
                {[
                  { text: "Conference plans", included: true },
                  { text: "Free Lunch And Coffee", included: true },
                  { text: "Certificate", included: true },
                  { text: "Easy Access", included: false },
                  { text: "Free Contacts", included: false },
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    {feature.included ? (
                      <CheckCircle
                        size={20}
                        className="mr-3 text-emerald-500"
                      />
                    ) : (
                      <XCircle size={20} className="mr-3 text-gray-400" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
              <Button
                disabled
                className="w-full py-3 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 font-semibold rounded-lg cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Current Plan
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-500 transition-all duration-300 hover:shadow-2xl scale-105 md:scale-100 md:hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent pointer-events-none"></div>
            <div className="p-8 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full p-3 flex items-center justify-center">
                  <Crown size={40} className="text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-3xl font-extrabold mb-6 text-yellow-500">
                ₹299
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {" "}
                  / month
                </span>
              </p>
              <ul className="space-y-4 text-left mx-4 mb-8">
                {[
                  { text: "Conference plans", included: true },
                  { text: "Free Lunch And Coffee", included: true },
                  { text: "Certificate", included: true },
                  { text: "Easy Access", included: true },
                  { text: "Free Contacts", included: false },
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    {feature.included ? (
                      <CheckCircle size={20} className="mr-3 text-yellow-500" />
                    ) : (
                      <XCircle size={20} className="mr-3 text-gray-400" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
              <Button className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
                Upgrade to Premium
                <Crown size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
