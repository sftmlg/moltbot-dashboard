import { v4 as uuid } from 'uuid';

interface MoltBotConfig {
  wsUrl: string;
  httpUrl: string;
  token: string;
}

interface ConnectChallenge {
  nonce: string;
  ts: number;
}

interface Session {
  key: string;
  model: string;
  tokens: number;
  lastActivity: string;
  status: 'active' | 'idle' | 'closed';
  role?: string;
  scope?: string;
  device?: string;
}

interface SystemPresenceResponse {
  [deviceId: string]: {
    deviceId: string;
    roles: string[];
    scopes: string[];
    lastSeen?: string;
    status?: string;
  };
}

class MoltBotClient {
  private ws: WebSocket | null = null;
  private config: MoltBotConfig;
  private isConnected = false;
  private isConnecting = false;
  private requestCounter = 0;
  private pendingRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
    timeout: NodeJS.Timeout;
  }>();
  private eventListeners = new Map<string, ((data: any) => void)[]>();

  constructor(config: MoltBotConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.config.wsUrl);
      
      return new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('Failed to create WebSocket'));
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.ws.onopen = () => {
          console.log('MoltBot WebSocket connected');
        };

        this.ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'event' && message.event === 'connect.challenge') {
              // Handle challenge and send connect request
              await this.handleConnectChallenge(message.payload);
              clearTimeout(timeout);
              resolve();
            } else if (message.type === 'res') {
              // Handle response
              this.handleResponse(message);
            } else if (message.type === 'event') {
              // Handle other events
              this.handleEvent(message);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('MoltBot WebSocket error:', error);
          clearTimeout(timeout);
          reject(error);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.isConnecting = false;
          console.log('MoltBot WebSocket closed');
        };
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private async handleConnectChallenge(challenge: ConnectChallenge): Promise<void> {
    const connectRequest = {
      type: 'req',
      id: this.generateRequestId(),
      method: 'connect',
      params: {
        minProtocol: 3,
        maxProtocol: 3,
        client: {
          id: 'dashboard',
          version: '1.0.0',
          platform: 'web',
          mode: 'operator'
        },
        role: 'operator',
        scopes: ['operator.read', 'operator.write'],
        caps: [],
        commands: [],
        permissions: {},
        auth: { token: this.config.token },
        locale: 'en-US',
        userAgent: 'moltbot-dashboard/1.0.0',
        device: {
          id: 'dashboard-' + Math.random().toString(36).substring(7),
          publicKey: '',
          signature: '',
          signedAt: challenge.ts,
          nonce: challenge.nonce
        }
      }
    };

    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connect request timeout'));
      }, 5000);

      const handleResponse = (response: any) => {
        if (response.id === connectRequest.id) {
          clearTimeout(timeout);
          if (response.ok && response.payload?.type === 'hello-ok') {
            this.isConnected = true;
            this.isConnecting = false;
            console.log('MoltBot connected successfully');
            resolve(response.payload);
          } else {
            reject(new Error(response.error || 'Connection failed'));
          }
        }
      };

      // Store the response handler temporarily
      const originalHandler = this.handleResponse.bind(this);
      this.handleResponse = (response: any) => {
        handleResponse(response);
        this.handleResponse = originalHandler;
      };

      this.ws.send(JSON.stringify(connectRequest));
    });
  }

  private generateRequestId(): string {
    return `req_${++this.requestCounter}_${Date.now()}`;
  }

  private handleResponse(message: any): void {
    const pending = this.pendingRequests.get(message.id);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(message.id);
      
      if (message.ok) {
        pending.resolve(message.payload);
      } else {
        pending.reject(new Error(message.error || 'Request failed'));
      }
    }
  }

  private handleEvent(message: any): void {
    const listeners = this.eventListeners.get(message.event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(message.payload);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  private async request(method: string, params?: any): Promise<any> {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const id = this.generateRequestId();
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }, 10000);

      this.pendingRequests.set(id, { resolve, reject, timeout });

      const request = {
        type: 'req',
        id,
        method,
        params: params || {}
      };

      this.ws.send(JSON.stringify(request));
    });
  }

  async getSessions(): Promise<Session[]> {
    try {
      const response = await this.request('system-presence');
      const presenceData: SystemPresenceResponse = response;
      
      // Convert system-presence data to sessions format
      const sessions: Session[] = Object.entries(presenceData).map(([deviceId, presence]) => ({
        key: deviceId,
        model: presence.roles?.join(', ') || 'unknown',
        tokens: 0, // Not available in presence data
        lastActivity: presence.lastSeen || new Date().toISOString(),
        status: this.mapPresenceToStatus(presence),
        role: presence.roles?.[0],
        scope: presence.scopes?.join(', '),
        device: presence.deviceId
      }));

      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  private mapPresenceToStatus(presence: any): 'active' | 'idle' | 'closed' {
    if (!presence.lastSeen) return 'active';
    
    const lastSeen = new Date(presence.lastSeen);
    const now = new Date();
    const minutesAgo = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    
    if (minutesAgo < 5) return 'active';
    if (minutesAgo < 30) return 'idle';
    return 'closed';
  }

  subscribeToEvents(event: string, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    const listeners = this.eventListeners.get(event)!;
    listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  async sendChatMessage(message: string, model = 'moltbot:main'): Promise<string> {
    const response = await fetch(`${this.config.httpUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.token}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response';
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.pendingRequests.clear();
    this.eventListeners.clear();
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let moltbotClient: MoltBotClient | null = null;

export function createMoltBotClient(): MoltBotClient | null {
  try {
    const wsUrl = process.env.NEXT_PUBLIC_MOLTBOT_GATEWAY_URL || 'ws://127.0.0.1:18789';
    const httpUrl = process.env.NEXT_PUBLIC_MOLTBOT_GATEWAY_HTTP || 'http://127.0.0.1:18789';
    const token = process.env.NEXT_PUBLIC_MOLTBOT_TOKEN || '7894dc8f051354c152397248947f0500';

    if (!moltbotClient) {
      moltbotClient = new MoltBotClient({ wsUrl, httpUrl, token });
    }
    
    return moltbotClient;
  } catch (error) {
    console.error('Failed to create MoltBot client:', error);
    return null;
  }
}

export function getMoltBotClient(): MoltBotClient | null {
  return moltbotClient;
}

export type { Session, MoltBotConfig };
export default MoltBotClient;