const mongoose = require('mongoose');
const connectionString = `mongodb+srv://Admin:AdminPassword123@clusterproject.1g5hsd3.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProject`; // Replace placeholders

// Connect to MongoDB
const connectDB = async () => {  
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};

module.exports = { connectDB };