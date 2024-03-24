const express = require('express');
const { connectDB } = require('./db');
const app = express(); // Create Express server
const cors = require('cors');
const mongoose = require('mongoose');
const enableWs = require('express-ws')
const wsInstance = enableWs(app)
let lastMessage = null;
let rooms = {};


app.ws('/ws', (ws, req) => {
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
    wsInstance.getWss().clients.forEach(client => {
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
})



app.use(cors())
app.use('/api/code-blocks', async (req, res) => {
 console.log('Got to /api/code-blocks')
  try {

    const codeBlockSchema = new mongoose.Schema({
      id: { type: String, required: true },  
      title: { type: String, required: true },
      code: { type: String, required: true },
      corectCode: { type: String, required: true },
    });
    const model = mongoose.model('CodeBlock', codeBlockSchema)

    const codeBlocks = await model.find({}); // Fetch all code blocks

    res.status(200).json(codeBlocks);
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})


app.use('/api/test', async (req, res) => {
  console.log('test')
 })

// Create Express server 
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3010; // Set your desired port here
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    await connectDB();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit on error
  }
};


startServer();