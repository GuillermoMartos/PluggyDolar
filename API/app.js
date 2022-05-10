const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { get_dolarhoy, get_ambito, get_cronista, average_and_slippage } = require("./utils/index")
const NodeCache = require('node-cache')
const myCache = new NodeCache()


const app = express();
const port= process.env.PORT || 3001;
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "https://pluggy-dolar.vercel.app",
    "http://localhost:3000"
  ]
}))

async function cacheCleaner(){
  // función asíncrona para que continue el proceso y que corro cada 60segs para borrar la caché. Estos datos los uso en las 3 rutas, así que primero consulto si están en la caché, de no estar, las pido y la caché se actualiza.
    myCache.del('precios')
}

setInterval(()=>{
  cacheCleaner();
}, 60000)


app.get('/quotes', async (req, res) => {
  console.log('Cookies: ', req.cookies)
  if (myCache.has('precios')) {
    res.status(200).send(myCache.get('precios'))
  }
  else {
    // try{
      let prices = await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
      .then(allData => allData)
      myCache.set('precios', prices)
      res.status(200).send(prices)
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
    let prices = await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
      .then(allData => allData)
    myCache.set('precios', prices)
    res.status(200).send(average_and_slippage(prices, "average"))
  }
})

app.get('/slippage', async (req, res) => {
  if (myCache.has('precios')) {
    res.status(200).send(average_and_slippage(myCache.get('precios'), "slippage"))
  }
  else {
    let prices = await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
      .then(allData => allData)
    myCache.set('precios', prices)
    res.status(200).send(average_and_slippage(prices, "slippage"))
  }
})

app.listen(port, async () => {
  console.log(`Conected to port ${port}`);
});