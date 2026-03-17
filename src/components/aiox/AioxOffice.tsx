"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AgentDesk from "./AgentDesk";
import { type AioxAgent } from "./types";
import { Play, Square } from "lucide-react";

// Mock Data para demonstração do Office
const INITIAL_AGENTS: AioxAgent[] = [
  { id: '1', name: 'Alice (PM)', role: 'pm', status: 'idle' },
  { id: '2', name: 'Bob (Architect)', role: 'architect', status: 'idle' },
  { id: '3', name: 'Charlie (Dev)', role: 'dev', status: 'idle' },
  { id: '4', name: 'Diana (Dev)', role: 'dev', status: 'idle' },
  { id: '5', name: 'Eve (QA)', role: 'qa', status: 'idle' },
];

export default function AioxOffice() {
  const [agents, setAgents] = useState<AioxAgent[]>(INITIAL_AGENTS);
  const [isRunning, setIsRunning] = useState(false);

  // Efeito simulador de trabalho AIOX
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAgents(currentAgents => {
        return currentAgents.map(agent => {
          // Lógica randômica para simular estados
          const rand = Math.random();
          let newStatus = agent.status;
          let newTask = agent.currentTask;

          if (agent.status === 'idle') {
            if (rand > 0.7) {
              newStatus = 'working';
              newTask = `Iniciando tarefa de ${agent.role}...`;
            }
          } else if (agent.status === 'working') {
            if (rand > 0.8) {
              newStatus = rand > 0.9 ? 'error' : 'success';
              newTask = newStatus === 'error' ? 'Falha na execução' : 'Tarefa concluída';
            } else {
              // Atualiza o texto da tarefa para dar impressao de progresso
              const tasks = [
                'Analisando requisitos',
                'Escrevendo código',
                'Rodando testes',
                'Revisando logs',
                'Otimizando query'
              ];
              newTask = tasks[Math.floor(Math.random() * tasks.length)] + '...';
            }
          } else if (agent.status === 'success' || agent.status === 'error') {
            if (rand > 0.5) {
              newStatus = 'idle';
              newTask = undefined;
            }
          }

          return { ...agent, status: newStatus, currentTask: newTask };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    if (isRunning) {
      // reseta para idle ao parar
      setAgents(INITIAL_AGENTS);
    }
  };

  return (
    <div className="w-full min-h-[600px] bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      {/* Header do Office */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-100">AIOX Virtual Office</h2>
          <p className="text-slate-500 text-sm mt-1">Monitoramento de Agentes em Tempo Real</p>
        </div>
        
        <button 
          onClick={toggleSimulation}
          className={`px-6 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-sm ${
            isRunning 
            ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400' 
            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400'
          }`}
        >
          {isRunning ? (
             <> <Square className="w-4 h-4" /> Parar Escritório</>
          ) : (
             <> <Play className="w-4 h-4" /> Iniciar Trabalho</>
          )}
        </button>
      </div>

      {/* Grid de Agentes */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 place-items-center w-full max-w-6xl mx-auto"
        >
          {agents.map(agent => (
            <AgentDesk key={agent.id} agent={agent} />
          ))}
        </motion.div>
      </div>
      
      {/* Rodapé status */}
      <div className="mt-8 flex gap-6 justify-center text-sm font-medium text-slate-500">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-slate-400" /> Ocioso
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-blue-500" /> Trabalhando
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-emerald-500" /> Concluído
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500" /> Erro
        </div>
      </div>
    </div>
  );
}
