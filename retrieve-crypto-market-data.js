//var mbcoinUrls = require('mbcoinUrls');
var http = require('http');
const https = require('https');
var schedule = require('node-schedule');
var util = require('util');

var makeRequest = function () {
    
    https.get('https://www.mercadobitcoin.net/api/BTC/ticker/', (resp) => {
        
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            util.log("Mercado bit coin Request finished");
            util.log(JSON.parse(data));
        });
        
      }).on("error", (err) => {
        util.log("Error: " + err.message);
      });
}

var j = schedule.scheduleJob('*/1 * * * *', makeRequest);
  

/*http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end(makeRequest());
   

}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');*/