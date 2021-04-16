const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6dkg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app  = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send('welcome to Computer Doctor')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("computer-doctor").collection("service");
  const orderCollection = client.db("computer-doctor").collection("order");
  const reviewsCollection = client.db("computer-doctor").collection("reviews");
  const addAdmin = client.db("computer-doctor").collection("admin");
// add service
app.post('/addService', (req, res) =>{
    const service = req.body;
    serviceCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.get('/serviceList', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) =>{
        res.send(documents);
    })
})
// add order
app.post('/addOrder', (req, res) =>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
app.get('/orderList/:email', (req,res) => {
    const email = req.params.email;
    console.log('email',email);
    orderCollection.find({email: email})
    .toArray((err,documents) => {
        res.send(documents)
    })
})

app.get('/orderList', (req, res) => {
    orderCollection.find({})
    .toArray((err, documents) =>{
        res.send(documents);
    })
})
// review
app.post('/addReviews', (req, res) =>{
    const reviews = req.body;
    reviewsCollection.insertOne(reviews)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
app.get('/reviewsList', (req, res) => {
    reviewsCollection.find({})
    .toArray((err, documents) =>{
        res.send(documents);
    })
})

// admin
app.post('/addToAdmin', (req, res) =>{
    const admin = req.body;
    addAdmin.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
app.post('/addAdmin', (req, res) =>{
    const email = req.body.email;
    addAdmin.find({email: email})
    .toArray((err, admin) =>{
        res.send(admin.length > 0);
    })
    
})

});




app.listen(process.env.PORT || port)