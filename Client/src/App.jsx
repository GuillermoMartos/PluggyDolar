import { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import { Carousel } from "react-bootstrap";
import Variacion from "./components/Variacion/Variacion";
import AmbitoLogo from './assets/ambito.svg';
import CronistaLogo from './assets/cronista.svg';
import DolarHoyLogo from './assets/dolarhoy.svg';
import PromedioLogo from './assets/promedio.svg';
import './App.css'


function App() {
  let [start, setStart] = useState(true)
  let [loading, setLoading] = useState(true)

  const [precios, setPrecios] = useState(null);
  const [promedios, setPromedios] = useState(null);
  const [variacion, setVariacion] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/quotes").then(res => res.json()).then(data => {
      setPrecios(data)
    })
      .then(() => fetch("http://localhost:3001/average").then(res => res.json()).then(data => {
        setPromedios(data)
      }))
      .then(() => fetch("http://localhost:3001/slippage").then(res => res.json()).then(data => {
        setVariacion(data)
        setStart(!start)
      }))
  }, [])






  return (
    <div className="main">
      <div className="nav">
        <img src="https://pluggy.ai/_next/image?url=%2Flogo.png&w=128&q=75" alt="pluggy-logo" />
      </div>
      {!start && !start ?

        <div className="pruebita">
          <Carousel>
            <Carousel.Item interval={1000}>
              <img
                className="d-block w-100"
                src={AmbitoLogo}
                alt="First slide"
              />
              <Carousel.Caption>
                <h4>Fuente: <a href={precios[0].source} target="_blank">{precios[0].source}</a></h4>
                <h3>Compra ${precios[0].buy_price}</h3>
                <h3>Venta ${precios[0].sell_price}</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={700}>
              <img
                className="d-block w-100"
                src={CronistaLogo}
                alt="Second slide"
              />
              <Carousel.Caption>
                <h4>Fuente: <a href={precios[1].source} target="_blank">{precios[1].source}</a></h4>
                <h3>Compra ${precios[1].buy_price}</h3>
                <h3>Venta ${precios[1].sell_price}</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={1000}>
              <img
                className="d-block w-100"
                src={DolarHoyLogo}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h4>Fuente: <a href={precios[2].source} target="_blank">{precios[2].source}</a></h4>
                <h3>Compra ${precios[2].buy_price}</h3>
                <h3>Venta ${precios[2].sell_price}</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={1000}>
              <img
                className="d-block w-100"
                src={PromedioLogo}
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>PROMEDIOS</h3>
                <h4>Venta ${promedios.average_buy_price}</h4>
                <h4>Venta ${promedios.average_sell_price}</h4>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

        </div>
        :
        <div className="middle">
          <div className="bar bar1"></div>
          <div className="bar bar2"></div>
          <div className="bar bar3"></div>
          <div className="bar bar4"></div>
          <div className="bar bar5"></div>
          <div className="bar bar6"></div>
          <div className="bar bar7"></div>
          <div className="bar bar8"></div>
        </div>
      }


      <div className="prom-var">
        {promedios ?

          <div className="dolar">

            {/* <p className="digital">PROMEDIO PRECIO COMPRA: </p> */}
            <p className="digital">PROMEDIO COMPRA: {promedios.average_buy_price}</p>
            {/* <p className="digital">PROMEDIO PRECIO VENTA: </p> */}
            <p className="digital">PROMEDIO VENTA: {promedios.average_sell_price}</p>
            <div style={{"align-self":" flex-end"}}>
              <a href="https://pluggy.ai/" target="_blank"><img  src="https://pluggy.ai/_next/image?url=%2Flogo.png&w=128&q=75" alt="pluggy_logo" /></a>
            </div>
          </div>
          :
          <div></div>

        }

        {variacion && variacion ?
          <Variacion data={variacion} />
          :
          <div></div>
        }
      </div>

    </div>

  )
}

export default App
