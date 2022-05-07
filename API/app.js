const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { get_dolarhoy, get_ambito, get_cronista, average_and_slippage } = require("./utils/index")
const NodeCache = require('node-cache')
const myCache = new NodeCache()


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())


async function cacheCleaner(){
  // función asíncrona para que continue el proceso y que corro cada 60segs para borrar la caché. Estos datos los uso en las 3 rutas, así que primero consulto si están en la caché, de no estar, las pido y la caché se actualiza.
    myCache.del('precios')
}

// setInterval(()=>{
//   cacheCleaner();
// }, 60000)


app.get('/quotes', async (req, res) => {
  if (myCache.has('precios')) {
    res.status(200).send(myCache.get('precios'))
  }
  else {
    let prices = await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
    .then(allData => allData)
    myCache.set('precios', prices)
    res.status(200).send(prices)
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

app.listen(3001, async () => {

  console.log(`Conected to port 3001`);
});