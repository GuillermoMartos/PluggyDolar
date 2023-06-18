const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { average_and_slippage, get_prices } = require("./utils/index")
const NodeCache = require('node-cache')
const myCache = new NodeCache()


const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "https://pluggy-dolar.vercel.app",
    "http://localhost:3000"
  ]
}))

async function cacheCleaner() {
  // función asíncrona para que continue el proceso y que corro cada 60segs para borrar la caché. Estos datos los uso en las 3 rutas, así que primero consulto si están en la caché, de no estar, las pido y la caché se actualiza.
  myCache.del('precios')
}

setInterval(() => {
  cacheCleaner();
}, 60000)


app.get('/quotes', async (req, res) => {
  if (myCache.has('precios')) {
    res.status(200).send(myCache.get('precios'))
  }
  else {
    // try{
    try {
      console.log('start fetching dollar prices...')
      let prices = await get_prices()
      myCache.set('precios', prices)
      console.log(prices)
      res.status(200).send(prices)
    }
    catch (error) {
      console.log(error)
      res.status(503).send({ error: 'values not found' })
    }
    // }
    // catch(err){
    //   console.log(err)
    //   res.status(503).send([{
    //     "buy_price": "0",
    //     "sell_price": "0",
    //     "source": "no source"
    //   }])
    // }
  }
})

app.get('/average', async (req, res) => {
  if (myCache.has('precios')) {
    res.status(200).send(average_and_slippage(myCache.get('precios'), "average"))
  }
  else {
    try {
      let prices = await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
        .then(allData => allData)
      myCache.set('precios', prices)
      res.status(200).send(average_and_slippage(prices, "average"))
    }
    catch (error) {
      console.log(error)
      res.status(404).send({ error: 'values not found' })
    }
  }
})

app.get('/slippage', async (req, res) => {
  if (myCache.has('precios')) {
    res.status(200).send(average_and_slippage(myCache.get('precios'), "slippage"))
  }
  else {
    try {
      let prices = await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
        .then(allData => allData)
      myCache.set('precios', prices)
      res.status(200).send(average_and_slippage(prices, "slippage"))
    }
    catch (error) {
      console.log(error)
      res.status(404).send({ error: 'values not found' })
    }
  }
})

app.listen(port, async () => {
  console.log(`Conected to port ${port}`);
});