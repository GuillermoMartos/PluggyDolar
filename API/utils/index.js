const spy = require('puppeteer')
const axios = require('axios')

/*
   FUNCIONES get_{source}: cada función get_{source} abre la página a scrapear y busca los datos de precios de compra y venta de dólar. La búsqueda en ámbito es mediante http fetch.
   
   * @param: no reciben parámetros

   * @return {Objeto}: objeto con tres propiedades: precios de compra y venta de dólar, y fuente (url)
*/

async function get_prices() {
    const browser = await spy.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
    page.setDefaultNavigationTimeout(0);
    console.log('scraping dolarhoy.com')
    const urls = {
        dolarHoy: "https://dolarhoy.com/",
        ambito: 'https://mercados.ambito.com//dolar/informal/variacion',
        cronista: "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"
    }
    await page.goto(urls.dolarHoy)
    try {
        const preciosDolarHoyScrap = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".val")).map(x => x.textContent)
        });

        var preciosDolarHoyResponse = {
            "buy_price": preciosDolarHoyScrap[0].slice(1),
            "sell_price": preciosDolarHoyScrap[1].slice(1),
            "source": urls.dolarHoy
        }
        console.log('successing DolarHoy retrieve: ', preciosDolarHoyResponse)
    }
    catch (error) {
        console.log('error fetching DolarHoy', error)
        preciosDolarHoyResponse = {
            "buy_price": 0,
            "sell_price": 0,
            "source": urls.dolarHoy
        }
    }

    console.log('fetching Ambito:')
    try {
        const preciosAmbito = await axios.get(urls.ambito)

        var preciosAmbitoResponse = {
            "buy_price": preciosAmbito.data.compra,
            "sell_price": preciosAmbito.data.venta,
            "source": urls.ambito
        }
        console.log('successing Ambito retrieve: ', preciosAmbitoResponse)
    }
    catch (error) {
        console.log('error fetching Ambito', error)
        preciosAmbitoResponse = {
            "buy_price": 0,
            "sell_price": 0,
            "source": urls.ambito
        }
    }

    console.log('fetching Cronista:')
    await page.goto(urls.cronista)
    try {

        const compraCronista = await page.evaluate(async () => {
            return Array.from(document.querySelectorAll(".buy-value")).map(x => x.textContent)
        });
        const ventaCronsta = await page.evaluate(async () => {
            return Array.from(document.querySelectorAll(".sell-value")).map(x => x.textContent)
        });
        var preciosCronistaResponse = {
            "buy_price": compraCronista[0].slice(1),
            "sell_price": ventaCronsta[0].slice(1),
            "source": urls.cronista
        }
        console.log('successing Cronista retrieve: ', preciosCronistaResponse)
    }
    catch (error) {
        console.log('error fetching Cronista', error)
        preciosCronistaResponse = {
            "buy_price": 0,
            "sell_price": 0,
            "source": urls.cronista
        }
    }

    await browser.close()
    const precios = [preciosAmbitoResponse, preciosDolarHoyResponse, preciosCronistaResponse]
    const promedios = average_and_slippage(precios, 'average')
    const variacion = average_and_slippage(precios, 'slippage')
    return ({precios, promedios, variacion})
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
            let arrayResponse = []
            let buy_price_slippage = "";
            let sell_price_slippage = "";
            for (i of prices) {
                buy_price_slippage = (parseFloat(i.buy_price) - average_buy_price).toFixed(2)
                sell_price_slippage = (parseFloat(i.sell_price) - average_sell_price).toFixed(2)
                arrayResponse.push({ buy_price_slippage, sell_price_slippage, source: i.source })
            }

            return Object.values(arrayResponse)
        }
        default: throw Error
    }
}

module.exports = (
    { average_and_slippage, get_prices }
)

