import React, { PureComponent, useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import './Variacion.css'


function Variacion({ data }) {
  let [info, setInfo] = useState([])


  useEffect(() => {
    console.log(data)
    for (let i of data) {
      setInfo(prevState => (
        [...prevState, {
          name: i.source.includes("ambito") ? "ambito" :
            i.source.includes("cronista") ? "cronista" :
              i.source.includes("dolarhoy") ? "dolarhoy" :
                i.source,
          dif_compra: i.buy_price_slippage,
          dif_venta: i.sell_price_slippage,
          amt: 2
        }]
      ));
    }
  }, [])

  return (


    <div className="parent">
      <div className="graficos">
        <h4 className='graph-title'>Variaciones</h4>

        {info.length > 1 && info.map(d => {

          return (
            <ResponsiveContainer width="87%" height="99%">
              <BarChart
                width={100}
                height={100}
                data={[d]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#FFFFFF' }} />
                <YAxis domain={[-2, 2]} tick={{ fontSize: 12, fill: '#FFFFFF' }} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#FFFFF" />
                <Bar dataKey="dif_venta" fill="#8884d8" />
                <Bar dataKey="dif_compra" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )
        })}
      </div>

    </div>
  )
}

export default Variacion
