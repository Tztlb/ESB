import { JSONRPCRequest, JSONRPCResponse, JSONRPCNotification, JSONRPCError } from '../../modelcontextprotocol/schema/2025-03-26/schema';
import { Message, MessageTransformer as IMessageTransformer, MCPService, ServiceConfig } from './types';

export class MessageTransformer implements IMessageTransformer, MCPService {
  private transformations: Map<string, Map<string, (message: Message) => Promise<Message>>>;
  private config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this.transformations = new Map();
    this.config = config;
  }

  public registerTransformation(
    source: string,
    destination: string,
    handler: (message: Message) => Promise<Message>
  ): void {
    if (!this.transformations.has(source)) {
      this.transformations.set(source, new Map());
    }
    this.transformations.get(source)!.set(destination, handler);
  }

  public async transform(message: Message): Promise<Message> {
    const sourceTransformations = this.transformations.get(message.metadata.source);
    if (!sourceTransformations) {
      throw new Error(`No transformations found for source: ${message.metadata.source}`);
    }

    const handler = sourceTransformations.get(message.metadata.destination);
    if (!handler) {
      throw new Error(`No transformation found from ${message.metadata.source} to ${message.metadata.destination}`);
    }

    return await handler(message);
  }

  public async handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    if (request.method === 'transform') {
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
        const transformedMessage = await this.transform(message);
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            success: true,
            message: transformedMessage
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