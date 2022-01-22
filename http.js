// Router HTTP / HTTPS
let mysqli = require('./app/Model/mysqli');
let info = require('./app/Model/users/info');
let sodu = require('./app/Model/users/sodu');
let phien_game = require('./app/Controller/HTTP/server')
let vanggame = require('./app/Controller/HTTP/napvang')
let rutgame = require('./app/Controller/HTTP/rutvang')
let thecao = require('./app/Controller/HTTP/thecao')
let sms = require('./app/Controller/HTTP/sms')
let traotop = require('./app/Controller/HTTP/traotop')
let checkstatusnap = require('./app/Controller/HTTP/napthoi/urlCheckStatus')
let urlCheckName = require('./app/Controller/HTTP/napthoi/urlCheckName')
let urlAccept = require('./app/Controller/HTTP/napthoi/urlAccept')
let urlUpdate = require('./app/Controller/HTTP/napthoi/urlUpdate')
let urlFullRuong = require('./app/Controller/HTTP/napthoi/urlFullRuong')


module.exports = function(app, redT) {
    //app.post("/get",);
    //app.get("/true");
    app.get('/api/urlFullRuong', function(req, res) {
		urlFullRuong(req,res);
	});
    app.get('/api/urlUpdate', function(req, res) {
		urlUpdate(req,res);
	}); 
    app.get('/api/urlAccept', function(req, res) {
		urlAccept(req,res);
	});
    app.get('/api/urlCheckName', function(req, res) {
		urlCheckName(req,res);
	});
    app.get('/api/urlCheckStatus', function(req, res) {
		checkstatusnap(req,res);
	});
    
	 app.get('/api/traotop', function(req, res) {
		traotop(req,res);
	});
	
    app.get('/api/rut', function(req, res) {
		rutgame(req,res);
	});
    app.get('/api/sms', function(req, res) {
		sms(req,res);
	});
    app.get('/api/vang', function(req, res) {
		vanggame(req,res);
	});
    app.get('/api/server', function(req, res) {
		phien_game(req,res);
	});
    app.get('/api/thecao', function(req, res) {
		thecao(req,res);
	});
    app.get('/users/:user/:view', async  function(req, res) {
        head(res);
        console.clear();
        let k = await insert(1);
        console.log(k);
        /*
        mysqli.query("SELECT * FROM `login` where id = 0", function(er,data){
            if(er) throw err;
            let data2 = [];
            Promise.all(data.map(function(obj){
                let users = new Promise((resolve, reject)=> {
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+obj.uid+"'",function (err,nguoichoi) {
                        data2.push(nguoichoi[0].ten);
                        resolve();
                    }); 
                });
                return users;
            })).then(function(d){
                console.log(data2);
            });
        });
        */
       //res.send(`ducnghia `+test.name+` `);
       res.status(200);
      });
       
     
};
  
