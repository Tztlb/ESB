# MCP-based ESB System

A simple Enterprise Service Bus (ESB) system implemented using the ModelContextProtocol (MCP) framework. This system provides basic message routing and transformation capabilities between services.

## Features

- Message routing between services
- Message transformation capabilities
- MCP-based communication protocol
- TypeScript implementation
- Extensible architecture

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Project Structure

```
esb-system/
├── src/
│   ├── index.ts           # Main application file
│   ├── MessageRouter.ts   # Message routing service
│   ├── MessageTransformer.ts # Message transformation service
│   └── types.ts           # Type definitions
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

The system consists of two main services:

1. **Message Router**: Handles routing messages between services
2. **Message Transformer**: Handles message transformations between services

### Running the Example

To run the example demonstration:

```bash
npm start
```

This will:
1. Initialize both services
2. Register routes and transformations
3. Demonstrate a message flow between services

### Example Message Flow

1. Service A sends a message to Service B
2. The message is transformed (e.g., converted to uppercase)
3. The transformed message is routed to Service B
4. Service B processes the message and sends a response
5. The response is transformed (e.g., converted to lowercase)
6. The transformed response is routed back to Service A

## Extending the System

### Adding New Routes

```typescript
router.registerRoute('source-service', 'destination-service', async (message) => {
  // Handle message routing
});
```

### Adding New Transformations

```typescript
transformer.registerTransformation('source-service', 'destination-service', async (message) => {
  // Transform message
  return transformedMessage;
});
```

## License

MIT 