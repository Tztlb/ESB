import { JSONRPCRequest, JSONRPCResponse, JSONRPCNotification, JSONRPCError } from '../../modelcontextprotocol/schema/2025-03-26/schema';
import { Message, MessageRouter as IMessageRouter, MCPService, ServiceConfig } from './types';

export class MessageRouter implements IMessageRouter, MCPService {
  private routes: Map<string, Map<string, (message: Message) => Promise<void>>>;
  private config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this.routes = new Map();
    this.config = config;
  }

  public registerRoute(source: string, destination: string, handler: (message: Message) => Promise<void>): void {
    if (!this.routes.has(source)) {
      this.routes.set(source, new Map());
    }
    this.routes.get(source)!.set(destination, handler);
  }

  public async route(message: Message): Promise<void> {
    const sourceRoutes = this.routes.get(message.metadata.source);
    if (!sourceRoutes) {
      throw new Error(`No routes found for source: ${message.metadata.source}`);
    }

    const handler = sourceRoutes.get(message.metadata.destination);
    if (!handler) {
      throw new Error(`No route found from ${message.metadata.source} to ${message.metadata.destination}`);
    }

    await handler(message);
  }

  public async handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    if (request.method === 'route') {
      const message = (request.params as any)?.message as Message;
      if (!message) {
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32602,
            message: 'Missing message in params'
          }
        };
      }
      try {
        await this.route(message);
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            success: true,
            message: 'Message routed successfully'
          }
        };
      } catch (error) {
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32000,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        };
      }
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    };
  }

  public async sendNotification(notification: JSONRPCNotification): Promise<void> {
    // Implement notification handling logic here
    console.log('Received notification:', notification);
  }
} 