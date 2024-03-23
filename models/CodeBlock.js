const mongoose = require('mongoose');

// Define the schema for a code block
const codeBlockSchema = new mongoose.Schema({
  id: { type: String, required: true },  
  title: { type: String, required: true },
  code: { type: String, required: true },
  corectCode: { type: String, required: true },
});
// Export the model based on the schema
module.exports = mongoose.model('CodeBlock', codeBlockSchema);