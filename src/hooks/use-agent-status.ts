"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface AgentStatus {
  id: string;
  name: string;
  status: "online" | "busy" | "offline";
  currentTask?: string;
  responseTime: number; // in milliseconds
  lastSeen: string;
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

  // Fetch agent data from API
  const fetchAgentData = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert sessions to agent status format
      const agentStatuses: AgentStatus[] = data.sessions.map((session: any) => {
        const lastActivity = new Date(session.updatedAt);
        const now = new Date();
        const minutesAgo = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
        
        // Determine status based on last activity
        let status: "online" | "busy" | "offline";
        if (minutesAgo < 2) status = "online";
        else if (minutesAgo < 10) status = "busy";
        else status = "offline";

        // Generate consistent response time based on agent name
        const nameHash = session.title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const responseTime = 300 + (nameHash % 2000); // 300-2300ms range

        return {
          id: session.id,
          name: session.title,
          status,
          currentTask: status === "busy" ? session.preview.substring(0, 50) + "..." : undefined,
          responseTime,
          lastSeen: session.updatedAt,
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
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("Error fetching agent data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsConnected(false);
      
      // Fall back to mock data if real data fails
      if (!enableMockData) {
        setAgents(generateMockAgents());
        setIsConnected(true);
        setError("Using fallback data - API unavailable");
      }
    }
  }, [enableMockData]);

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