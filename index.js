const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');


app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwvxc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect()
    const toolsCollection = client.db("silver-spoke").collection("tools");
    const usersCollection = client.db("silver-spoke").collection("users");
    const orderCollection = client.db("silver-spoke").collection("order");
    const reviewCollection = client.db("silver-spoke").collection("review");
    const profileCollection = client.db("silver-spoke").collection("profile");


    // get all tools 
    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools.reverse());
    })

    // get tool by id
    // get individual product id 
    app.get('/tools/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await toolsCollection.findOne(query);
      res.send(item);
    })

    //tools post
    app.post('/tools', async(req,res)=>{
      const tools = req.body;
      const result = await toolsCollection.insertOne(tools);
      res.send(result);
    })


    // admin 
    app.put('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: {rule:"admin"},
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // check admin or normal user 
    app.get('/admin/:email', async(req,res)=> {
      const email = req.params.email;
      const user = await usersCollection.findOne({email: email});

      const isAdmin = user.role === 'admin';
      res.send({admin: isAdmin});
    }
)

    // user store on db
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };

      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.SECRET_TOKEN, { expiresIn: '5h' })
      res.send({ result, token });
    })

    //user profile update
    app.put('/profile/:email', async(req,res)=>{
      const email = req.params.email;
      const profile = req.body;
      const filter = {email: email};
      const options = {upsert:true};
      const updateDoc = {
        $set: profile,
      };
      const result = await profileCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //get all user
    app.get("/users", async(req,res) =>{
      // const query = {};
      // const cursor = usersCollection.find(query);
      // const result = await cursor.toArray();
      // res.send(result);
      const users = await usersCollection.find().toArray();
      res.send(users);
    })


    // get review 
    app.get('/review', async(req,res) =>{
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews.reverse());
    })

    //review post
    app.post('/review', async (req,res) =>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })

    // get order for individual user 
    app.get('/order', async(req,res)=>{
      const email = req.query.email;
      const query = {email: email}
      const orders = await orderCollection.find(query).toArray();
      res.send(orders)
      
    })

    // get all order
    app.get('/orders', async(req,res)=>{
      const query ={};
      const cursor = orderCollection.find(query);
      const allorder = await cursor.toArray();
      res.send(allorder);
    })

    //post order 
    app.post('/order', async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    })

  }
  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Silver Spoke server,')
})

app.listen(port, () => {
  console.log(`Silver Spoke server condition good ${port}`)
})



















