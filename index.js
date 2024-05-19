const cors = require('cors');
const express = require('express');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


// middleware

app.use(cors());
app.use(express.json());


// mongoDb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Akash030:Akash030@cluster0.pmnkpyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



const craftCollection = client.db('craftDb').collection('craft')
const subCategoryCollection = client.db('craftDb').collection('subCategory')
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        app.get('/craft', async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });


        app.post('/craft', async (req, res) => {
            const addCraft = req.body;
            const result = await craftCollection.insertOne(addCraft);
            res.send(result);
        })

// Specific data added by single user
        app.get('/craft/:email', async (req, res) => {

            const result = await craftCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        });



// dynamic rout for view details cart

        app.get('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result)
        })

// Delete Method

        app.delete('/craft/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.deleteOne(query)
            res.send(result)
        })


        // Put method
        app.put('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateCraft = req.body;
            const craft = {
                $set: {
                    photo: updateCraft.photo,
                    item: updateCraft.item,
                    subCategory: updateCraft.subCategory,
                    description: updateCraft.description,
                    price: updateCraft.price,
                    rating: updateCraft.rating,
                    customization: updateCraft.customization,
                    time: updateCraft.time,
                    stock: updateCraft.stock,

                    
                }
            }
            const result = await craftCollection.updateOne(query, craft, option);
            res.send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('craft store running')
})
app.listen(port, () => {
    console.log(`Craft Server is running on port ${port}`)
})
