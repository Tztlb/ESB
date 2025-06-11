import { JSONRPCMessage, JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '../../modelcontextprotocol/schema/2025-03-26/schema';

export interface Message {
  id: string;
  content: any;
  metadata: {
    source: string;
    destination: string;
    timestamp: number;
    [key: string]: any;
  };
}

export interface MessageRouter {
  route(message: Message): Promise<void>;
  registerRoute(source: string, destination: string, handler: (message: Message) => Promise<void>): void;
}

export interface MessageTransformer {
  transform(message: Message): Promise<Message>;
  registerTransformation(source: string, destination: string, handler: (message: Message) => Promise<Message>): void;
}

export interface MCPService {
  handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError>;
  sendNotification(notification: JSONRPCMessage): Promise<void>;
}

export interface ServiceConfig {
  name: string;
  port: number;
  routes?: {
    source: string;
    destination: string;
  }[];
  transformations?: {
    source: string;
    destination: string;
  }[];
} 