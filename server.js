//server.js
/*
	Tac gia : TRAN DO DUC NGHIA
*/
console.clear()
process.env.TZ = 'Asia/Ho_Chi_Minh';
console.log('Thoigian:'+(new Date()).getDate());
require('dotenv').config();
var cors = require('cors');
let express = require('express');
let app = express();
app.use(cors({  
    origin: '*',
    optionsSuccessStatus: 200
}));

let port = process.env.PORT || 2004;
// port = 3000;
let expressWs = require('express-ws')(app);
let since2004 = expressWs.getWss();
global['list'] = []; 
global['TOTALONLINE'] = 0;

require('./app/Model/core/send')(since2004); // Add function socket
require('./http')(app, since2004); // load các routes HTTP
require('./websocket')(app, since2004); // load các routes WebSocket
require('./app/Controller/Cron/CSMM')(since2004);
require('./app/Controller/Cron/TaiXiu')(since2004);
require('./app/Controller/Cron/Cron');
 
app.listen(port, function() { 
    console.log("Server listen on port ", port);
}); 

let mysqli    =     require('./app/Model/mysqli');
mysqli.query("UPDATE `nguoichoi` SET `time_online` = '0'", function (err, users) {
});

console.log('start game');


process.on('beforeExit', code => {
    // Can make asynchronous calls
    setTimeout(() => {
      console.log(`Process will exit with code: ${code}`)
      process.exit(code)
    }, 100)
  })
  
  process.on('exit', code => {
    // Only synchronous calls
    console.log(`Process exited with code: ${code}`)
  })
  
  
 