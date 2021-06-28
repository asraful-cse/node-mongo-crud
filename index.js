const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;   /// mogodb theke data id import korar jonow

const password = 'qXf4f4V8yxdTT!N';

const uri = "mongodb+srv://OrganicUser:qXf4f4V8yxdTT!N@cluster0.85cmi.mongodb.net/Organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });   // error theke copy kore bosano hoyese.useUnifiedTopology


const app = express();                        // express appliction make koresi.
app.use(bodyParser.json());                                // body parser koreci and nicher line ke form niyar jonno 
app.use(bodyParser.urlencoded({ extended: false }));            // urlencoded form er jonno koreci.......


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');                 // node js jekono file patheno  jai amra html file pathacci.
})

client.connect(err => {
  const productCollection = client.db('Organicdb').collection('products');   // database connection korar jonno ekhon () er vetore name likhlei hobes

// CRUD Dataer  red korar jonno use koreci...
  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  // for a single product ::
  app.get('/product/:id', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })


  // CRUD Data er create/insert korar jonno use koreci....
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    // console.log(product);
    productCollection.insertOne(product)
      .then((result) => {
        // process result
        // console.log('data added success');
        // res.send('success');
        res.redirect('/')
      })
  })

  // for update.. 
  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { price: req.body.price, quantity: req.body.quantity }
      })
      .then(result => {
        // console.log(result);
        res.send(result.modifiedCount > 0)
      })
  })

  // for delete...
  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id);
    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        // console.log(result);
        res.send(result.deletedCount > 0);
      })
  })

});


app.listen(3000)