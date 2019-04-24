var express = require('express');
require("dotenv-safe").load()

var app = express();

app.get('/update_crawler/:param', function(req, res) {
    console.log(req.params);
    res.json({'OK': 'OK'});
});
app.listen(3000);

const MercadoBitcoin = require("./MbApi").MercadoBitcoin
const MercadoBitcoinTrade = require("./MbApi").MercadoBitcoinTrade

var infoApi = new MercadoBitcoin({ currency: 'BTC' })
var tradeApi = new MercadoBitcoinTrade({ 
    currency: 'BTC', 
    key: process.env.KEY, 
    secret: process.env.SECRET, 
    pin: process.env.PIN 
})

function getQuantity(coin, price, isBuy, callback){
    price = parseFloat(price)
    coin = isBuy ? 'brl' : coin.toLowerCase()
 
    tradeApi.getAccountInfo((response_data) => {
        var balance = parseFloat(response_data.balance[coin].available).toFixed(5)
		balance = parseFloat(balance)
        //if(isBuy && balance < 50) return console.log('Sem saldo disponível para comprar!')
        console.log(`Saldo disponível de ${coin}: ${balance}`)
        
        if(isBuy) balance = parseFloat((balance / price).toFixed(5))
        callback(parseFloat(balance) - 0.00001)//tira a diferença que se ganha no arredondamento
    }, 
    (data) => console.log(data))
}

setInterval(() => {
    infoApi.ticker((response) => {
        console.log('-----------' + new Date().toString())
        console.log('Price to buy :' + response.ticker.buy);
        console.log('Price to sell :' + response.ticker.sell);
        console.log('Higher price today :' + response.ticker.high);
        console.log('Lower price today :' + response.ticker.low);

        getQuantity('BTC', response.ticker.buy, false, (qtd) => console.log(qtd))
        /*if(response.ticker.sell <= 20000){
            tradeApi.placeBuyOrder(1, 50000, 
                (data) => console.log('Ordem de compra inserida no livro. ' + data),
                (data) => console.log('Erro ao inserir ordem de compra no livro. ' + data))
        } else {
            console.log('Ainda muito alto, vamos esperar pra comprar depois.')
        }*/
    });
    //tradeApi.getAccountInfo((data) => {console.log(JSON.stringify(data))}, (error) => console.log(error));
}, process.env.CRAWLER_INTERVAL)
