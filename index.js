const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luh2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try{
        await client.connect();
        // console.log('Database Connected Successfully');
        const database = client.db('tourProgramm')
        const toursCollection = database.collection('tours');

        // GET TOURS API  
        app.get('/tours', async(req, res) =>{
            const cursor = toursCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        // Get Single API
        app.get('/tours/:id', async(req, res)=> {
            const id = req.params.id;
            // console.log('getting single id', id);
            const query = {_id: ObjectId(id)};
            const tour = await toursCollection.findOne(query);
            res.json(tour)
        })
        
        // POST API
        app.post('/tours')
    }
    finally{
        // await client.close(); 
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('MY Server is running')
});

app.listen(port, () => {
    console.log('Server running on port', port);
})