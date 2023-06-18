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

app.use((req, res, next) => {
  const originURL = req.headers.origin;
  const baseUrl = 'https://pluggy-dolar.vercel.app';
  const devLocalhost = 'http://localhost:3000'

  if (originURL?.includes(baseUrl) || originURL?.includes(devLocalhost)) {
    console.log('te tomé la url', originURL)
    res.setHeader('Access-Control-Allow-Origin', originURL);
  }
  else if (req.url === 'https://redagmailerapi.onrender.com/client/ping-alive/cron') {
    console.log('bienvenido ping monitor', req.url)
    res.setHeader('Access-Control-Allow-Origin', req.url); // update to match the domain you will make the request from
  }
  else {
    console.log('no tomé la url y te voy a devolver la baseUrl. Tu url fue:', originURL)
    console.log(req.url, 'es tu url')
    console.log(JSON.stringify(req.headers), 'son los headers')
    res.setHeader('Access-Control-Allow-Origin', baseUrl); // update to match the domain you will make the request from
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.get('/quotes', async (req, res) => {
  if (myCache.has('precios')) {
    const precios = myCache.get('precios')
    const promedios = average_and_slippage(precios, 'average')
    const variacion = average_and_slippage(precios, 'slippage')
    res.status(200).send({precios, promedios, variacion})
  }
  else {
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
  }
})

app.listen(port, async () => {
  console.log(`Conected to port ${port}`);
});