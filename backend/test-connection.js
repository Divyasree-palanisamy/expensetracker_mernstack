const mongoose = require('mongoose');

// Test MongoDB Connection
const MONGODB_URI = 'mongodb+srv://expense-tracker-user:ExpenseTracker2024@cluster0.qpx18nq.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Successfully connected to MongoDB Atlas!');

        // Test creating a document
        const TestSchema = new mongoose.Schema({
            message: String,
            timestamp: { type: Date, default: Date.now }
        });

        const Test = mongoose.model('Test', TestSchema);

        const testDoc = new Test({
            message: 'Test connection successful!'
        });

        await testDoc.save();
        console.log('✅ Successfully created test document!');

        // Find the document
        const foundDoc = await Test.findOne({ message: 'Test connection successful!' });
        console.log('✅ Successfully retrieved test document:', foundDoc);

        // Clean up
        await Test.deleteOne({ message: 'Test connection successful!' });
        console.log('✅ Test document cleaned up!');

        console.log('🎉 All tests passed! Your MongoDB connection is working perfectly.');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testConnection(); 