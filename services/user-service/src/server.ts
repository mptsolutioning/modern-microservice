import mongoose from 'mongoose';
import { app } from './app';

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/users';

async function connectToMongoDB(retries = 5, delay = 5000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
      return;
    } catch (error) {
      console.error(`Failed to connect to MongoDB (attempt ${i + 1}/${retries}):`, error);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Failed to connect to MongoDB after multiple attempts');
}

async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`User service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();