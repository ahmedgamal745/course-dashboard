const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received:', parsedMessage);
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
