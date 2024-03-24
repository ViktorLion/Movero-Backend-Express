const express = require('express');
const { wss } = require('./utils/websocket'); // Import wss from websocket.js
const { connectDB } = require('./utils/db');
const server = express(); // Create Express server
const cors = require('cors');
server.use(cors())
const mongoose = require('mongoose');

// Define the model outside of the route handler
const codeBlockSchema = new mongoose.Schema({
  id: { type: String, required: true },  
  title: { type: String, required: true },
  code: { type: String, required: true },
  corectCode: { type: String, required: true },
});
const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema)

server.use('/api/code-blocks', async (req, res) => {
 console.log('Got to /api/code-blocks')
  try {
    const codeBlocks = await CodeBlock.find({}); // Fetch all code blocks
    res.status(200).json(codeBlocks);
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

server.use('/api/test', async (req, res) => {
  console.log('test')
 })

// Create Express server 
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000; // Set your desired port here
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    await connectDB();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit on error
  }
};

startServer();