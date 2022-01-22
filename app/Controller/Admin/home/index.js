let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let request = require('request');
let info    =     require('../../../Model/users/info');

let home = function(client)
{
    if(client.admin <=0)
    {
        client.dn({
            home : 
            {

            }
        })
        return false;
    }
    Promise.all([
    new Promise( 
        (call,back) =>
        {
            mysqli.query("SELECT SUM(vang_game) as vang FROM `napvang` WHERE `date` = '"+checkstring.time().ngaythangnam+"'",function(er,sum){
                call(sum[0].vang);
            })
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT SUM(menhgia) as tien FROM `thecao` WHERE `stt` = '1' AND `date` = '"+checkstring.time().ngaythangnam+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT sum(vangnhan) as tien FROM `rutvang` WHERE trangthai = 0 and `date` =  '"+checkstring.time().ngaythangnam+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT sum(vnd) as tien FROM `momo` WHERE  `date` =  '"+checkstring.time().ngaythangnam+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT sum(vnd) as tien FROM `thesieure` WHERE  `date` =  '"+checkstring.time().ngaythangnam+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise( 
        (call,back) =>
        {
            mysqli.query("SELECT SUM(vang_game) as vang FROM `napvang` WHERE `date` >= '"+checkstring.time().start+"' AND `date` <= '"+checkstring.time().end+"'",function(er,sum){
                call(sum[0].vang);
            })
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT SUM(menhgia) as tien FROM `thecao` WHERE `stt` = '1' AND `date` >= '"+checkstring.time().start+"' AND `date` <= '"+checkstring.time().end+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT sum(vangnhan) as tien FROM `rutvang` WHERE trangthai = 0 AND `date` >= '"+checkstring.time().start+"' AND `date` <= '"+checkstring.time().end+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT sum(vnd) as tien FROM `momo` WHERE  `date` >= '"+checkstring.time().start+"' AND `date` <= '"+checkstring.time().end+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    ),
    new Promise(
        (call,back) => 
        {
            mysqli.query("SELECT sum(vnd) as tien FROM `thesieure` WHERE  `date` >= '"+checkstring.time().start+"' AND `date` <= '"+checkstring.time().end+"'",function(er,sum){
                call(sum[0].tien);
            });
        }
    )
]).then(e => {
        client.dn({
            home : 
            {
                vang_nap : e[0],
                card_nap : e[1],
                vang_rut : e[2],
                momo_nap : e[3],
                thesieure : e[4],
                vang_napthang : e[5],
                card_napthang : e[6],
                vang_rutthang : e[7],
                momo_napthang : e[8],
                thesieurethang : e[9],
            }
        })
        /* Reset BOT */
        mysqli.query("SELECT `uid` FROM `bot`",function(dsfsdf,bott){
            bott.forEach(bot => {
                mysqli.query("UPDATE `nguoichoi` SET `xu` = '0' WHERE `id` = '"+bot.uid+"'",function(dgfdgf,updaebot){
                    
                })
            });
        })
    })
}

let nguoichoi = function(client,data = {})
{
    if(client.admin <=0)
    {

    }
    else 
    {
        if(!data.text) data.text = '';
        let text = checkstring.html(data.text);
        Promise.all([new Promise((res,fai) => {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` LIKE '%"+text+"%' or `name` LIKE '%"+text+"%' or `taikhoan` LIKE '%"+text+"%' ORDER by `id` DESC LIMIT 50",function(err,users){
                let array = [];
                users.forEach(e => {
                    e = info(e)
                    array.push({
                        taixiu_thang : checkstring.number_format(e.thongtin.taixiu_thang),
                        taixiu_thua : checkstring.number_format(e.thongtin.taixiu_thua),
                        cltx_thang : checkstring.number_format(e.thongtin.cltx_thang),
                        cltx_thua : checkstring.number_format(e.thongtin.cltx_thua),
                        id : e.id,
                        vang : checkstring.number_format(e.xu),
                        name : '<img style="width: 15%;" src="'+e.thongtin.avatar+'">'+e.name,
                        thamgia : 'null',
                        username : e.taikhoan,
                        online : e.thongtin.online,
                        action : (e.ban == 0 ? '<button class="btn btn-warning" onclick="ban('+e.id+')">Khoá lại</button>' :  '<button class="btn btn-success" onclick="ban('+e.id+')">Mở khoá</button>')+' <button class="btn btn-info" onclick="loading();dn.to({admin : {log : {lsgd : {uid : '+e.id+'}}}})">LSGD</button>',
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1, 
                nguoichoi :
                {
                    list : e[0],
                }
            })
        })
    }
}

let nguoichoi_ban = function(client)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([new Promise((res,fai) => {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `ban` = '1' ORDER by `id` DESC",function(err,users){
                let array = [];
                users.forEach(e => {
                    e = info(e);
                    array.push({
                        id : e.id,
                        vang : checkstring.number_format(e.xu),
                        vang2 : (e.xu),
                        name : '<img style="width: 15%;" src="'+e.thongtin.avatar+'">'+e.name,
                        thamgia : 'chủao',
                        username : e.taikhoan,
                        action : (e.ban == 0 ? '<button class="btn btn-warning" onclick="ban('+e.id+')">Khoá lại</button>' :  '<button class="btn btn-success" onclick="ban('+e.id+')">Mở khoá</button>')+' <button class="btn btn-info" onclick="loading();dn.to({admin : {log : {lsgd : {uid : '+e.id+'}}}})">LSGD</button>',
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                nguoichoi_ban :
                {
                    list : e[0],
                }
            })
        })
    }
}

let ban = function(client,data)
{
    if(client.admin <=0)
    {
        client.dn({
            loading : -1,
        })
    }
    else 
    {
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+id+"' LIMIT 1",function(err,users){
            if(err) throw err;
            if(users.length >=1)
            {
                users = users[0];
                let ban = 0;
                if(users.ban == 0) ban = 1;
                else ban = 0;
                mysqli.query("UPDATE `nguoichoi` SET `ban` = '"+ban+"' WHERE `id` = '"+id+"'",function(err,update)
                {
                    client.dn({
                        msg : (ban == 1 ? 'Khoá nick thành công' : 'Mở nick thành công'),
                        type : 'success',
                        loading : -1,
                    })
                    nguoichoi(client,{});
                })
            }
        })
    }
}

module.exports = function(client,data)
{
    if(!!data.ban)
    {
        ban(client,data.ban);
    }
    if(!!data.index)
    {
        home(client);
    }
    if(!!data.nguoichoi)
    {
        nguoichoi(client,data.nguoichoi)
    }
    if(!!data.nguoichoi_ban)
    {
        nguoichoi_ban(client)
    }
}