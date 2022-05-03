const spy=require('puppeteer')

console.log("start!")


//las 3 funciones de scrap se podrían simplificar en una, pasarle el URL y hacerle switch case para la búsqueda de selectores por caso.

async function get_dolarhoy(){
    const browser=await spy.launch()
    const page= await browser.newPage()
    await page.goto("https://dolarhoy.com/")
    const precios= await page.evaluate(()=>{
        return Array.from(document.querySelectorAll(".val")).map(x=>x.textContent)
    });
    await browser.close()
    
    return ({
        "buy_price": precios[0],
        "sell_price": precios[1],
        "source": "https://dolarhoy.com/"
      })
}

async function get_ambito(){
    const browser=await spy.launch()
    const page= await browser.newPage()
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
    const browser=await spy.launch()
    const page= await browser.newPage()
    await page.goto("https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB")
    const compra= await page.evaluate(async()=>{
        return Array.from(document.querySelectorAll(".buy-value")).map(x=>x.textContent)
    });
    const venta= await page.evaluate(async()=>{
        return Array.from(document.querySelectorAll(".sell-value")).map(x=>x.textContent)
    }); 
    await browser.close()
   
    return ({
        "buy_price": compra[0],
        "sell_price": venta[0],
        "source": "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"
      })
}

get_dolarhoy().then(res=>console.log(res))
get_ambito().then(res=>console.log(res))
get_cronista().then(res=>console.log(res))

