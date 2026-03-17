"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Code, 
  Search, 
  ShieldCheck, 
  LayoutTemplate,
  CheckCircle2,
  Settings,
  AlertCircle
} from "lucide-react";
import { type AioxAgent } from "./types";

const getAgentIcon = (role: string) => {
  switch(role) {
    case 'dev': return <Code className="w-6 h-6" />;
    case 'qa': return <ShieldCheck className="w-6 h-6" />;
    case 'researcher': return <Search className="w-6 h-6" />;
    case 'architect': return <LayoutTemplate className="w-6 h-6" />;
    default: return <Bot className="w-6 h-6" />;
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'idle': return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500';
    case 'working': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400';
    case 'success': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400';
    case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400';
    default: return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  }
};

export default function AgentDesk({ agent }: { agent: AioxAgent }) {
  const isWorking = agent.status === 'working';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-4 rounded-xl border-2 transition-colors duration-300 flex flex-col items-center justify-center gap-3 w-48 h-48 ${getStatusColor(agent.status)}`}
    >
      {/* Glow effect when working */}
      {isWorking && (
        <motion.div 
          className="absolute inset-0 rounded-xl bg-blue-400/20 blur-xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      {/* Agent Avatar/Icon */}
      <div className="relative z-10">
        <div className={`p-4 rounded-full bg-white dark:bg-slate-950 shadow-sm border ${isWorking ? 'border-blue-200 dark:border-blue-800' : 'border-transparent'}`}>
          {getAgentIcon(agent.role)}
        </div>
        
        {/* Status Indicator Badge */}
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-950 rounded-full p-0.5">
          {agent.status === 'working' && (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
              <Settings className="w-4 h-4 text-blue-500" />
            </motion.div>
          )}
          {agent.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {agent.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          {agent.status === 'idle' && <div className="w-3 h-3 m-0.5 rounded-full bg-slate-400" />}
        </div>
      </div>

      {/* Agent Info */}
      <div className="text-center relative z-10 w-full">
        <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
        <p className="text-xs opacity-70 uppercase tracking-widest">{agent.role}</p>
      </div>

      {/* Current Task Bubble */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          {agent.currentTask && (
            <motion.div 
              key={agent.currentTask}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="bg-slate-800 text-slate-100 text-xs py-2 px-3 rounded-lg shadow-xl border border-slate-700 mx-auto w-max max-w-full truncate text-center relative"
            >
              {agent.currentTask}
              {/* Tooltip triangle */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-b border-r border-slate-700 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
