"use client";

import { Persona } from "@/lib/types";
import { motion } from "framer-motion";
import { Users, ChevronDown } from "lucide-react";

interface PersonaControlsProps {
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

const personaFields = [
  {
    key: "industry" as keyof Persona,
    label: "Industry",
    options: [
      { value: "SaaS", label: "SaaS" },
      { value: "Ecommerce", label: "Ecommerce" },
      { value: "Fintech", label: "Fintech" },
      { value: "Gaming", label: "Gaming" }
    ]
  },
  {
    key: "techSavvy" as keyof Persona,
    label: "Tech Savvy",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ]
  },
  {
    key: "patience" as keyof Persona,
    label: "Patience",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ]
  },
  {
    key: "toneArc" as keyof Persona,
    label: "Tone Arc",
    options: [
      { value: "calm_to_frustrated", label: "Calm → Frustrated" },
      { value: "steady_calm", label: "Steady Calm" }
    ]
  },
  {
    key: "timezone" as keyof Persona,
    label: "Timezone",
    options: [
      { value: "America/Los_Angeles", label: "PT" },
      { value: "America/New_York", label: "ET" },
      { value: "Europe/London", label: "GMT" }
    ]
  }
];

export default function PersonaControls({ persona, onPersonaChange }: PersonaControlsProps) {
  const updatePersona = (field: keyof Persona, value: string) => {
    onPersonaChange({ ...persona, [field]: value });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        <Users className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Customer Persona</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {personaFields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              {field.label}
            </label>
            <div className="relative">
              <select
                value={persona[field.key]}
                onChange={(e) => updatePersona(field.key, e.target.value)}
                className="w-full text-sm glass-subtle border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 appearance-none cursor-pointer hover:glass-strong"
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Persona Preview */}
      <motion.div
        className="glass-subtle p-4 rounded-2xl border border-purple-400/20 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="text-sm text-purple-100">
          <span className="font-semibold text-purple-300">Current Persona:</span>{" "}
          A {persona.patience} patience, {persona.techSavvy} tech-savvy customer from the {persona.industry} industry
          {persona.toneArc === "calm_to_frustrated" ? ", starting calm but may get frustrated" : ", maintaining steady composure"}
          {" "}in {persona.timezone.split("/")[1]?.replace("_", " ") || persona.timezone} timezone.
        </div>
        
        {/* Subtle animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 -z-10"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
      </motion.div>
    </motion.div>
  );
}
