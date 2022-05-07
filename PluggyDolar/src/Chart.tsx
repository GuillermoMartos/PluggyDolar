import {FC} from 'react'
import {Bar,} from 'react-chartjs-2'
import { Variacion } from './Interfaces';


const Chart:FC <Array <Variacion>>=(prueba)=> {


  function log(){
    console.log(prueba)

  }
  return (
    <button onClick={()=>log()}></button>
    // <Bar></Bar>
    )
}

export default Chart
