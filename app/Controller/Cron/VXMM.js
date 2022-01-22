let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let sodu = require('../../Model/users/sodu');
let info = require('../../Model/users/info');
let game = require('../../Model/VXMM/game');
let cuoc = require('../../Model/VXMM/cuoc');

let init = function init(obj) {
    io = obj;
    vongquaymayman();
}
let rand = function(min, max) 
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}
let taophien = function () {
    game.id += 1;
    game.trangthai = 'dangchay';
    game.a = 120;
    game.b = 0;
    game.xu = 0;
    game.win = 0;
    cuoc.slice(0).forEach(function(item)
	{
		cuoc.splice(cuoc.indexOf(item), 1);
	});
}
let reset = function () {
    game.trangthai = 'dangchay';
    game.a = 120;
    game.b = 0;
    game.xu = 0;
    game.win = 0;
    cuoc.slice(0).forEach(function(item)
	{
		cuoc.splice(cuoc.indexOf(item), 1);
	});
}

let capnhat = function()
{
    let xunhan  = game.xu
    
    mysqli.query("SELECT * FROM `cuoc_vongquay` WHERE `phien` = '"+game.id+"' AND `uid` = '"+game.win+"' AND `trangthai` = '0'",function(err,selected){
        selected.forEach(select => {
            mysqli.query("UPDATE `cuoc_vongquay` SET `trangthai` = '1', `win` = '"+xunhan+"'  WHERE `id`  = '"+select.id+"'",function(c,k){
                let xuthamgia= select.xu;
                mysqli.query("INSERT INTO `phien_vongquay` SET `phien` = '"+select.phien+"', `xu` = '"+xunhan+"', `uid` = '"+select.uid+"', `min_cuoc` = '"+xuthamgia+"'",function(edrdfgfd,insert){
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+select.uid+"'",function(yyyyy,rrr){
                        rrr.forEach(users => {
                            xunhan  = game.xu - Math.round(game.xu/100*10);
                            sodu(users.id,users.xu,xunhan,'Thắng VXMM','cuoc_vongquay',select.id);
                            mysqli.query("UPDATE `cuoc_vongquay` SET `trangthai` = '1' WHERE `trangthai` = '0'",function(kkkk,dxgdfg){
                                taophien();
                            })
                        });
                    })
                })
            })
        });
    })
    /*
    request.post(
        { 
            headers:
            {
                'content-type': 'application/x-www-form-urlencoded',
            },
            url  : system.url+'/ws/vongquay.html',
            body : "phien="+game.id+"&win="+game.win+"&xu="+game.xu+"",
            },(err, res, body) =>
            {
                console.log(body);
            }
            );   
            */   
}

let vongquaymayman = function () {
    gameLoop = setInterval(function () {

        --game.b;
        if(cuoc.length >=2)
        {
            --game.a;
        }
        if (game.id <= -1) {
            /* Reset all phiên đang chạy */
            mysqli.query("SELECT * FROM `cuoc_vongquay` WHERE `trangthai` = '0'",function(err,fre){
                if(err) throw err;
                fre.forEach(obj => {
                    mysqli.query("UPDATE `cuoc_vongquay` SET `trangthai` = '2', `phien` = '0' WHERE `id` = '"+obj.id+"'",function(e3,uppdate){
                        if(e3) throw e3;
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+obj.uid+"'",function(e4,u){
                            u.forEach(users => {
                                sodu(users.id,users.xu,obj.xu,'Hoàn trả tiền VXMM do phiên không chạy','cuoc_vongquay',obj.id);
                            });
                        })
                    })
                });
            })
            /* Since04 */
            mysqli.query("SELECT * FROM `phien_vongquay` ORDER BY `phien` DESC LIMIT 1", function (d, phien) {
                if (phien.length >= 1) {
                    game.id = +phien[0].phien;
                    taophien();
                    io.all({
                        vongquay : {
                            type : 1
                        }
                    });
                }
                else {
                    game.id = 0;
                    taophien();
                    /* Socket new users */
                    io.all({
                        vongquay : {
                            type : 1
                        }
                    });
                }
            });
        }
        
       
        io.all(
            {
                vongquay: {
                    a: game.a,
                    b: game.b,
                    xu: game.xu,
                    id: game.id,
                    cuoc: cuoc
                }
            }
        );

        io.admin(
            {
                vongquay: {
                    a: game.a,
                    b: game.b,
                    xu: game.xu,
                    id: game.id,
                    win : game.win,
                    cuoc: cuoc
                }
            }
        );
        /* SET trạng thái quay vòng */
        if (game.trangthai == "dangchay" && game.a < 15) {
            game.trangthai = "quayvong";
        }
 
        
        /* Game trạng thái kết quả */
        if (game.trangthai == "quayvong" && +game.a < 15) {
            game.trangthai = "dangtinh";
        }

        /* trạng thái đang tính, tiền hành chọn users may mắn */
        if (game.trangthai == "dangtinh") {
            if (+game.xu <= 0) {
                reset(); // nếu không có người chơi
                return false;
            }
            let otrung = [];
            for(let t=0; t<=100; t++)
            {
                otrung[t] = t;
            }
            let ngaunhien = [];
            
            cuoc.forEach(function(data){
                let tile = Math.round((+data.xu / +game.xu) * 100);
                for(let j=1; j<= tile; j++)
                {
                    let pos = rand(1, otrung.length);
                    let vitri = otrung[pos];
                    if(vitri >=1)
                    {
                        ngaunhien[vitri] = data.id;
                        otrung.slice(0).forEach(function (item) {
                            if (+item == vitri)
                                otrung.splice(otrung.indexOf(item), 1);
                        });
                    }
                }
            });
            for(let i=0; i<=100; i++)
            {
                if(ngaunhien[i] == undefined)
                {
                    ngaunhien[i] = cuoc[rand(0,cuoc.length-1)].id;
                }
                
            }
            if(cuoc.length == 1)
            {
                game.win = cuoc[0].id;
            }
            while(+game.win <= 0)
            {
                console.log(ngaunhien);
                game.win = ngaunhien[rand(1, ngaunhien.length - 1)];

            }
            console.log(ngaunhien);
            if(+game.win >=1)
            {
                game.trangthai = "ketqua";
            }
        }

        if (game.trangthai == "ketqua" && +game.a < 1) {
            let po = 0;
            for (var i = 0; i < cuoc.length; i++) {
                if (cuoc[i].id == game.win) {
                    po = i;
                    let noidung = 'Xin chúc mừng <b>'+cuoc[i].name+'</b> vừa chiến thắng <b>'+checkstring.number_format(game.xu)+'</b> xu trong trò chơi <b>Vòng quay may mắn</b>.';
                    mysqli.query("INSERT INTO `chat` SET `thoigian` = '"+Date.now()+"', `noidung` = '"+noidung+"', `uid` = '1'",function(er,g){
                        io.all(
							{
								chatbox : 
                                {
                                    name : 'Hệ thống',
                                    avatar : '/vendor/avatar/avatar.png',
                                    msg : noidung
                                }
							},
                            
						);
                        
                    });
                    break;
                }
            }
            
            // set tien
            game.b = 10;
            game.trangthai = "hoanthanh";
            capnhat();
            io.all({
                vongquay : {
                    type : 1
                }
            });
            
        }

        
        



    }, 1000);
    return gameLoop;
}


module.exports = init;