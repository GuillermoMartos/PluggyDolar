import { useEffect, useState, FC } from "react"
import { Precios, Variacion, Promedio } from "./Interfaces/index"
import 'bootstrap/dist/css/bootstrap.css';
import { Carousel } from "react-bootstrap";
import Chart from './Chart'



const App: FC = ()=> {

  const [precios, setPrecios] = useState<Array<Precios> | null>(null);
  const [promedios, setPromedios] = useState<Promedio | null>(null);
  const [variacion, setVariacion] = useState<Array<Variacion> | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/quotes").then(res => res.json()).then(data => {
      setPrecios(data)
    })
      .then(() => fetch("http://localhost:3001/average").then(res => res.json()).then(data => {
        setPromedios(data)
      }))
      .then(() => fetch("http://localhost:3001/slippage").then(res => res.json()).then(data => {
        setVariacion(data)
      }))
  }, [])






  return (
    <div className="main">
      <h1 className="hola">HOLA!</h1>
      {variacion && variacion?
      <Chart>
        data={variacion}
      </Chart>
      :
      null
      }
      {/* <Chart></Chart> */}
      {precios && precios.length > 1 ?

        <div className="dolar">
          <Carousel>
            <Carousel.Item interval={1000}>
              <img
                className="d-block w-100"
                src="https://media.tycsports.com/files/2021/08/12/319049/dolares_416x234.jpg"
                width="cover"
                height="150em"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>{precios[0].buy_price}</h3>
                <p>{precios[0].sell_price}</p>
                <p>{precios[0].source}</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={700}>
              <img
                className="d-block w-100"
                src="https://static4.depositphotos.com/1000383/334/i/600/depositphotos_3342798-stock-photo-many-bundle-of-us-100.jpg"
                width="100%"
                height="150em"
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>{precios[1].buy_price}</h3>
                <p>{precios[1].sell_price}</p>
                <p>{precios[1].source}</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.clarin.com/img/2021/03/22/sube-el-dolar-blue___VosNxnRmN_1200x630__1.jpg"
                width="100%"
                height="150em"
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>{precios[2].buy_price}</h3>
                <p>{precios[2].sell_price}</p>
                <p>{precios[2].source}</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

        </div>
        :
        null
      }

      {promedios ?

        <div className="dolar">
          PROMEDIOS!
          <p>{promedios.average_buy_price}</p>
          <p>{promedios.average_sell_price}</p>
        </div>
        :
        null

      }
      {variacion && variacion.map(data => {

        return (
          <div className="dolar">

            VARIACION!
            <p>{data.buy_price_slippage}</p>
            < p>{data.sell_price_slippage}</p>
            <p>{data.source}</p>

          </div>    

        )
      })}
    </div>

  )
}

export default App
