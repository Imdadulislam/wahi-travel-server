const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middlewaRE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8hue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("TravelDB");
        const servicesCollection = database.collection("Services");
        const bookingCOllection = database.collection('booking');

        // post Service
        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await servicesCollection.insertOne(services);
            res.json(result);
        });

        // Get Service
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get single product
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        
        // My booking
        app.get('/booking/:email', async (req, res) => {
            const result = await bookingCOllection.find({ email: req.params.email }).toArray();
            console.log(result);
            res.send(result);
        })

        // Get Api
        app.get('/booking', async (req, res) => {
            const cursor = bookingCOllection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        });

        // post Api
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCOllection.insertOne(booking);
            res.json(result);
        });

        // Update Status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            console.log('updating user', req);
            const filter = { _id: ObjectId(id) };
            const result = await bookingCOllection.updateOne(filter, { $set: { status: updateStatus }, });
            console.log(result);
            res.send(result);
           
        })

        // Cancel Booking
        app.delete('/cancelBooking/:id', async (req, res) => {
            const result = await bookingCOllection.deleteOne({ _id: ObjectId(req.params.id), });
            res.send(result);
        })

    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Travel server is running');
});
app.listen(port, () => {
    console.log('Server Running at', port);
})