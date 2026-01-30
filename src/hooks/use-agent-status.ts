"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createMoltBotClient } from "@/lib/moltbot-client";
import type { Session } from "@/lib/moltbot-client";

export interface AgentStatus {
  id: string;
  name: string;
  status: "online" | "busy" | "offline";
  currentTask?: string;
  responseTime: number; // in milliseconds
  lastSeen: string;
  sessionKey?: string;
  role?: string;
  scope?: string;
}

interface UseAgentStatusOptions {
  enableMockData?: boolean;
  pollInterval?: number;
}

export function useAgentStatus(options: UseAgentStatusOptions = {}) {
  const {
    enableMockData = false, // Default to real data
    pollInterval = 5000,
  } = options;

  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mockIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pollIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Fetch real agent data from MoltBot gateway
  const fetchAgentData = useCallback(async () => {
    try {
      const client = createMoltBotClient();
      if (!client) {
        throw new Error("Failed to create MoltBot client");
      }

      // Ensure connection
      if (!client.connected) {
        await client.connect();
      }

      // Get sessions from the gateway
      const sessions = await client.getSessions();
      
      // Convert sessions to agent status format
      const agentStatuses: AgentStatus[] = sessions.map((session: Session) => {
        
        // Map session status to our status format
        let status: "online" | "busy" | "offline";
        switch (session.status) {
          case 'active':
            status = "online";
            break;
          case 'idle':
            status = "busy";
            break;
          case 'closed':
          default:
            status = "offline";
            break;
        }

        // Generate response time based on session key hash for consistency
        const keyHash = session.key.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const responseTime = 300 + (keyHash % 2000); // 300-2300ms range

        return {
          id: session.key,
          name: session.role || session.device || 'Unknown Agent',
          status,
          currentTask: session.scope && status === "busy" ? `Working on ${session.scope}` : undefined,
          responseTime,
          lastSeen: session.lastActivity,
          sessionKey: session.key,
          role: session.role,
          scope: session.scope,
        };
      });

      // Sort agents by status priority and then by name
      agentStatuses.sort((a, b) => {
        const statusPriority = { online: 0, busy: 1, offline: 2 };
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        if (statusDiff !== 0) return statusDiff;
        return a.name.localeCompare(b.name);
      });

      setAgents(agentStatuses);
      setIsConnected(client.connected);
      setError(null);
    } catch (err) {
      console.error("Error fetching agent data:", err);
      setError("Connect to local MoltBot to see live agent status");
      setIsConnected(false);
      
      // Don't fall back to mock data - show empty state instead
      setAgents([]);
    }
  }, []);

  // Mock data generator for development - maintains stable order
  const generateMockAgents = useCallback((): AgentStatus[] => {
    // Fixed base agents with stable order (sorted by name)
    const baseAgents = [
      {
        id: "agent-calendar",
        name: "Calendar Sync",
        baseStatus: "online" as const,
        taskChance: 0.8,
        taskText: "Syncing calendar events",
        responseRange: [800, 3000],
        maxOfflineTime: 300000,
      },
      {
        id: "agent-drive", 
        name: "Drive Manager",
        baseStatus: "online" as const,
        taskChance: 0.6,
        taskText: "Organizing documents",
        responseRange: [600, 2500],
        maxOfflineTime: 600000,
      },
      {
        id: "agent-main",
        name: "Main Assistant", 
        baseStatus: "online" as const,
        taskChance: 0.5,
        taskText: "Processing email",
        responseRange: [500, 2000],
        maxOfflineTime: 0,
      },
      {
        id: "agent-whatsapp",
        name: "WhatsApp Manager",
        baseStatus: "online" as const, 
        taskChance: 0.7,
        taskText: "Handling WhatsApp messages",
        responseRange: [300, 1500],
        maxOfflineTime: 0,
      },
    ];

    return baseAgents.map(agent => {
      // More natural status transitions - less jarring
      let status: "online" | "busy" | "offline" = agent.baseStatus;
      
      // Small chance of status change
      const statusRoll = Math.random();
      if (statusRoll > 0.9) status = "busy";
      else if (statusRoll > 0.85 && agent.maxOfflineTime > 0) status = "offline";
      
      return {
        id: agent.id,
        name: agent.name,
        status,
        currentTask: Math.random() > agent.taskChance ? agent.taskText : undefined,
        responseTime: Math.floor(Math.random() * (agent.responseRange[1]! - agent.responseRange[0]!)) + agent.responseRange[0]!,
        lastSeen: status === "offline" 
          ? new Date(Date.now() - Math.random() * agent.maxOfflineTime).toISOString()
          : new Date().toISOString(),
      };
    });
  }, []);

  // Mock data simulation
  const startMockDataUpdates = useCallback(() => {
    if (!enableMockData) return;
    
    // Initial mock data
    setAgents(generateMockAgents());
    setIsConnected(true);
    setError(null);

    // Update mock data every 10-15 seconds for natural, non-jarring updates
    mockIntervalRef.current = setInterval(() => {
      setAgents(generateMockAgents());
    }, Math.random() * 5000 + 10000);
  }, [generateMockAgents, enableMockData]);

  // Polling for real data
  const startPolling = useCallback(() => {
    if (enableMockData) {
      startMockDataUpdates();
      return;
    }

    // Initial fetch
    fetchAgentData();

    // Set up polling
    pollIntervalRef.current = setInterval(() => {
      fetchAgentData();
    }, pollInterval);
  }, [enableMockData, startMockDataUpdates, fetchAgentData, pollInterval]);

  // Main connect function
  const connect = useCallback(() => {
    startPolling();
  }, [startPolling]);

  const disconnect = useCallback(() => {
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
    }

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    setIsConnected(false);
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    agents,
    isConnected,
    error,
    reconnect: connect,
    refresh: enableMockData ? () => setAgents(generateMockAgents()) : fetchAgentData,
  };
}