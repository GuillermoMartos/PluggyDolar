import { useEffect, useState } from "react"
import {Precios, Variacion, Promedio} from "./Interfaces/index"

function App() {
  
  const [precios, setPrecios]= useState<Array<Precios> | null>(null);
  const [promedios, setPromedios]= useState<Promedio | null>(null);
  const [variacion, setVariacion]= useState<Array<Variacion> | null>(null);

  useEffect(() => {
   fetch("http://localhost:3001/quotes").then(res => res.json()).then(data=>{
   console.log(data)  
   setPrecios(data)}).then(()=>alert("aun!"))
   console.log(precios)
  }, [])


  return (
    <div className="main">
      <h1 className="hola">HOLA!</h1>
      {precios && precios.map(data=>{
        return (
          <div className="dolar">
            PRECIOS!
            <p>{data.buy_price}</p>
            <p>{data.sell_price}</p>
            <p>{data.source}</p>

          </div>
        )
      })}
    </div>

  )
}

export default App
