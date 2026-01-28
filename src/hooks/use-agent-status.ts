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
  wsUrl?: string;
  reconnectInterval?: number;
  enableMockData?: boolean;
}

export function useAgentStatus(options: UseAgentStatusOptions = {}) {
  const {
    wsUrl = "ws://localhost:3001/agents",
    reconnectInterval = 5000,
    enableMockData = true, // Use mock data for now
  } = options;

  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const mockIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Mock data generator for development
  const generateMockAgents = useCallback((): AgentStatus[] => {
    const mockAgents: AgentStatus[] = [
      {
        id: "agent-main",
        name: "Main Assistant",
        status: Math.random() > 0.8 ? "busy" : "online",
        currentTask: Math.random() > 0.5 ? "Processing email" : undefined,
        responseTime: Math.floor(Math.random() * 2000) + 500,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "agent-whatsapp",
        name: "WhatsApp Manager",
        status: Math.random() > 0.6 ? "online" : Math.random() > 0.5 ? "busy" : "offline",
        currentTask: Math.random() > 0.7 ? "Handling WhatsApp messages" : undefined,
        responseTime: Math.floor(Math.random() * 1500) + 300,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "agent-calendar",
        name: "Calendar Sync",
        status: Math.random() > 0.7 ? "online" : "offline",
        currentTask: Math.random() > 0.8 ? "Syncing calendar events" : undefined,
        responseTime: Math.floor(Math.random() * 3000) + 800,
        lastSeen: new Date(Date.now() - Math.random() * 300000).toISOString(),
      },
      {
        id: "agent-drive",
        name: "Drive Manager",
        status: Math.random() > 0.5 ? "online" : Math.random() > 0.3 ? "busy" : "offline",
        currentTask: Math.random() > 0.6 ? "Organizing documents" : undefined,
        responseTime: Math.floor(Math.random() * 2500) + 600,
        lastSeen: new Date(Date.now() - Math.random() * 600000).toISOString(),
      },
    ];
    return mockAgents;
  }, []);

  // Mock data simulation
  const startMockDataUpdates = useCallback(() => {
    if (!enableMockData) return;
    
    // Initial mock data
    setAgents(generateMockAgents());
    setIsConnected(true);
    setError(null);

    // Update mock data every 3-8 seconds
    mockIntervalRef.current = setInterval(() => {
      setAgents(generateMockAgents());
    }, Math.random() * 5000 + 3000);
  }, [generateMockAgents, enableMockData]);

  // WebSocket connection logic
  const connect = useCallback(() => {
    if (enableMockData) {
      startMockDataUpdates();
      return;
    }

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "agents_update") {
            setAgents(data.agents);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      wsRef.current.onerror = () => {
        setError("WebSocket connection error");
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        
        // Attempt reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      };
    } catch (err) {
      setError("Failed to establish WebSocket connection");
      setIsConnected(false);
    }
  }, [wsUrl, reconnectInterval, enableMockData, startMockDataUpdates]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
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
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
    };
  }, []);

  return {
    agents,
    isConnected,
    error,
    reconnect: connect,
  };
}