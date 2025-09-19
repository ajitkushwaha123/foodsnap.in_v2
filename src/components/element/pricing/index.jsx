"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { fetchSubscriptions } from "@/helpers";

export default function PricingSection() {
  const [plans, setPlans] = useState([]);

  const getSubscriptions = async () => {
    const response = await fetchSubscriptions();
    if (response.success) {
      setPlans(response.data);
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, []);

  console.log(plans);

  return (
    <section id="pricing" className="px-4 py-12 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
        Choose Your Perfect Plan
      </h2>
      <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-xl mx-auto mb-10">
        Simple, scalable pricing designed for food businesses of every size —
        from cloud kitchens to fine dining.
      </p>

      <motion.div
        key={plans.length} // Re-animate when plans change
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            whileHover={plan.highlight ? { scale: 1.03 } : { y: -4 }}
            className={`relative rounded-2xl border transition-all duration-300 p-8 text-left ${
              plan.highlight
                ? "bg-gradient-to-b from-purple-100 to-white dark:from-[#1d1b3d] dark:to-[#121026] border-purple-400 dark:border-[#7c68ff] shadow-xl"
                : "bg-white border-gray-200 dark:bg-[#0a092d] dark:border-neutral-700"
            } backdrop-blur-lg shadow-md dark:shadow-black/20 transition-colors`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                Most Popular
              </span>
            )}

            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {plan.name}
            </h3>
            <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {plan.price}
            </p>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-300 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="https://app.foodsnap.in/sign-up?redirect=%2Fpricing"
              className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                plan.highlight
                  ? "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#ffffff10] dark:text-white dark:hover:bg-[#ffffff20]"
              }`}
            >
              {plan.button} <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
