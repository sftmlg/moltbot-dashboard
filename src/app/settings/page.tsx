"use client";

import { Moon, Save, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:3001");
  const [wsEndpoint, setWsEndpoint] = useState("ws://localhost:3001/ws/chat");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Load saved settings from localStorage
    const saved = localStorage.getItem("moltbot-settings");
    if (saved) {
      const parsed = JSON.parse(saved) as {
        apiKey?: string;
        apiEndpoint?: string;
        wsEndpoint?: string;
        notifications?: boolean;
      };
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.apiEndpoint) setApiEndpoint(parsed.apiEndpoint);
      if (parsed.wsEndpoint) setWsEndpoint(parsed.wsEndpoint);
      if (typeof parsed.notifications === "boolean") setNotifications(parsed.notifications);
    }
  }, []);

  const handleSave = () => {
    const settings = { apiKey, apiEndpoint, wsEndpoint, notifications };
    localStorage.setItem("moltbot-settings", JSON.stringify(settings));
    // In production, show a toast notification
  };

  if (!mounted) {
    return null;
  }

  return (
    <main 
      className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-3xl mx-auto animate-fadeIn"
      aria-label="Settings"
    >
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Configure your MoltBot dashboard preferences.
        </p>
      </header>

      {/* Appearance */}
      <section aria-labelledby="appearance-heading">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle id="appearance-heading" className="text-base md:text-lg">
              Appearance
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Customize how the dashboard looks.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4 md:space-y-6">
            {/* Theme Toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Theme</span>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Switch between light and dark mode.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" aria-hidden="true" />
                <Switch
                  id="theme-switch"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Toggle dark mode"
                  className="data-[state=checked]:bg-primary"
                />
                <Moon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>

            <Separator />

            {/* Notifications Toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Notifications</span>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Receive browser notifications.
                </p>
              </div>
              <Switch
                id="notifications-switch"
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="Toggle notifications"
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Configuration */}
      <section aria-labelledby="api-heading">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle id="api-heading" className="text-base md:text-lg">
              API Configuration
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Configure API endpoints and authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            {/* API Key */}
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium">
                API Key
              </label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">Your API key for authentication.</p>
            </div>

            {/* API Endpoint */}
            <div className="space-y-2">
              <label htmlFor="api-endpoint" className="text-sm font-medium">
                API Endpoint
              </label>
              <Input
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:3001"
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">The base URL for API requests.</p>
            </div>

            {/* WebSocket Endpoint */}
            <div className="space-y-2">
              <label htmlFor="ws-endpoint" className="text-sm font-medium">
                WebSocket Endpoint
              </label>
              <Input
                id="ws-endpoint"
                value={wsEndpoint}
                onChange={(e) => setWsEndpoint(e.target.value)}
                placeholder="ws://localhost:3001/ws/chat"
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">WebSocket URL for real-time chat.</p>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave} 
              className="w-full min-h-12 md:min-h-10 text-base md:text-sm"
            >
              <Save className="mr-2 h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* About */}
      <section aria-labelledby="about-heading">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle id="about-heading" className="text-base md:text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-2 text-xs md:text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">MoltBot Dashboard</strong> v1.0.0
            </p>
            <p>Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui</p>
            <p>© 2026 Software Moling</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
