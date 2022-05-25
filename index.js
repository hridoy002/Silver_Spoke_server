const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require =('dotenv').config();


app.use(cors());
app.use(express.json())


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