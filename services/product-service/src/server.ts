import mongoose from 'mongoose';
import { app } from './app';

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/products';

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {  // Listen on all interfaces
      console.log(`Product service listening on port ${PORT}`);
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        PORT,
        MONGODB_URI
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();