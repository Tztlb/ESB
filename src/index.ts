import { MessageRouter } from './MessageRouter';
import { MessageTransformer } from './MessageTransformer';
import { Message, ServiceConfig } from './types';

// Create service configurations
const routerConfig: ServiceConfig = {
  name: 'message-router',
  port: 3000,
  routes: [
    { source: 'service-a', destination: 'service-b' },
    { source: 'service-b', destination: 'service-a' }
  ]
};

const transformerConfig: ServiceConfig = {
  name: 'message-transformer',
  port: 3001,
  transformations: [
    { source: 'service-a', destination: 'service-b' },
    { source: 'service-b', destination: 'service-a' }
  ]
};

// Initialize services
const router = new MessageRouter(routerConfig);
const transformer = new MessageTransformer(transformerConfig);

// Register routes and transformations
router.registerRoute('service-a', 'service-b', async (message: Message) => {
  console.log('Routing message from service-a to service-b:', message);
  // Here you would typically forward the message to service-b
});

router.registerRoute('service-b', 'service-a', async (message: Message) => {
  console.log('Routing message from service-b to service-a:', message);
  // Here you would typically forward the message to service-a
});

transformer.registerTransformation('service-a', 'service-b', async (message: Message) => {
  console.log('Transforming message from service-a to service-b:', message);
  // Example transformation: convert content to uppercase if it's a string
  if (typeof message.content === 'string') {
    return {
      ...message,
      content: message.content.toUpperCase()
    };
  }
  return message;
});

transformer.registerTransformation('service-b', 'service-a', async (message: Message) => {
  console.log('Transforming message from service-b to service-a:', message);
  // Example transformation: convert content to lowercase if it's a string
  if (typeof message.content === 'string') {
    return {
      ...message,
      content: message.content.toLowerCase()
    };
  }
  return message;
});

// Example usage
async function demonstrateESB() {
  // Create a sample message
  const message: Message = {
    id: '1',
    content: 'Hello from Service A',
    metadata: {
      source: 'service-a',
      destination: 'service-b',
      timestamp: Date.now()
    }
  };

  try {
    // Transform the message
    const transformedMessage = await transformer.transform(message);
    console.log('Transformed message:', transformedMessage);

    // Route the transformed message
    await router.route(transformedMessage);
    console.log('Message routed successfully');
  } catch (error) {
    console.error('Error in ESB demonstration:', error);
  }
}

// Run the demonstration
demonstrateESB().catch(console.error); 