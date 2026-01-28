"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Clock, MessageSquare, CheckCircle, AlertCircle, XCircle, Zap } from "lucide-react";
import type { AgentStatus } from "@/hooks/use-agent-status";

interface AgentDetailModalProps {
  agent: AgentStatus | null;
  open: boolean;
  onClose: () => void;
}

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: "task" | "message" | "status" | "system";
  title: string;
  details?: string;
  status?: "success" | "warning" | "error";
}

export function AgentDetailModal({ agent, open, onClose }: AgentDetailModalProps) {
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  // Generate mock activity log for the agent
  useEffect(() => {
    if (!agent) return;

    const generateActivityLog = (agentId: string): ActivityLogEntry[] => {
      const baseActivities = {
        "agent-main": [
          { type: "message" as const, title: "Processed email draft", details: "Refined subject line and tone for client communication", status: "success" as const },
          { type: "task" as const, title: "Code review completed", details: "Reviewed TypeScript interface definitions", status: "success" as const },
          { type: "system" as const, title: "Status changed to online", status: "success" as const },
          { type: "message" as const, title: "Generated project summary", details: "Created Q1 milestone overview document", status: "success" as const },
          { type: "task" as const, title: "Document analysis", details: "Extracted key insights from meeting notes", status: "success" as const },
        ],
        "agent-whatsapp": [
          { type: "message" as const, title: "WhatsApp message received", details: "From: David (+49 xxx) - Project update question", status: "success" as const },
          { type: "task" as const, title: "Message processed", details: "Generated response about timeline", status: "success" as const },
          { type: "system" as const, title: "Connection established", status: "success" as const },
          { type: "message" as const, title: "Auto-response sent", details: "Acknowledged receipt, will respond in 5 min", status: "success" as const },
          { type: "task" as const, title: "Contact sync", details: "Updated contact database", status: "success" as const },
        ],
        "agent-calendar": [
          { type: "task" as const, title: "Calendar sync completed", details: "Synchronized 12 events for next week", status: "success" as const },
          { type: "system" as const, title: "Google Calendar connected", status: "success" as const },
          { type: "task" as const, title: "Meeting conflict detected", details: "Overlap found: Client call vs Team standup", status: "warning" as const },
          { type: "message" as const, title: "Reminder sent", details: "Meeting in 15 minutes: Q1 Planning", status: "success" as const },
          { type: "task" as const, title: "Event created", details: "Follow-up call scheduled for Friday", status: "success" as const },
        ],
        "agent-drive": [
          { type: "task" as const, title: "Documents organized", details: "Sorted 47 files into project folders", status: "success" as const },
          { type: "system" as const, title: "Drive permissions updated", status: "success" as const },
          { type: "task" as const, title: "Backup completed", details: "Weekly backup of project files", status: "success" as const },
          { type: "message" as const, title: "File shared", details: "Shared Q1-Strategy.pdf with team", status: "success" as const },
          { type: "task" as const, title: "Duplicate removal", details: "Found and removed 8 duplicate files", status: "success" as const },
        ],
      };

      const activities = baseActivities[agentId as keyof typeof baseActivities] || baseActivities["agent-main"];
      
      return activities.map((activity, index) => ({
        id: `${agentId}-${index}`,
        timestamp: new Date(Date.now() - (index * 15 * 60 * 1000) - Math.random() * 5 * 60 * 1000),
        ...activity,
      }));
    };

    setActivityLog(generateActivityLog(agent.id));
  }, [agent]);

  if (!agent) return null;

  const getStatusColor = () => {
    switch (agent.status) {
      case "online":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          border: "border-emerald-500/20",
          icon: CheckCircle,
        };
      case "busy":
        return {
          bg: "bg-amber-500/10", 
          text: "text-amber-500",
          border: "border-amber-500/20",
          icon: AlertCircle,
        };
      case "offline":
        return {
          bg: "bg-slate-500/10",
          text: "text-slate-500",
          border: "border-slate-500/20",
          icon: XCircle,
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message": return MessageSquare;
      case "task": return Activity;
      case "system": return Zap;
      default: return Activity;
    }
  };

  const getActivityStatusColor = (status?: string) => {
    switch (status) {
      case "success": return "text-emerald-500";
      case "warning": return "text-amber-500";
      case "error": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const statusColor = getStatusColor();
  const StatusIcon = statusColor.icon;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-sky-500/20 border border-orange-500/20">
              <StatusIcon className={`h-5 w-5 ${statusColor.text}`} />
            </div>
            {agent.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge 
                variant="outline" 
                className={`${statusColor.bg} ${statusColor.text} ${statusColor.border} text-sm font-medium w-fit`}
              >
                <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColor.text.replace('text-', 'bg-')} ${agent.status === 'online' ? 'animate-status-pulse' : ''}`} />
                {agent.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Response Time</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-mono ${
                  agent.responseTime < 1000 ? 'text-emerald-500' : 
                  agent.responseTime < 2000 ? 'text-amber-500' : 
                  'text-red-500'
                }`}>
                  {formatResponseTime(agent.responseTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Current Task */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Current Task</label>
            <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
              {agent.currentTask ? (
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{agent.currentTask}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">No active task</span>
                </div>
              )}
            </div>
          </div>

          {/* Agent Details */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Agent Details</label>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Agent ID:</span>
                <span className="ml-2 font-mono">{agent.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last seen:</span>
                <span className="ml-2 font-mono">{formatLastSeen(agent.lastSeen)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Live Activity Log */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Live Activity Log</h3>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10 text-xs">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </Badge>
            </div>
            
            <ScrollArea className="h-64 rounded-lg border border-border/50">
              <div className="p-4 space-y-4">
                {activityLog.map((entry, index) => {
                  const ActivityIcon = getActivityIcon(entry.type);
                  return (
                    <div 
                      key={entry.id}
                      className="flex gap-3 animate-staggered-fade"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-1.5 rounded-full bg-muted/50">
                          <ActivityIcon className={`h-3 w-3 ${getActivityStatusColor(entry.status)}`} />
                        </div>
                        {index < activityLog.length - 1 && (
                          <div className="w-px h-8 bg-border/50 mt-1" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{entry.title}</p>
                          <time className="text-xs text-muted-foreground">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </time>
                        </div>
                        {entry.details && (
                          <p className="text-xs text-muted-foreground">{entry.details}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:border-orange-500/30 hover:bg-orange-500/5"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}