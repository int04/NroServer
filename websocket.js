let socket    = require('./app/websocket');
let chuyentien  = require('./app/Controller/Users/chuyentien/index.js');
let chat = require('./app/Controller/Users/Home/chat.js');
//let admin    = require('./app/data/admin');
let ott = require('./app/Controller/Users/ott/game');
let Bacaygame = require('./app/Controller/Users/BaCay/game');
let mysqli    =     require('./app/Model/mysqli');
let lixi  = require('./app/Controller/Users/nguoichoi/lixi.js');

let getws = function(ws,hi){
	ws.auth      = true;
	ws.admin = false;
	/// new login
	ws.dn = function(data){
		try {
			data = JSON.stringify(data);
			data  = data.replace(/[\u007F-\uFFFF]/g, function(chr) {
				return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
			})
			this.readyState == 1 && this.send(Buffer.from(data), 'utf-8');
		} catch(err) {}
	}
	
	ws.on('message', function(message,req) {
		
		try {
			message = message.toString('utf-8');
			
			if (!!message) {
				message = JSON.parse(message);
				if(!!message.chuyentien)
				{
					chuyentien(this,message.chuyentien,hi);
				}
				else
				if(!!message.ott)
				{
					ott(this,message.ott,hi);
				}
				else
				if(!!message.lixi)
				{
					lixi(this,message.lixi,hi);
				}
				else
				if(!!message.chat)
				{
					chat(this,message.chat,hi);
				}
				else
				if(!!message.bacay)
				{
					Bacaygame(this,message.bacay,hi);
				}
				else
				{
					socket.message(this, message);
				}
			}
		} catch (error) {
			console.log(error)
		} 
	}); 
	ws.on('close', function(message) {
		// xoa users khoi he thong
		if(ws.id <= 0)
		{
			global['TOTALONLINE']-=1;
		}
		else 
		{
			mysqli.query("UPDATE `nguoichoi` SET `time_online` = '0' WHERE `id` = '" + ws.id + "'", function (err, users) {
			});

			Bacaygame(ws,{thoat : true},hi);
		}
		


	});
} 

 
let getadmin = function(ws,hi){
	ws.auth      = true;
	ws.admin = false;
	/// new login
	ws.dn = function(data){
		try {
			data = JSON.stringify(data);
			data  = data.replace(/[\u007F-\uFFFF]/g, function(chr) {
				return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
			})
			this.readyState == 1 && this.send(Buffer.from(data), 'utf-8');
		} catch(err) {}
	}
	ws.on('message', function(message) {
		try {
			message = message.toString('utf-8');
			
			if (!!message) {
				message = JSON.parse(message);
				socket.admin(this,message);
			}
		} catch (error) {
		} 
	}); 
	ws.on('close', function(message) {
	});
} 


module.exports = function(app, since2004) {
	app.enable('trust proxy')
	app.ws('/ws', function(ws, req) {
		getws(ws, since2004);
	});
	app.ws('/admin', function(ws, req) {
		getadmin(ws, since2004);
	});
};
