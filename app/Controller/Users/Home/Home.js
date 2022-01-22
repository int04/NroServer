let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info =  require('../../../Model/users/info');
let home = function(client)
{
    Promise.all([
        new Promise(
            (res,fai) => {
                mysqli.query("SELECT * FROM `chat` ORDER BY `id` DESC LIMIT 6",function(err,chat){
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
                                            admin : (users.admin == 0 ? - 1  : users.admin),
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
                mysqli.query("SELECT `xu`, `sdt`, `taikhoan`, `server` FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err,users){
                    if(err) throw err;
                    if(users.length >=1)
                    {
                        res(users[0])
                    }
                    else 
                    {
                        res({sdt : 'd', xu : -1});
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
        new Promise((res,fai) => {
            mysqli.query("SELECT * FROM `banghoi` ORDER BY `xu` DESC LIMIT 7",function(err,banghoi){
                let thuong = [0,500000,250000,100000,50000,30000,20000,10000];
                let i = 0;
                let array = [];
                banghoi.forEach(bang => {
                    i++;
                    let xunhan = thuong[i] * 1000;
                    array.push({
                        top : i,
                        icon : bang.icon,
                        MIN : bang.MIN,
                        MAX : bang.MAX,
                        xu : bang.xu,
                        thuong : xunhan,
                        name : bang.name,
                    })
                });
                res(array)
                
            })
        })
    ]).then(e => {
         
        client.dn({
            loading : -1,
            home : 
            {
                chat : e[0],
                vang : e[1].xu,
				server : e[1].server,
                active : (e[1].sdt.length) > 3 ? 1 : 2,
                taikhoan : e[1].taikhoan,
                bang : e[3],
            },
            vang : e[1].xu,
            newsms : e[2],
        });
    })
}

module.exports = function(client) {
   home(client)
}