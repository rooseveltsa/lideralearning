export type AgentRole = 'dev' | 'qa' | 'researcher' | 'architect' | 'pm';
export type AgentStatus = 'idle' | 'working' | 'success' | 'error';

export interface AioxAgent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask?: string;
}
