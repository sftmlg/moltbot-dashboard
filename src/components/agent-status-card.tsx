"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Activity } from "lucide-react";
import type { AgentStatus } from "@/hooks/use-agent-status";

interface AgentStatusCardProps {
  agent: AgentStatus;
  index?: number;
}

export function AgentStatusCard({ agent, index = 0 }: AgentStatusCardProps) {
  const getStatusColor = () => {
    switch (agent.status) {
      case "online":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          border: "border-emerald-500/20",
        };
      case "busy":
        return {
          bg: "bg-amber-500/10", 
          text: "text-amber-500",
          border: "border-amber-500/20",
        };
      case "offline":
        return {
          bg: "bg-slate-500/10",
          text: "text-slate-500",
          border: "border-slate-500/20",
        };
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const statusColor = getStatusColor();
  
  return (
    <Card 
      className="glow-card border-border/50 animate-staggered-fade" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium leading-none">
              {agent.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Agent ID: {agent.id}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${statusColor.bg} ${statusColor.text} ${statusColor.border} text-[10px] font-medium`}
          >
            <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColor.text.replace('text-', 'bg-')} ${agent.status === 'online' ? 'animate-status-pulse' : ''}`} />
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Current Task */}
        {agent.currentTask && (
          <div className="flex items-start gap-2">
            <Activity className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">Current Task</p>
              <p className="text-[11px] text-muted-foreground">{agent.currentTask}</p>
            </div>
          </div>
        )}
        
        {/* Response Time */}
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">Response:</span>
            <span className={`text-xs font-mono ${
              agent.responseTime < 1000 ? 'text-emerald-500' : 
              agent.responseTime < 2000 ? 'text-amber-500' : 
              'text-red-500'
            }`}>
              {formatResponseTime(agent.responseTime)}
            </span>
          </div>
        </div>
        
        {/* Last Seen */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Last seen</span>
          <span className="font-mono">{formatLastSeen(agent.lastSeen)}</span>
        </div>
      </CardContent>
    </Card>
  );
}