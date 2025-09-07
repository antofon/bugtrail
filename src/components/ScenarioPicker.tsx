"use client";

import { ScenarioId } from "@/lib/types";
import { scenarioBriefs } from "@/lib/scenarioBriefs";
import { motion } from "framer-motion";
import { Lightbulb, Zap } from "lucide-react";

interface ScenarioPickerProps {
  selectedScenario: ScenarioId | null;
  onScenarioChange: (scenarioId: ScenarioId) => void;
}

export default function ScenarioPicker({ selectedScenario, onScenarioChange }: ScenarioPickerProps) {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center space-x-3">
        <Zap className="w-5 h-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Choose Scenario</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarioBriefs.map((scenario, index) => (
          <motion.button
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            className={`btn-pill btn-glow relative overflow-hidden min-h-[80px] flex items-center justify-center text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
              selectedScenario === scenario.id
                ? "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-2xl pulse-glow"
                : "glass-subtle text-gray-200 hover:glass-strong hover:text-white border border-white/10"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 font-semibold text-sm px-2">
              {scenario.title}
            </span>
            
            {/* Animated background for selected state */}
            {selectedScenario === scenario.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-500/20 to-purple-600/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      <motion.div 
        className="glass-subtle p-4 rounded-2xl border border-blue-400/20 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-sm text-blue-100 leading-relaxed">
            <span className="font-semibold text-blue-300">Pro Tip:</span> The customer will reveal one new fact per turn following realistic support patterns.
          </div>
        </div>
        
        {/* Subtle animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 -z-10"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
      </motion.div>
    </motion.div>
  );
}
