var express = require('express')
var SocketServer = require('./socket-server')
var CONFIG = require('dotenv').config().parsed;
var osc = require('node-osc');

var app = express()
app.set('port', (CONFIG.WEB_SERVER_PORT || 5000))




const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');
var socketServer = new SocketServer();


function flipHexString(hexValue, hexDigits) {
  var h = hexValue.substr(0, 2);
  for (var i = 0; i < hexDigits; ++i) {
    h += hexValue.substr(2 + (hexDigits - 1 - i) * 2, 2);
  }
  return h;
}

function hexToFloat(hex) {
  var s = hex >> 31 ? -1 : 1;
  var e = (hex >> 23) & 0xFF;
  return s * (hex & 0x7fffff | 0x800000) * 1.0 / Math.pow(2, 23) * Math.pow(2, (e - 127))
}

udpServer.on('error', (err) => {
  udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {

  //This part is completely wrong - need to make it work, should be a value from 0-1 coming in
  var buff = new Buffer(msg);
  var arr = new Uint16Array(msg);
  var sliced = arr.slice(12,16);
  var buffer = Buffer.from( sliced );
  var hex = buffer.toString('hex');
  var n = flipHexString('0x' + hex, 8);
  var n2 = parseInt(n)/100000;
  socketServer.emit('data', {freq: n2/30000});//just made some normalization to have a 0-1 value into viz

});
udpServer.on('listening', () => {
  const address = udpServer.address();
});
udpServer.bind(CONFIG.OSC_SERVER_PORT);


var oscSender = new osc.Client((CONFIG.OSC_CLIENT_IP || 'localhost'), (CONFIG.OSC_CLIENT_PORT || 9000 ));


function init(){
  socketServer.start((CONFIG.SOCKET_SERVER_PORT || 3000), onClientConnection);
}


function onClientConnection(client){
  //every frame client is sending the orbit data
  client.on('data', function(data){
      oscSender.send('/freq', Number(data.freq), function(){});
      oscSender.send('/send1', data.dist, function(){});
    });
}


app.use('/', express.static(__dirname + '/public'))
app.listen(app.get('port'), function() {
  console.log("Node webb app is running at localhost:" + app.get('port'))
})

init();
