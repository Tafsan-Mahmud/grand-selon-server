const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o3pkv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("grand-salon").collection("salon");
  const bookingCollection = client.db("grand-salon").collection("bookings");
  const reviewCollection = client.db("grand-salon").collection("review");
  const adminCollection = client.db("grand-salon").collection("admin");


  app.post('/addService', (req, res) => {
    const recivedData = req.body;
    serviceCollection.insertOne(recivedData)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });

  app.post('/addAdmin', (req, res) => {
    const recivedData = req.body;
    adminCollection.insertOne(recivedData)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    console.log(email);
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
  })

  app.get('/getServiceData', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  });

  app.get('/getReviewData', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  });


  app.get('/service/:id', (req, res) => {
    const id = ObjectId(req.params.id)
    serviceCollection.find({ _id: id })
      .toArray((err, document) => {
        res.send(document[0]);
      })
  });

  app.delete('/deleteService/:id', (req, res) => {
    console.log(req.params.id)
    serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result.deletedCount)
        res.send(result.deletedCount > 0)
      })
  })


  app.post('/addbooking', (req, res) => {
    const booking = req.body;
    bookingCollection.insertOne(booking)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });



  app.get('/bookingDetails', (req, res) => {
    bookingCollection.find({ email: req.query.email })
      .toArray((err, items) => {
        res.send(items);
      })
  });


  app.get('/allBooking', (req, res) => {
    bookingCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  });

  app.post('/addReview', (req, res) => {
    const recivedData = req.body;
    reviewCollection.insertOne(recivedData)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  });
  app.get('/editStatus/:id', (req, res) => {
    console.log('find id', req.params.id)
    bookingCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, items) => {
        res.send(items[0]);
      })
  })

  app.patch('/update/:id', (req, res) => {
    console.log(req.body)
    bookingCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { status: req.body.status }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })



});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
