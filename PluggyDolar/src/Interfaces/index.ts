export interface Precios {
    buy_price: string,
    sell_price: string,
    source:string
  }

export interface Promedio{
    average_buy_price:string,
    average_sell_price:string
}

export interface Variacion{
    buy_price_slippage:string,
    sell_price_slippage:string,
    source:string
}