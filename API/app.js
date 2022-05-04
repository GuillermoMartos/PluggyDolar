const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const {get_dolarhoy, get_ambito, get_cronista} = require("./utils/index")


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

app.get('/quotes', async (req, res) => {
   let prices= await Promise.all([get_ambito(), get_cronista(), get_dolarhoy()])
   .then(allData=>allData)
    
   res.status(200).send(prices)
  })
  

app.listen(3001, async() => {
    console.log(`Conected to port 3001`);
  });