const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();


app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwvxc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function  run(){
    try{
        await client.connect();
        const toolsCollection = client.db('silver_spoke').collecton('tools');

        app.get('/tools', async(req,res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        })
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Silver Spoke server')
})

app.listen(port, () => {
  console.log(`Silver Spoke server conditin good ${port}`)
})



















// const products = [{
//     name: 'Bat',
//     price: 700,
//     description: 'Kashmiri willow'
// },{
//     name: 'Ball',
//     price: 700,
//     description: 'Kokabura sd ball'
// },
// {
//     name: 'Stump',
//     price: 700,
//     description: 'Wooden'
// }];

// const search = products.filter(product => product.name == 'Bat');
// console.log(search)