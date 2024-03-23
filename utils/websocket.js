const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let lastMessage = null;
let rooms = {};


wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const message = JSON.parse(data.toString());

    if (message.type === 'id') {
      const id = message.id;

      // Check for existing mentor with the same ID
      if (rooms[id]) {
        ws.send(JSON.stringify({ type: 'role', role: 'student' }));
        console.log(`Student connected  ID ${id}`);
      } else {
        // Assign current client as mentor for this ID
        rooms[id] = ws;
        ws.send(JSON.stringify({ type: 'role', role: 'mentor' }));
        console.log(`Mentor connected  ID ${id}`);
      }
    }
  });

  ws.on('message', function message(data) {
    const message = JSON.parse(data.toString());
  
    // Check if the new message is the same as the last broadcasted message
    if (JSON.stringify(message) === lastMessage) {
      console.log('Skipping broadcast of duplicate message:', message);
      return;
    }
  
    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  
    console.log('Broadcasting message:', message);
  
    // Store the new message as the last broadcasted message
    lastMessage = JSON.stringify(message);
  });

  ws.on('close', function close() {
    // Find the room that the disconnected WebSocket was a mentor for
    const roomId = Object.keys(rooms).find(id => rooms[id] === ws);
  
    if (roomId) {
      console.log(`Mentor disconnected from room ID ${roomId}`);
      delete rooms[roomId]; // Remove the mentor from the room
    } else {
      console.log('Student disconnected');
    }
  });
});

module.exports = { wss }; // Export wss for use in server.js