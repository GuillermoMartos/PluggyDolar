const spy=require('puppeteer')

 /*
    FUNCIONES get_{source}: cada función get_{source} abre la página a scrapear y busca los datos de precios de compra y venta de dólar.
    
    * @param: no reciben parámetros

    * @return {Objeto}: objeto con tres propiedades: precios de compra y venta de dólar, y fuente (url)
*/

async function get_dolarhoy(){
    const browser=await spy.launch({ args: ['--no-sandbox'] })
    const page= await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://dolarhoy.com/")
    const precios= await page.evaluate(()=>{
        return Array.from(document.querySelectorAll(".val")).map(x=>x.textContent)
    });
    await browser.close()
    
    return ({
        "buy_price": precios[0].slice(1),
        "sell_price": precios[1].slice(1),
        "source": "https://www.dolarhoy.com/"
      })
}

async function get_ambito(){
    const browser=await spy.launch({ args: ['--no-sandbox'] })
    const page= await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://www.ambito.com/contenidos/dolar.html")
    const precios= await page.evaluate(()=>{
        return Array.from(document.querySelectorAll(".value")).map(x=>x.textContent)
    });
    await browser.close()
    
    return ({
        "buy_price": precios[1],
        "sell_price": precios[2],
        "source": "https://www.ambito.com/contenidos/dolar.html"
      })
}

async function get_cronista(){
    const browser=await spy.launch({ args: ['--no-sandbox'] })
    const page= await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB")
    const compra= await page.evaluate(async()=>{
        return Array.from(document.querySelectorAll(".buy-value")).map(x=>x.textContent)
    });
    const venta= await page.evaluate(async()=>{
        return Array.from(document.querySelectorAll(".sell-value")).map(x=>x.textContent)
    }); 
    await browser.close()
   
    return ({
        "buy_price": compra[0].slice(1),
        "sell_price": venta[0].slice(1),
        "source": "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"
      })
}

function average_and_slippage(prices, action) {
    /*
    FUNCION average_and_slippage: recibe arreglo con precios dólar y según defina la acción devuelve a) objeto con promedio de sus precios de venta y compra b) arreglo de objetos con la variación entre el precio dólar de compra y venta de la fuente y el del promedio de las 3 fuentes, y la fuente (url)
    
    * @param1 Array<Price> "prices": arreglo de precios dólar
    * @param2 string "action": informa si la función resuelve promedio o variación
    * @return {Objeto}|Array<Variacion>: a) objeto con dos propiedades: promedio de precio de compra y venta de dólar b) arreglo de objetos con tres propiedades: variación entre precio compra y promedio de precio compra, variación entre precio venta y promedio precio venta, y fuente de precio referencia (url)
    */

    let buy = []
    let sell = []
    //recorro el arreglo para normalizar datos primero
    for (i of prices) {
        buy.push(parseFloat(i.buy_price))
        sell.push(parseFloat(i.sell_price))
    }
    //una vez normalizados los datos y agregados a un arreglo los precios de compra y venta, sumo todos los valores en la función reduce y luego los divido por la cantidad de elementos (saco promedio), y al final corto los decimales que tuviere hasta dos (toFixed(2))... Si la acción es "slippage" (ver switch-> case "slippage"), a cada objeto del arreglo inicial se le resta el precio del promediado tanto para compra como para venta.
    let average_buy_price = ((buy.reduce((a, b) => a + b)) / buy.length).toFixed(2)
    let average_sell_price = ((sell.reduce((a, b) => a + b)) / sell.length).toFixed(2)
    
    switch (action) {
        case "average": {
            return {
                average_buy_price,
                average_sell_price
            }
        }
        case "slippage": {
            let arrayResponse=[]
            let buy_price_slippage="";
            let sell_price_slippage="";
            for (i of prices){
                buy_price_slippage= (parseFloat(i.buy_price)-average_buy_price).toFixed(2)
                sell_price_slippage= (parseFloat(i.sell_price)-average_sell_price).toFixed(2)
                arrayResponse.push({buy_price_slippage, sell_price_slippage, source:i.source})
            }
            
            return Object.values(arrayResponse)
        }
        default: return
    }
}

module.exports=(
    {get_dolarhoy, get_ambito, get_cronista, average_and_slippage}
)

