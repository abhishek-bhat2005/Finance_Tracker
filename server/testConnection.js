const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function testConnection() {
  try {
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGODB_URI is not configured in server/config.env');
    }

    console.log('🔄 Testing MongoDB connection...');
    console.log('📡 Connection string:', mongoUri.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Connection state:', mongoose.connection.readyState);
    console.log('🏠 Database name:', mongoose.connection.db.databaseName);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName
    });
    
    if (error.code === 'ETIMEOUT') {
      console.log('💡 Suggestions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify MongoDB Atlas cluster is running');
      console.log('   - Check if your IP is whitelisted in MongoDB Atlas');
      console.log('   - Try connecting from MongoDB Compass to test the connection string');
    }
    
    process.exit(1);
  }
}

testConnection();
