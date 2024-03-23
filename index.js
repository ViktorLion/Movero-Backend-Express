const express = require('express');
const { wss } = require('./utils/websocket'); // Import wss from websocket.js
const { connectDB } = require('./utils/db');
const { CodeBlock } = require('./models/CodeBlock') 
const server = express(); // Create Express server
const cors = require('cors');
server.use(cors())


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

 
server.use('/', async (req, res) => {
  res.send('Hello World')
  console.log('test')
 })

// Create Express server 
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3010; // Set your desired port here
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    //await connectDB();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit on error
  }
};


startServer();