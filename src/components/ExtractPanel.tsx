"use client";

import { BugTrail } from "@/lib/types";
import { motion } from "framer-motion";
import { FileText, Copy, CheckCircle, AlertCircle, Target, Zap, Tag } from "lucide-react";
import { useState } from "react";
import Button from "./Button";

interface ExtractPanelProps {
  bugtrail: BugTrail | null;
  onCopyMarkdown: () => void;
  onCopyJira: () => void;
}

export default function ExtractPanel({ bugtrail, onCopyMarkdown, onCopyJira }: ExtractPanelProps) {
  const [copiedType, setCopiedType] = useState<'markdown' | 'jira' | null>(null);

  const handleCopy = (type: 'markdown' | 'jira') => {
    if (type === 'markdown') {
      onCopyMarkdown();
    } else {
      onCopyJira();
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  if (!bugtrail) {
    return (
      <div className="glass-strong rounded-2xl border border-white/20 p-6 sm:p-8 card-hover relative overflow-hidden h-[500px] sm:h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <FileText className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">BugTrail Report</h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Generate a BugTrail from your conversation to see the structured report here.
          </p>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 pointer-events-none" />
      </div>
    );
  }

  return (
    <motion.div 
      className="glass-strong rounded-2xl border border-white/20 p-6 sm:p-8 card-hover relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">BugTrail Report</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCopy('markdown')} 
            className="text-xs sm:text-sm flex items-center space-x-2"
          >
            {copiedType === 'markdown' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'markdown' ? 'Copied!' : 'Copy Markdown'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCopy('jira')} 
            className="text-xs sm:text-sm flex items-center space-x-2"
          >
            {copiedType === 'jira' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'jira' ? 'Copied!' : 'Copy for Jira'}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-8 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-blue-400">Title</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-blue-400/20">
            <p className="text-white leading-relaxed">{bugtrail.title || "No title provided"}</p>
      </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-purple-400">Summary</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-purple-400/20">
            <p className="text-white leading-relaxed">{bugtrail.summary || "No summary provided"}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-cyan-400">Environment</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-cyan-400/20">
          {bugtrail.environment.length > 0 ? (
              <ul className="text-white space-y-2">
              {bugtrail.environment.map((env, index) => (
                <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                  {env}
                </li>
              ))}
            </ul>
          ) : (
              <p className="text-gray-400">No environment details provided</p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-4 h-4 text-orange-400" />
            <h3 className="text-base font-bold text-orange-400">Preconditions</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-orange-400/20">
          {bugtrail.preconditions.length > 0 ? (
              <ul className="text-white space-y-2">
              {bugtrail.preconditions.map((precondition, index) => (
                <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></span>
                  {precondition}
                </li>
              ))}
            </ul>
          ) : (
              <p className="text-gray-400">No preconditions specified</p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-emerald-400">Steps to Reproduce</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-emerald-400/20">
          {bugtrail.steps.length > 0 ? (
              <ol className="text-white space-y-3">
              {bugtrail.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold rounded-full mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                    <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
              <p className="text-gray-400">No steps provided</p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <h3 className="text-base font-bold text-yellow-400">Expected vs Actual</h3>
          </div>
          <div className="space-y-4">
            <div className="glass-subtle p-4 rounded-xl border border-green-400/20">
              <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                Expected:
              </h4>
              <p className="text-white leading-relaxed">{bugtrail.expected || "No expected behavior specified"}</p>
            </div>
            <div className="glass-subtle p-4 rounded-xl border border-red-400/20">
              <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-2" />
                Actual:
              </h4>
              <p className="text-white leading-relaxed">{bugtrail.actual || "No actual behavior specified"}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-pink-400" />
            <h3 className="text-base font-bold text-pink-400">Impact</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-pink-400/20">
            <p className="text-white leading-relaxed">{bugtrail.impact || "No impact assessment provided"}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-indigo-400">Evidence</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-indigo-400/20">
          {bugtrail.evidence.length > 0 ? (
              <ul className="text-white space-y-2">
              {bugtrail.evidence.map((evidence, index) => (
                <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 flex-shrink-0"></span>
                  {evidence}
                </li>
              ))}
            </ul>
          ) : (
              <p className="text-gray-400">No evidence provided</p>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="w-4 h-4 text-teal-400" />
            <h3 className="text-base font-bold text-teal-400">Tags</h3>
          </div>
          <div className="glass-subtle p-4 rounded-xl border border-teal-400/20">
          {bugtrail.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bugtrail.tags.map((tag, index) => (
                <span
                  key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold glass-subtle border border-teal-400/30 text-teal-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
              <p className="text-gray-400">No tags provided</p>
          )}
          </div>
        </motion.section>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 pointer-events-none" />
    </motion.div>
  );
}
