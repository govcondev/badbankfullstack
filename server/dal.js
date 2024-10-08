const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

// Connect to MongoDB
async function connectToDB() {
    if (!db) {
        try {
            const client = await MongoClient.connect(url);
            db = client.db('myproject');
            console.log("Connected successfully to DB server");
        } catch (err) {
            console.error("Failed to connect to the database", err);
            throw err;
        }
    }
    return db;
}

// Create user account with Firebase UID
async function create(name, email, password = '', uid) {
    try {
        const db = await connectToDB();
        const collection = db.collection('users');
        const doc = { name, email, password, uid, balance: 0 };  // Include UID
        await collection.insertOne(doc);
        return doc;
    } catch (err) {
        console.error("Error creating user", err);
        throw err;
    }
}

// Get all users
async function all() {
    try {
        const db = await connectToDB();
        return await db.collection('users').find({}).toArray();
    } catch (err) {
        console.error("Error fetching users", err);
        throw err;
    }
}

// Get account balance
async function findUserByEmail(email) {
    const db = await connectToDB();
    console.log("Searching for user with email:", email);

    const user = await db.collection('users').findOne({ email: email });
    console.log("Query result:", user);

    return user;
}



// Update user account balance
async function updateBalance(email, newBalance) {
    try {
        const db = await connectToDB();
        // Use findOneAndUpdate to ensure the document is found and updated in one atomic operation
        const result = await db.collection('users').findOneAndUpdate(
            { email: email }, // Search for user by email
            { $set: { balance: newBalance } }, // Update the balance
            { returnOriginal: false } // Return the updated document
        );

        if (result.value) {
            console.log("User balance updated successfully:", result.value);
            return result.value; // Return the updated document
        } else {
            console.log("User not found for email:", email);
            return null; // User not found
        }
    } catch (err) {
        console.error("Error updating balance", err);
        throw err;
    }
}

module.exports = { create, all, findUserByEmail, updateBalance };
