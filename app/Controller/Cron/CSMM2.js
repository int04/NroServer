let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let sodu = require('../../Model/users/sodu');
let info = require('../../Model/users/info');
let init = function init(obj){
	io = obj;
	GameCSMM();
}
let timeJohn = 0;
let resetbot = 0;
let GameCSMM = function()
{
    let RunCMD = setInterval(function()
    {
        Promise.all([

            new Promise (
                (res,fai) => 
                {
                    mysqli.query("SELECT * FROM `phien` WHERE `server`  = '999' AND `status` = '0'",function(err,phien){
                        if(err) throw err;
                        
                        res(phien)
                    })
                }
            ),
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `phien` WHERE `status` = '0'",function(err,phien){
                        if(err) throw err;
                        let array = [];
                        let admin = [];
                        let resadmin = [];
                        Promise.all(phien.map(function(obj){
                            return new Promise (
                                (res2,fai2) =>
                                {
                                    /* insert BOT */
                                    if(obj.time >= 25)
                                    {
                                        let tilechia = (obj.server >=11 ? 10 : obj.server) >> 0;
                                        if(obj.time%tilechia ==0)
                                        {
                                            /* Lấy trạng thái BOT */
                                            mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'bot_cuoc'",function(eee,config_bot){
                                                if(eee) throw eee;
                                                if(config_bot.length >=1)
                                                {
                                                    let vangbot = config_bot[0].data >> 0;
                                                    /* Lấy tỉ lệ BOT cược */
                                                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'tile_cuoc'",function(e3,bot_value){
                                                        if(e3) throw e3;
                                                        if(bot_value.length >=1)
                                                        {
                                                            let tilebotcuoc = bot_value[0].data >> 0;
                                                            if(tilebotcuoc >= checkstring.rand(1,100))
                                                            {
                                                                /* Lấy uid BOT */
                                                                mysqli.query("SELECT `uid` FROM `bot` WHERE `status` = '0' ORDER BY Rand() limit 1",function(e4,infobot){
                                                                    if(infobot.length >=1)
                                                                    {
                                                                        let idcuoc = infobot[0].uid;
                                                                        let vangcuoc = vangbot*checkstring.rand(1,10);
                                                                        mysqli.query("UPDATE `bot` SET `status` = '1' WHERE `uid` = '"+idcuoc+"'",function(e5,updatebot){
                                                                            if(e5) throw e5;
                                                                            let randgame = checkstring.rand(1,10) <= 5 ? 'taixiu' : 'chanle';
                                                                            let randcuoc = "";
                                                                            if(randgame == "taixiu") randcuoc = checkstring.rand(1,10) <= 5 ? 'tai' : 'xiu';
                                                                            else randcuoc = checkstring.rand(1,10) <= 5 ? 'chan' : 'le';
                                                                            mysqli.query("INSERT INTO `cuoc` SET `uid` = '"+idcuoc+"', `server` = '"+obj.server+"', `game` = '"+randgame+"', `vangcuoc` = '"+vangcuoc+"', `cuoc` = '"+randcuoc+"', `phien` = '"+obj.id+"', `trangthai` = '0', `thoigian` = '"+checkstring.time().thoigian+"'",function(e6,suce_but){

                                                                            })
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                    mysqli.query("UPDATE `phien` SET `time` = `time` - '1' WHERE `id` = '"+obj.id+"' AND `time` >= '0'");
                                    mysqli.query("SELECT  * FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `trangthai` = '0'", function (err,cuoc){
                                        let chan = 0;
                                        let le = 0;
                                        let tai = 0;
                                        let xiu = 0;
                                        
                                        Promise.all(cuoc.map(function(objcuoc){
                                            if(objcuoc.game == 'chanle' && objcuoc.cuoc == 'chan') chan+=+objcuoc.vangcuoc;
                                            if(objcuoc.game == 'chanle' && objcuoc.cuoc == 'le') le+=+objcuoc.vangcuoc;
                                            if(objcuoc.game == 'taixiu' && objcuoc.cuoc == 'tai') tai+=+objcuoc.vangcuoc;
                                            if(objcuoc.game == 'taixiu' && objcuoc.cuoc == 'xiu') xiu+=+objcuoc.vangcuoc;
                                            return new Promise (
                                                (res3, fai3) => {
                                                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+objcuoc.uid+"'",function(err3, users){
                                                        if(err3) throw err3;
                                                        if(users.length >=1)
                                                        {
                                                            users = users[0];
                                                            admin.push({
                                                                id: objcuoc.id,
                                                                uid: users.id,
                                                                name: '' + users.id + '-' + users.name + '',
                                                                vang: checkstring.number_format(users.vang),
                                                                game: objcuoc.game,
                                                                cuoc: objcuoc.cuoc,
                                                                vangcuoc: checkstring.number_format(objcuoc.vangcuoc)
                                                            });
                                                        }
                                                        res3(admin)
                                                    })
                                                    
                                                } 
                                            )
                                        })).then(e => {
                                            
                                            array.push({id : obj.id, time : obj.time ,server : obj.server, tai : tai, xiu : xiu, chan : chan, le : le});
                                            resadmin.push({id : obj.id, time : obj.time ,server : obj.server, tai : tai, xiu : xiu, chan : chan, le : le,  ketqua : obj.ketqua, users : JSON.stringify(e)});
                                            res2({ 
                                                server : JSON.stringify(array),
                                                admin :  JSON.stringify(resadmin),
                                            });
                                            tai = 0;
                                            xiu = 0;
                                            chan = 0;
                                            le = 0;

                                        });
                                    })
                                }
                            )
                            
                        })).then(e => {
                            let send = {};
                            send.server = array;
                            send.admin = resadmin;
                            res(send)
                        });
                    })
                }
            ),
            new Promise(
                (res,fai) => 
                {
                    /*
                    mysqli.query("SELECT * FROM `phien` WHERE `status` = '0' AND `time` <= 0 AND `ketqua` !=''",function(err,phien){
                        if(err) throw err;
                        
                        Promise.all(phien.map(function(obj){
                            mysqli.query("UPDATE `phien` SET `status` = '1' WHERE `id` = '"+obj.id+"'");
                            return new Promise (
                                (res1, e1) => {
                                    mysqli.query("SELECT  * FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `trangthai` = '0'", function (err,cuoc){
                                        Promise.all(cuoc.map(function(objcuoc){
                                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+objcuoc.uid+"'",function(err2,users){
                                                if(err2) throw err2;
                                                if(users.length >=1)
                                                {
                                                    users = users[0];
                                                    let ketqua = obj.ketqua >> 0;
                                                    let win = 0;
                                                    let game = '';
                                                    let notice = '';
                                                    if(objcuoc.game == "taixiu" && objcuoc.cuoc == "tai" && ketqua >=50)
                                                    {
                                                        win = objcuoc.vangcuoc * 1.8;
                                                        game = "Tài xỉu - tài";
                                                        notice = 'Tài xỉu'
                                                    }
                                                    else 
                                                    if(objcuoc.game == "taixiu" && objcuoc.cuoc == "xiu" && ketqua <=49)
                                                    {
                                                        win = objcuoc.vangcuoc * 1.8;
                                                        game = "Tài xỉu - Xỉu";
                                                        notice = 'taixiu'
                                                    }
                                                    else 
                                                    if(objcuoc.game =="chanle" && objcuoc.cuoc == "chan" && ketqua%2 ==0)
                                                    {
                                                        win = objcuoc.vangcuoc * 1.8;
                                                        game = "Chẵn lẻ - chẵn"
                                                        notice = 'Chẵn lẻ'
                                                    }
                                                    else
                                                    if(objcuoc.game == "chanle" && objcuoc.cuoc == "le" && ketqua%2 !=0)
                                                    {
                                                        win = objcuoc.vangcuoc * 1.8;
                                                        game = "Chẵn lẻ - Lẻ"
                                                        notice = 'chẵn lẻ'
                                                    }
                                                    if (win >= 1) {
                                                        mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = '" + win + "' WHERE `id` = '" + objcuoc.id + "'", function (err4, update) {
                                                            if (err4) throw err4;
                                                            sodu(users.id, users.vang, win, game, 'cuoc', objcuoc.id);
                                                            users.vang += +win;
                                                            io.all({
                                                                UPDATE:
                                                                {
                                                                    id: users.id,
                                                                    name: users.name,
                                                                    game: notice,
                                                                    vang: Math.round(win),

                                                                }
                                                            });
                                                        })
                                                    }
                                                }
                                            })
                                        })).then(e => {
                                            
                                        })
                                    });
                                }
                            )
                        })).then(e => {
                            res(e)
                        })

                    });
                    */
                   res(0);
                }
            ),
            new Promise(
                (res,fai) =>
                {
                    let array = [];
                    mysqli.query("SELECT server, ketqua FROM phien where `id` in (SELECT max(id) FROM phien WHERE `status` = 1 GROUP BY server)",function(err,phien){
                        if(err) throw err;
                        phien.forEach(e => {
                            array.push({
                                server : e.server,
                                ketqua : e.ketqua,
                            });
                        });
                        res(array)
                    })
                }
            ),
            new Promise(
                (res,fai) => 
                {
                    mysqli.query("SELECT * FROM cuoc ORDER by `id` DESC LIMIT 20",function(err,cuoc){
                        if(err) throw err;
                        let array = [];
                        Promise.all(cuoc.map(function(obj){
                            return new Promise(
                                (res2, fai2) =>
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+obj.uid+"' LIMIT 1",function(err2,users){
                                    if(err2) throw err2;
                                    if(users.length >=1)
                                    {
                                        users = info(users[0]);
                                        array.push({
                                            id : obj.id,
                                            uid : users.id,
                                            name : users.name,
                                            phien : obj.phien,
                                            server : obj.server,
                                            game : obj.game,
                                            vangcuoc : obj.vangcuoc,
                                            vangnhan : obj.vangnhan,
                                            cuoc : obj.cuoc,
                                            trangthai : obj.trangthai,
                                            thoigian : checkstring.thoigian(obj.thoigian),

                                        });
                                    }
                                    res2(array)
                                })
                            )
                        })).then(e => {
                            res(e)
                        })
                    })
                }
            )
        ]).then(f => {
            let crefphien9999 = f[0];
            let call = f[1];
            
            let oh = [];
            let ad = [];
            io.all({
                server : call.server,
                ketqua : f[3],
                logcuoc : f[4]
            });
            io.admin({
                csmm : call.admin
            })
            
            if(crefphien9999.length <=0)
            {
                mysqli.query("INSERT INTO `phien` SET `time` = '120', `thoigian` = '"+checkstring.time().thoigian+"', `status` = '0', `server` = '999'",function(err1,creft){
                    console.log('Phiên 24/24');
                })
            }
            else 
            {
                crefphien9999 = crefphien9999[0];
                if(crefphien9999.ketqua == '')
                {
                    mysqli.query("UPDATE `phien` SET `ketqua` = '"+checkstring.rand(1,99)+"' WHERE `id` = '"+crefphien9999.id+"'");
                }
            }
        });

        /* Phiên creft */
        mysqli.query("SELECT * FROM `phien` WHERE `status` = '0' AND `time` <= 0 AND `ketqua` !=''",function(err,phien){
            if(err) throw err;
            phien.forEach(obj => {
                mysqli.query("UPDATE `phien` SET `status` = '1' WHERE `id` = '"+obj.id+"'",function(err0,Updatephien){
                    if(err0)  throw err0;
                    mysqli.query("SELECT  * FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `trangthai` = '0' ",function(err2,cuoc){
                        if(err2) throw cuoc;
                        cuoc.forEach(objcuoc => {
                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+objcuoc.uid+"'",function(err3,users) {
                                if(err3) throw err3;
                                if (users.length >= 1) {
                                    users = users[0];
                                    let ketqua = obj.ketqua >> 0;
                                    let win = 0;
                                    let game = '';
                                    let notice = '';
                                    if (objcuoc.game == "taixiu" && objcuoc.cuoc == "tai" && ketqua >= 50) {
                                        win = objcuoc.vangcuoc * 1.8;
                                        game = "Tài xỉu - tài";
                                        notice = 'Tài xỉu'
                                    }
                                    else
                                    if (objcuoc.game == "taixiu" && objcuoc.cuoc == "xiu" && ketqua <= 49) {
                                        win = objcuoc.vangcuoc * 1.8;
                                        game = "Tài xỉu - Xỉu";
                                        notice = 'taixiu'
                                    }
                                    else
                                    if (objcuoc.game == "chanle" && objcuoc.cuoc == "chan" && ketqua % 2 == 0) {
                                        win = objcuoc.vangcuoc * 1.8;
                                        game = "Chẵn lẻ - chẵn"
                                        notice = 'Chẵn lẻ'
                                    }
                                    else
                                    if (objcuoc.game == "chanle" && objcuoc.cuoc == "le" && ketqua % 2 != 0) {
                                        win = objcuoc.vangcuoc * 1.8;
                                        game = "Chẵn lẻ - Lẻ"
                                        notice = 'chẵn lẻ'
                                    }
                                    if (win >= 1) {
                                        mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = '" + win + "' WHERE `id` = '" + objcuoc.id + "'", function (err4, update) {
                                            if (err4) throw err4;
                                            sodu(users.id, users.vang, win, game, 'cuoc', objcuoc.id);
                                            users.vang += +win;
                                            io.all({
                                                UPDATE:
                                                {
                                                    id: users.id,
                                                    name: users.name,
                                                    game: notice,
                                                    vang: Math.round(win),
    
                                                }
                                            });
                                        })
                                    }
                                    else 
                                    {
                                        mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = '0' WHERE `id` = '"+objcuoc.id+"'",function(err4,update){
                                            
                                        })
                                    }
    
                                }
                            });
                        });
                    })
                })
                
            });
            if(timeJohn == 60)
            {
                timeJohn = 0;
                let timecheck = +checkstring.time().thoigian - 300000;
                mysqli.query("SELECT * FROM `cuoc` WHERE `thoigian` <= '"+timecheck+"' AND `trangthai` = '0'",function(err,showcuoc)
                {
                    
                    if(err) throw err;
                    showcuoc.forEach(objcuoc => {
                        mysqli.query("SELECT  * FROM `phien` WHERE `id` = '"+objcuoc.phien+"'",function(err2,showphien){
                            if(err2) throw err2;
                            let loiphien = 0;
                            if(showphien.length <=0) loiphien = 1;
                            if(showphien.length >=1)
                            {
                                let timestep = +showphien[0].thoigian + 300000;
                                if(timestep < checkstring.time().thoigian)
                                {
                                    loiphien = 1;
                                }
                            }
                            /* Phiên lỗi */
                            if(loiphien == 1)
                            {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+objcuoc.uid+"'",function(err3,users) {
                                    if(err3) throw err3;
                                    if(users.length >=1)
                                    {
                                        users = users[0];
                                        mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = `vangcuoc` WHERE `id` = '" + objcuoc.id + "'", function (err4, update) {
                                            if (err4) throw err4;
                                            sodu(users.id, users.vang, objcuoc.vangcuoc, 'Hoàn trả cược do phiên không chạy', 'cuoc', objcuoc.id);
                                        })
                                    }
                                });
                            }
                            /* Error */
                            showphien.forEach(obj => {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+objcuoc.uid+"'",function(err3,users) {
                                    if(err3) throw err3;
                                    if (users.length >= 1) {
                                        users = users[0];
                                        let ketqua = obj.ketqua >> 0;
                                        let win = 0;
                                        let game = '';
                                        let notice = '';
                                        if (objcuoc.game == "taixiu" && objcuoc.cuoc == "tai" && ketqua >= 50) {
                                            win = objcuoc.vangcuoc * 1.8;
                                            game = "Tài xỉu - tài";
                                            notice = 'Tài xỉu'
                                        }
                                        else
                                        if (objcuoc.game == "taixiu" && objcuoc.cuoc == "xiu" && ketqua <= 49) {
                                            win = objcuoc.vangcuoc * 1.8;
                                            game = "Tài xỉu - Xỉu";
                                            notice = 'taixiu'
                                        }
                                        else
                                        if (objcuoc.game == "chanle" && objcuoc.cuoc == "chan" && ketqua % 2 == 0) {
                                            win = objcuoc.vangcuoc * 1.8;
                                            game = "Chẵn lẻ - chẵn"
                                            notice = 'Chẵn lẻ'
                                        }
                                        else
                                        if (objcuoc.game == "chanle" && objcuoc.cuoc == "le" && ketqua % 2 != 0) {
                                            win = objcuoc.vangcuoc * 1.8;
                                            game = "Chẵn lẻ - Lẻ"
                                            notice = 'chẵn lẻ'
                                        }
                                        if (win >= 1) {
                                            mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = '" + win + "' WHERE `id` = '" + objcuoc.id + "'", function (err4, update) {
                                                if (err4) throw err4;
                                                sodu(users.id, users.vang, win, game, 'cuoc', objcuoc.id);
                                                users.vang += +win;
                                                io.all({
                                                    UPDATE:
                                                    {
                                                        id: users.id,
                                                        name: users.name,
                                                        game: notice,
                                                        vang: Math.round(win),
        
                                                    }
                                                });
                                            })
                                        }
                                        else 
                                        {
                                            mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = '0' WHERE `id` = '"+objcuoc.id+"'",function(err4,update){

                                            })
                                        }
        
                                    }
                                });
                            });
                        })
                    });
                })
            }
            timeJohn++;
        })
        /* Users online */
        Promise.all([new Promise(  (call,res) => {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `time_online` >= '"+checkstring.time().thoigian+"'",function(err,users){
                let array = [];
                if(err) throw err;
                users.forEach(e => {
                    array.push({
                        id : e.id,
                        name : e.name,
                        username : e.username,
                        vang : checkstring.number_format(e.vang),
                    })
                });
                call(array)
            })
        })
    ]).then(e => {
            io.admin({
                online : 
                {
                    list : e[0],
                    online : global['TOTALONLINE'],
                    
                }
            })
        })
        /* Reset bot */
        if(resetbot  == 300)
        {
            mysqli.query("UPDATE `bot` SET `status` = '0'",function(err,show){

            })
        }
        resetbot++;
    },1000);
    return RunCMD;
}

module.exports = init;
