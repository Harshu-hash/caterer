import mongoose from 'mongoose';

// On a serverless platform (Vercel), the module scope can be reused across
// invocations of a warm function instance. Caching the connection promise
// avoids opening a new MongoDB connection (and exhausting the connection
// pool) on every request.
let connectionPromise = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set');
    }

    mongoose.set('strictQuery', true);

    connectionPromise = mongoose
      .connect(uri, {
        // A serverless function instance handles requests mostly one at a
        // time, so a large pool just adds idle-connection overhead.
        maxPoolSize: 5,
        // Fail fast instead of letting queries hang indefinitely if the
        // cluster is unreachable or still connecting.
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .then((conn) => {
        console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
        return conn;
      })
      .catch((err) => {
        // Let the next invocation retry instead of being stuck on a rejected promise.
        connectionPromise = null;
        throw err;
      });
  }

  return connectionPromise;
}
