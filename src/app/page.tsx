"use client";

import { Activity, Clock, MessageSquare, Settings, Sparkles, Wrench, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentStatusCard } from "@/components/agent-status-card";
import { TodoSection } from "@/components/todo-section";
import { useAgentStatus } from "@/hooks/use-agent-status";

const stats = [
  {
    title: "Total Conversations",
    value: "247",
    description: "+12% from last month",
    icon: MessageSquare,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Messages This Week",
    value: "1,429",
    description: "342 today",
    icon: Activity,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    description: "0.3s improvement",
    icon: Clock,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Active Tools",
    value: "8",
    description: "WhatsApp, Calendar, Drive...",
    icon: Wrench,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];

const recentConversations = [
  {
    id: "1",
    title: "Project planning for Q1",
    preview: "Let me help you outline the key milestones...",
    time: "2 min ago",
  },
  {
    id: "2",
    title: "Email draft review",
    preview: "I've refined the email to be more concise...",
    time: "15 min ago",
  },
  {
    id: "3",
    title: "Code debugging session",
    preview: "The issue is in the async handler...",
    time: "1 hour ago",
  },
  {
    id: "4",
    title: "Meeting notes summary",
    preview: "Here are the action items from today's call...",
    time: "3 hours ago",
  },
];

const quickActions = [
  { title: "New Chat", href: "/chat", description: "Start a conversation", primary: true },
  { title: "Settings", href: "/settings", description: "Configure dashboard", primary: false },
];

export default function DashboardPage() {
  const { agents, isConnected, error } = useAgentStatus();
  return (
    <main className="p-4 md:p-6 space-y-6 md:space-y-8" aria-label="Dashboard">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between animate-staggered-fade delay-0">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            Welcome back! Here&apos;s what&apos;s happening with MoltBot.
          </p>
        </div>
        <Badge 
          variant="outline" 
          className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10 self-start btn-magnetic px-3 py-1.5 rounded-full shadow-sm"
          aria-label="System status: Online"
        >
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-gentle-pulse" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wide">Online</span>
        </Badge>
      </header>

      {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
      <section aria-labelledby="stats-heading" className="animate-staggered-fade delay-100">
        <h2 id="stats-heading" className="sr-only">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="p-4 md:p-5 glow-card border-border/50 animate-staggered-fade btn-magnetic"
              style={{ animationDelay: `${150 + index * 75}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-3">
                <CardTitle className="text-xs md:text-sm font-semibold text-muted-foreground tracking-wide">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor} ring-1 ring-white/10 shadow-sm`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <div className="text-xl md:text-2xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-[11px] md:text-xs text-muted-foreground font-medium">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Agents Section */}
      <section aria-labelledby="agents-heading" className="animate-staggered-fade delay-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-sky-500" />
            <h2 id="agents-heading" className="text-lg md:text-xl font-semibold">Live Agents</h2>
          </div>
          {isConnected ? (
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-status-pulse" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500/50 text-amber-500 bg-amber-500/10">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500" />
              Connecting...
            </Badge>
          )}
        </div>
        
        {error && (
          <div className="text-sm text-red-500 mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <AgentStatusCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Recent Conversations */}
        <section className="lg:col-span-2 animate-staggered-fade delay-250" aria-labelledby="conversations-heading">
          <Card className="glow-card border-border/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle id="conversations-heading" className="text-base md:text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Recent Conversations
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Your latest chats with MoltBot
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <ul className="space-y-3 md:space-y-4" role="list">
                {recentConversations.map((conv, index) => (
                  <li key={conv.id}>
                    <Link
                      href={`/chat?session=${conv.id}`}
                      className="block p-4 rounded-xl border border-border/60 hover:border-orange-500/40 hover:bg-orange-500/6 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all duration-300 min-h-12 animate-staggered-fade btn-magnetic hover:shadow-md hover:shadow-orange-500/10"
                      aria-label={`Open conversation: ${conv.title}`}
                      style={{ animationDelay: `${300 + index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0">
                          <p className="font-semibold text-sm md:text-base leading-tight truncate">
                            {conv.title}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 font-medium">
                            {conv.preview}
                          </p>
                        </div>
                        <time className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap shrink-0 font-medium px-2 py-1 rounded-md bg-muted/30">
                          {conv.time}
                        </time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section aria-labelledby="actions-heading" className="animate-staggered-fade delay-300">
          <Card className="glow-accent border-border/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle id="actions-heading" className="text-base md:text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-sky-500" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Jump right in</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
              {quickActions.map((action, index) => (
                <Button
                  key={action.href}
                  asChild
                  variant={action.primary ? "default" : "outline"}
                  className={`w-full justify-start h-auto min-h-14 md:min-h-12 py-3 px-4 animate-staggered-fade btn-magnetic ${
                    action.primary 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border-0 ring-1 ring-orange-400/20" 
                      : "hover:border-sky-500/40 hover:bg-sky-500/8 hover:shadow-md hover:shadow-sky-500/20 border-border/60"
                  }`}
                  style={{ animationDelay: `${350 + index * 100}ms` }}
                >
                  <Link href={action.href} className="flex items-center w-full">
                    {action.primary ? (
                      <div className="mr-3 p-1 rounded-md bg-white/10">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="mr-3 p-1 rounded-md bg-muted/50">
                        <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                    )}
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm md:text-base leading-tight">{action.title}</p>
                      <p
                        className={`text-xs mt-0.5 ${action.primary ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {action.description}
                      </p>
                    </div>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Todos Section - Bottom of dashboard */}
      <section aria-labelledby="todos-heading" className="animate-staggered-fade delay-350">
        <TodoSection />
      </section>
    </main>
  );
}
