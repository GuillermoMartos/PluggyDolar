import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Carousel } from "react-bootstrap";
import Variacion from "./components/Variacion/Variacion";
import AmbitoLogo from "./assets/ambito.svg";
import CronistaLogo from "./assets/cronista.svg";
import DolarHoyLogo from "./assets/dolarhoy.svg";
import PromedioLogo from "./assets/promedio.svg";
import "./App.css";

function App() {
  let [start, setStart] = useState(true);

  const [precios, setPrecios] = useState(null);
  const [promedios, setPromedios] = useState(null);
  const [variacion, setVariacion] = useState(null);
  const [hora, setHora] = useState(null);
  const baseURL = document.URL.includes("localhost")
    ? "http://localhost:3001/"
    : "https://dolarscrapper.onrender.com/";

  useEffect(() => {
    get_info();
    const time = setInterval(get_info, 180000);
    return () => clearInterval(time);
  }, []);

  const fecthOptions = {
    mode: "cors",
    headers: { origin: "https://pluggy-dolar.vercel.app" },
  };

  const get_info = () => {
    try {
      fetch(baseURL + "quotes", fecthOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log('viene la data: ', data)
          setPrecios(data.precios);
          setPromedios(data.promedios);
          setVariacion(data.variacion);
          setStart(!start);
        })
        .then(() => setHora(new Date().toLocaleString("es-AR")));
    } catch (error) {
      alert("try again later, dollar sources off");
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <a href="https://pluggy.ai/" target="_blank">
          <img
            src="https://pluggy.ai/_next/image?url=%2Flogo.png&w=128&q=75"
            alt="pluggy_logo"
          />
        </a>
      </div>
      {!start && !start ? (
        <div className="banner">
          <Carousel>
            <Carousel.Item interval={1000}>
              <img
                className="d-block w-100"
                src={AmbitoLogo}
                alt="First slide"
              />
              <Carousel.Caption>
                <h4>
                  Fuente:{" "}
                  <a href={precios[0].source} target="_blank">
                    {precios[0].source}
                  </a>
                </h4>
                <h3>Compra ${precios[0].buy_price}</h3>
                <h3>Venta ${precios[0].sell_price}</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={900}>
              <img
                className="d-block w-100"
                src={CronistaLogo}
                alt="Second slide"
              />
              <Carousel.Caption>
                <h4>
                  Fuente:{" "}
                  <a href={precios[1].source} target="_blank">
                    {precios[1].source}
                  </a>
                </h4>
                <h3>Compra ${precios[1].buy_price}</h3>
                <h3>Venta ${precios[1].sell_price}</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={900}>
              <img
                className="d-block w-100"
                src={DolarHoyLogo}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h4>
                  Fuente:{" "}
                  <a href={precios[2].source} target="_blank">
                    {precios[2].source}
                  </a>
                </h4>
                <h3>Compra ${precios[2].buy_price}</h3>
                <h3>Venta ${precios[2].sell_price}</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={900}>
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
      ) : (
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
      )}

      <div className="prom-var">
        {promedios ? (
          <div className="dolar">
            {/* <p className="digital">PROMEDIO PRECIO COMPRA: </p> */}
            <span
              className="digital"
              style={{ lineHeight: "3em", textAlign: "right" }}
            >
              actualización: {hora}
            </span>
            <p className="digital">
              PROMEDIO COMPRA: ${promedios.average_buy_price}
            </p>
            {/* <p className="digital">PROMEDIO PRECIO VENTA: </p> */}
            <p className="digital">
              PROMEDIO VENTA: ${promedios.average_sell_price}
            </p>

            <h5>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </h5>
            <div style={{ "align-self": " flex-end" }}>
              <a href="https://pluggy.ai/" target="_blank">
                <img
                  src="https://pluggy.ai/_next/image?url=%2Flogo.png&w=128&q=75"
                  alt="pluggy_logo"
                />
              </a>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {variacion && variacion ? <Variacion data={variacion} /> : <div></div>}
      </div>
    </div>
  );
}

export default App;
