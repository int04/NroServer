let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info =  require('../../../Model/users/info');
let game = require('../../../Model/VXMM/game');
let cuoc = require('../../../Model/VXMM/cuoc');
let  sodu = require('../../../Model/users/sodu');
let home = function(client)
{
    Promise.all([
        new Promise(
            (res,fai) => {
                mysqli.query("SELECT * FROM `chat` ORDER BY `id` DESC LIMIT 25",function(err,chat){
                    if(err) throw err;
                    let array = [];
                    Promise.all(chat.map(function(obj){
                        return new Promise(
                            (res2,fai2) => 
                            {
                                
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id`  = '"+obj.uid+"'",function(err2,users){
                                    if(err2) throw err2;
                                    if(users.length >=1)
                                    {
                                        users = info(users[0]);
                                        array.push({
                                            id : obj.id,
                                            noidung : obj.noidung,
                                            name : users.name,
                                            avatar : users.thongtin.avatar,
                                        });
                                    }
                                    res2(array);
                                })
                            }
                        )
                    })).then(e => {
                        res(e)
                    });
                })
            }
        ),
        new Promise(
            (res,fal) => 
            {
                mysqli.query("SELECT `xu` FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err,users){
                    if(err) throw err;
                    if(users.length >=1)
                    {
                        res(users[0].xu)
                    }
                    else 
                    {
                        res(-1);
                    }
                })
            }
        ),
        new Promise(
            (res,fai) => 
            {
                mysqli.query("SELECT `id` FROM `sms` WHERE `uid` = '"+client.id+"' AND `doc` = '1'",function(err,sms)
                {
                    res(sms.length)
                })
            }
        ),
        new Promise( (res,fai) => {
            mysqli.query("SELECT * FROM `phien_vongquay` ORDER BY `phien` DESC LIMIT 10",function(err,phien){
                let array = [];
                Promise.all(phien.map(function(obj){
                    return new Promise( (k, i) => {
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+obj.uid+"'",function(err2,cccc){
                            cccc.forEach(users => {
                                array.push({
                                    id : obj.id,
                                    phien : obj.phien,
                                    uid : users.id,
                                    name : users.name,
                                    win : obj.xu,
                                    john : obj.min_cuoc,
                                })
                            });
                            k(1);
                        })
                    })
                })).then(e => {
                    res(array)
                })
            })
        }),
        
        new Promise((res,fai) => {
            mysqli.query("SELECT * FROM `cuoc_vongquay` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT 15",function(err,hi) {
                if(err) throw err;
                let array = [];
                hi.forEach(e => {
                    array.push({
                        id : e.id,
                        uid : e.uid,
                        phien : e.phien,
                        thoigian : checkstring.thoigian(e.thoigian),
                        win : e.win,
                        xu : e.xu,
                    })
                });
                res(array);
            })
        })
    ]).then(e => {
         
        client.dn({
            loading : -1,
            VXMM : 
            {
                chat : e[0],
                vang : e[1],
                win : e[3],
                play : e[4],
            },
            vang : e[1],
            newsms : e[2],
        });
    })
}

let update = function(client)
{
    mysqli.query("SELECT * FROM `phien_vongquay` ORDER BY `id` DESC LIMIT 1",function(err,l){
        l.forEach(cuocvongquay => {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+cuocvongquay.uid+"'",function(err3,i){
                i.forEach(users => {
                    client.dn({
                        updateVXMM : {
                            i : cuocvongquay.id,
                            username : users.name,
                            win : cuocvongquay.xu,
                            john : cuocvongquay.min_cuoc,
                        },
                        loading : -1,
                    })
                });
            })
        });
    })
}

let subcuoc = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Đăng nhập đi',
            type : 'info',
            loading : -1,
        })
    }
    else 
    if(client.vxmm ==1)
    {
        client.dn({
            msg : 'Bạn đang có một yêu cầu cược trước đó, vui lòng chờ hệ thống xử lý',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        client.vxmm = 1;
        let vang =checkstring.int(data.xu);
        if(vang < 10000 | vang > 500000000)
        {
            client.dn({
                msg : 'Xu cược phải lớn hơn 10.000 xu và nhỏ hơn 500tr',
                type : 'info',
                loading : -1,
            })
            client.vxmm = 0;
        }
		
        else
        if(game.a <20)
        {
            client.dn({
                msg : 'Đã hết thời gian cho phép đặt cược',
                type : 'info',
                loading : -1,
            })
            client.vxmm = 0;
        }
        else 
        {
            mysqli.query("SELECT `xu`, `name` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,k){
                k.forEach(users => {
                    if(users.xu < vang)
                    {
                        client.dn({
                            msg : 'Tài khoản của bạn không có đủ tiền',
                            type : 'info',
                            loading : -1,
                        })
                        client.vxmm = 0;
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `cuoc_vongquay` WHERE `uid` = '"+client.id+"' AND `phien` = '"+game.id+"' AND `trangthai` = '0'", function(err,selected){
                            if(selected.length <=0)
                            {
                                mysqli.query("INSERT INTO `cuoc_vongquay` SET `uid` = '"+client.id+"', `phien` = '"+game.id+"', `thoigian` = '"+checkstring.time().thoigian+"', `xu` = '"+vang+"'",function(er,insert){
                                    sodu(client.id,users.xu,-vang,'Cược VXMM #'+game.id+'','cuoc_vongquay',insert.insertId);
                                    client.dn({
                                        loading :-1,
                                        vang : users.xu - vang,
                                    })
                                    client.vxmm = 0;
                                })
                            }
                            else 
                            {
                                mysqli.query("UPDATE `cuoc_vongquay` SET `xu` = `xu` + '"+vang+"' WHERE `id` = '"+selected[0].id+"'",function(err,updatsucc){
                                    sodu(client.id,users.xu,-vang,'Cược VXMM #'+game.id+'','cuoc_vongquay',selected[0].id);
                                    client.dn({
                                        loading :-1,
                                        vang : users.xu - vang,
                                    })
                                    client.vxmm = 0;
                                })
                            }
                            if (cuoc.find(acc => acc.id === client.id) === undefined) {
                                cuoc.push(
                                    {
                                        id: client.id,
                                        xu: +vang,
                                        name: users.name
                                    }
                                );
                            }
                            else {
                                cuoc.find(acc => acc.id === client.id).xu += +vang;
                            }
                            game.xu += +vang;
                        })
                    }
                });
            })
        }
    }
}

module.exports = function(client,data) {
   if(!!data.home)
   {
        home(client)
   }
   if(!!data.update)
   {
       update(client,data.update);
   }
   if(!!data.cuoc)
   {
       subcuoc(client,data.cuoc);
   }
}