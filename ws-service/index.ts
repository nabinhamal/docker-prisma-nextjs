import Fastify from 'fastify';
import websocket from '@fastify/websocket';

const fastify = Fastify({
  logger: true
});

fastify.register(websocket);

fastify.register(async (fastify) => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const socket = connection.socket;
    
    if (!socket) {
      fastify.log.error('WebSocket connection failed: socket is undefined');
      return;
    }

    fastify.log.info('Client connected');

    socket.on('message', (data: Buffer) => {
      const message = data.toString();
      fastify.log.info(`Received message: ${message}`);
      socket.send(`Echo: ${message}`);
    });

    socket.on('close', () => {
      fastify.log.info('Client disconnected');
    });
    
    socket.send('Welcome to the Fastify WebSocket service!');
  });
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8080');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`WebSocket server is running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
