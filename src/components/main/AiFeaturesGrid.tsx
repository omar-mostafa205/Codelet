"use client"
import React from "react";
import { motion } from "framer-motion";
import { BentoGridD } from "./BentoGridD";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function AIFeaturesGrid() {
  return (
    <div className="min-h-[200vh] bg-[#f8fafc] py-30 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-block mb-4">
            <span className="text-sm font-medium text-gray-600 border border-purple-700 rounded-full px-4 py-1 shadow-xl">
              FEATURES
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            The AI-powered developer <br />
            learning platform
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Codelet helps you explore, understand, and optimize any codebase
            effortlessly. Generate instant diagrams, walkthroughs, and
            explanations that accelerate learning and make complex systems easy
            to grasp.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <BentoGridD />
      </motion.div>
    </div>
  );
}
