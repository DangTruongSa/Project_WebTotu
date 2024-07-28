const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://dasoaiwk:raqI9tAIxV3ARxCY@webtotu.9xrhduo.mongodb.net/?retryWrites=true&w=majority&appName=Webtotu";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connect() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }
}

module.exports = { connect };