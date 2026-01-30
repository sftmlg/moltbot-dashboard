"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Todo {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  dueDate?: string;
  context?: string;
  category?: string;
}

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Answer Kevin",
    priority: "high",
    completed: false,
    dueDate: "2024-01-31",
    context: "Waiting for response about project proposal",
    category: "Communication"
  },
  {
    id: "2",
    title: "Review workshop feedback",
    priority: "medium",
    completed: false,
    dueDate: "2024-02-02",
    context: "Analyze feedback from last workshop",
    category: "Review"
  },
  {
    id: "3",
    title: "Follow up with Roman",
    priority: "low",
    completed: false,
    context: "Discuss next meeting agenda",
    category: "Communication"
  },
  {
    id: "4",
    title: "Update documentation",
    priority: "medium",
    completed: true,
    context: "API documentation needs updating",
    category: "Documentation"
  },
  {
    id: "5",
    title: "Schedule team sync",
    priority: "high",
    completed: false,
    dueDate: "2024-01-30",
    context: "Weekly team synchronization meeting",
    category: "Management"
  }
];

export function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
        };
      case 'medium':
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case 'low':
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
    }
  };

  const getPriorityIcon = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3" />;
      case 'medium':
        return <Clock className="h-3 w-3" />;
      case 'low':
        return <Circle className="h-3 w-3" />;
    }
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, color: "text-red-500" };
    } else if (diffDays === 0) {
      return { text: "Due today", color: "text-amber-500" };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", color: "text-amber-500" };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays}d`, color: "text-blue-500" };
    } else {
      return { text: date.toLocaleDateString(), color: "text-muted-foreground" };
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <Card className="glow-card border-border/50">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Todos
          <Badge variant="outline" className="ml-auto text-xs">
            {activeTodos.length} active
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Actionable items extracted from your conversations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
        {/* Active Todos */}
        <div className="space-y-3">
          {activeTodos.map((todo, index) => {
            const priorityStyle = getPriorityColor(todo.priority);
            const dueInfo = formatDueDate(todo.dueDate);
            
            return (
              <div
                key={todo.id}
                className="group p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/20 transition-all animate-staggered-fade"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 mt-0.5 hover:bg-emerald-100 hover:text-emerald-600"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <Circle className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{todo.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                      >
                        {getPriorityIcon(todo.priority)}
                        <span className="ml-1">{todo.priority}</span>
                      </Badge>
                      {todo.category && (
                        <Badge variant="secondary" className="text-[10px]">
                          {todo.category}
                        </Badge>
                      )}
                    </div>
                    
                    {todo.context && (
                      <p className="text-xs text-muted-foreground">{todo.context}</p>
                    )}
                    
                    {dueInfo && (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className={dueInfo.color}>{dueInfo.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Todos (collapsed) */}
        {completedTodos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <details className="group">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                <span>Completed ({completedTodos.length})</span>
                <div className="h-px bg-border flex-1" />
              </summary>
              
              <div className="mt-3 space-y-2">
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-2 rounded opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-emerald-500 hover:bg-emerald-100"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm line-through text-muted-foreground">
                      {todo.title}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Empty State */}
        {activeTodos.length === 0 && completedTodos.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No todos yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a conversation and MoltBot will extract actionable items for you
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}