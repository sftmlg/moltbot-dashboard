"use client";

import { Moon, Save, Sun, Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { createMoltBotClient } from "@/lib/moltbot-client";

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
  const [moltbotToken, setMoltbotToken] = useState("");
  const [moltbotGatewayUrl, setMoltbotGatewayUrl] = useState("ws://127.0.0.1:18789");
  const [moltbotHttpUrl, setMoltbotHttpUrl] = useState("http://127.0.0.1:18789");
  const [notifications, setNotifications] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");

  useEffect(() => {
    setMounted(true);
    // Load saved settings from localStorage
    const saved = localStorage.getItem("moltbot-settings");
    if (saved) {
      const parsed = JSON.parse(saved) as {
        apiKey?: string;
        apiEndpoint?: string;
        wsEndpoint?: string;
        moltbotToken?: string;
        moltbotGatewayUrl?: string;
        moltbotHttpUrl?: string;
        notifications?: boolean;
      };
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.apiEndpoint) setApiEndpoint(parsed.apiEndpoint);
      if (parsed.wsEndpoint) setWsEndpoint(parsed.wsEndpoint);
      if (parsed.moltbotToken) setMoltbotToken(parsed.moltbotToken);
      if (parsed.moltbotGatewayUrl) setMoltbotGatewayUrl(parsed.moltbotGatewayUrl);
      if (parsed.moltbotHttpUrl) setMoltbotHttpUrl(parsed.moltbotHttpUrl);
      if (typeof parsed.notifications === "boolean") setNotifications(parsed.notifications);
    }
    
    // Test MoltBot connection
    testMoltBotConnection();
  }, []);

  const testMoltBotConnection = async () => {
    setConnectionStatus("checking");
    try {
      const client = createMoltBotClient();
      if (!client) {
        setConnectionStatus("disconnected");
        return;
      }
      
      // Test connection with a simple request
      await client.getSessions();
      setConnectionStatus("connected");
    } catch (error) {
      console.error("MoltBot connection test failed:", error);
      setConnectionStatus("error");
    }
  };

  const handleSave = () => {
    const settings = { 
      apiKey, 
      apiEndpoint, 
      wsEndpoint, 
      moltbotToken,
      moltbotGatewayUrl,
      moltbotHttpUrl,
      notifications 
    };
    localStorage.setItem("moltbot-settings", JSON.stringify(settings));
    // Test connection after saving
    testMoltBotConnection();
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

      {/* MoltBot Configuration */}
      <section aria-labelledby="moltbot-heading">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle id="moltbot-heading" className="text-base md:text-lg">
              MoltBot Gateway
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Connect to your local MoltBot gateway for real-time AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {connectionStatus === "checking" && <Wifi className="h-4 w-4 animate-pulse text-gray-500" />}
                {connectionStatus === "connected" && <CheckCircle className="h-4 w-4 text-green-500" />}
                {connectionStatus === "disconnected" && <WifiOff className="h-4 w-4 text-gray-500" />}
                {connectionStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                <span className="text-sm font-medium">
                  {connectionStatus === "checking" && "Testing connection..."}
                  {connectionStatus === "connected" && "Connected to MoltBot Gateway"}
                  {connectionStatus === "disconnected" && "Not connected"}
                  {connectionStatus === "error" && "Connection failed"}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testMoltBotConnection}
                disabled={connectionStatus === "checking"}
              >
                Test Connection
              </Button>
            </div>

            {/* MoltBot Token */}
            <div className="space-y-2">
              <label htmlFor="moltbot-token" className="text-sm font-medium">
                MoltBot Token
              </label>
              <Input
                id="moltbot-token"
                type="password"
                value={moltbotToken}
                onChange={(e) => setMoltbotToken(e.target.value)}
                placeholder="7894dc8f051354c152397248947f0500"
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">Your MoltBot gateway authentication token.</p>
            </div>

            {/* Gateway WebSocket URL */}
            <div className="space-y-2">
              <label htmlFor="moltbot-gateway-url" className="text-sm font-medium">
                Gateway WebSocket URL
              </label>
              <Input
                id="moltbot-gateway-url"
                value={moltbotGatewayUrl}
                onChange={(e) => setMoltbotGatewayUrl(e.target.value)}
                placeholder="ws://127.0.0.1:18789"
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">WebSocket URL for gateway connection.</p>
            </div>

            {/* Gateway HTTP URL */}
            <div className="space-y-2">
              <label htmlFor="moltbot-http-url" className="text-sm font-medium">
                Gateway HTTP URL
              </label>
              <Input
                id="moltbot-http-url"
                value={moltbotHttpUrl}
                onChange={(e) => setMoltbotHttpUrl(e.target.value)}
                placeholder="http://127.0.0.1:18789"
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">HTTP URL for chat API requests.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Configuration */}
      <section aria-labelledby="api-heading">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle id="api-heading" className="text-base md:text-lg">
              Fallback API Configuration
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Configure fallback AI services when MoltBot Gateway is unavailable. Supports Claude and OpenAI APIs.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            {/* API Configuration Notice */}
            <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/10">
              <div className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-sky-500/20 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-sky-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-sky-500">Environment Variables Required</p>
                  <p className="text-xs text-muted-foreground">
                    For production use, set <code className="bg-muted px-1 rounded font-mono">ANTHROPIC_API_KEY</code> or <code className="bg-muted px-1 rounded font-mono">OPENAI_API_KEY</code> as environment variables. 
                    The chat will automatically detect and use them.
                  </p>
                </div>
              </div>
            </div>

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
                placeholder="sk-... or claude-..."
                className="min-h-11 md:min-h-10 text-base md:text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Your API key for authentication (currently stored locally - use environment variables for production).
              </p>
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
