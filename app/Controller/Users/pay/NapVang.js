const e = require('cors');
let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let sodu    =     require('../../../Model/users/sodu');
let captcha = require('../captcha/code');

let request = require('request');
let thesieure = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            type : 'info',
            loading : -1
        });
    }
    else 
    {
        let account = new Promise(
            (res,fai) =>  {
                mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'username_thesieure' LIMIT 1",function(err,config)
                {
                    if(err) throw err;
                    res(config[0].data);
                });
            }
        );
        let atm = new Promise(
            (res, fai) =>
            {
                mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'nap_atm' LIMIT 1",function(err,config){
                    if(err) throw err;
                    res(config[0].data);
                });
            }
        )
        let xu = new Promise(
            (res,fai) => {
                mysqli.query("SELECT `xu`, server FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err,users){
                    if(err) throw err;
                    if(users.length >=1)
                    {
                        res(users[0]);
                    }
                })
            }
        )
        let list = new Promise (
            (res,fai) =>
            {
                mysqli.query("SELECT * FROM `thesieure` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT 25",function(err,thesieure){
                    if(err) throw err;
                    let array = [];
                    thesieure.forEach(c => {
                        array.push({
                            id : c.id,
                            magiaodich : c.magiaodich,
                            vnd : c.vnd,
                            vang : c.vang,
                            thoigian : checkstring.thoigian(c.thoigian),
                            date : c.date,
                        });
                    });
                    res(array);
                })
            }
        )
        Promise.all([account,atm,xu,list]).then(e => {
           
            mysqli.query("SELECT * FROM `server` WHERE `server` =  '"+e[2].server+"' LIMIT 1",function(er,co){
                co.forEach(vutru => {
                    client.dn({
                        thesieure :
                        {
                            account : e[0],
                            value : vutru.atm,
                            vang : e[2].xu,
                            list : e[3]
                        },
                        vang : e[2].xu,
                        loading : -1,
                    });
                });
            })
        })
    }
}

let napvang = function(client,data)
{
    console.log(client.id)
    if(+client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
        return false;
    }
    else 
    {
        let loadnpc = new Promise((resolve, reject) => {
            mysqli.query("SELECT * FROM `config` WHERE `GROUP` = 'nap'",function(err,config){
                if(err) throw err;
                let array = [];
                config.forEach(e => {
                    array.push({
                        name : e.name,
                        server : e.value,
                        value : e.data,
                    });
                });
                resolve(array);
            });
        });
        let loadnap = new Promise((res,fai) => {
            mysqli.query("SELECT * FROM `napvang` WHERE `uid` = '"+client.id+"' ORDER BY id DESC LIMIT 25",function(err,napvang){
                if(err) throw err;
                let array = [];
                napvang.forEach(e => {
                    array.push({
                        id : e.id,
                        name : e.name,
                        vang_game : e.vang_game,
                        vang : e.vang, 
                        server : e.server,
                        thoigian : checkstring.thoigian(e.thoigian),
                        date : e.date,
                    });
                });
                res(array);
            });
        });
        
        let loadxu = new Promise(
            (res,fai) => {
                mysqli.query("SELECT `xu`,server, admin FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err,users){
                    if(err) throw err;
                    if(users.length >=1)
                    {
                        res(users[0]);
                    }
                    else 
                    {
                        res({xu : 0, c : 0});
                    }
                })
            }
        )
        Promise.all([loadnpc,loadnap,loadxu]).then(value => {
            mysqli.query("SELECT * FROM `acc` WHERE `server` = '"+value[2].server+"' AND `type` = '0'",function(xcv,acc){
                let array = [];
                //let tilenap = value[0].find(element => element.server == value[2].server).value;
                let tilenap = 1;
                acc.forEach(e => {
                   array.push({
                       khu : e.khu, 
                       name : e.name,
                       value : tilenap,
                       server : value[2].server,
                   })

                });
                client.dn({
                    loading : -1,
                    napvang : 
                    {
                        npc : array,
                        list : value[1],
                        vang : value[2].vang,
                        server : value[2].server,
                        admin : value[2].admin,
                    },
                    vang : value[2].vang,
                });
                captcha(client,{})
            })
            
        }); 
    }
}

let action_vang = function (client,data) {
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1
        });
    }
    else 
    if(client.napvang ==1)
    {
        client.dn({
            msg : 'Đang có một yêu cầu trước đó.',
            type : 'info',
            loading : -1
        });
    }
    else 
    {
        client.napvang = 1;
        let vang = +data.vang;
        let name = checkstring.html(data.name);
        let server = data.server >> 0;
        let code = checkstring.html(data.code);
        if(vang <=0)
        {
            client.dn({
                msg : 'Số vàng không hợp lệ',
                type : 'info',
                loading : -1,
            });
            client.napvang  = 0;
        }
        else 
        if(client.code != code)
        {
            client.dn({
                msg : 'Mã captcha chưa chính xác.',
                type : 'info',
                loading : -1,
            });
            client.napvang  = 0;
            captcha(client,{})
        }
        else 
        {
            captcha(client,{})
            mysqli.query("SELECT * FROM `config` WHERE `value` = '"+server+"' AND `group` = 'nap'",function(err,config){
                if(err) throw err;
                if(config.length >=1)
                {
                    config = config[0];
                    mysqli.query("SELECT * FROM `napvang` WHERE `name` = '"+name+"' AND `server` = '"+server+"' AND `vang_game` = '"+vang+"' AND `status` = '1'",function(err1,napvang){
                        try 
                        {
                            if(napvang.length <=0)
                            {
                                client.dn({
                                    msg : 'Không tìm thấy đơn hàng này',
                                    type : 'info',
                                    loading : -1,
                                });
                                client.napvang  = 0;
                            }
                            else 
                            {
                                napvang = napvang[0];
                                mysqli.query("SELECT `id`, `xu`,`server`, admin FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err3, users){
                                    if(err3) throw err3;
                                    if(users.length <=0)
                                    {
                                        client.dn({
                                            msg : 'Tài khoản không tồn tại vui lòng đăng nhập lại',
                                            type : 'info',
                                            loading : -1,
                                        });
                                        client.napvang  = 0;
                                    }
                                    else 
                                    if(users[0].server == -1)
                                    {
                                        client.dn({
                                            msg : 'Bạn vui lòng chọn máy chủ ở trang chủ trước khi nạp vàng',
                                            type : 'info',
                                            loading : -1,
                                        })
                                        client.napvang = 0;
                                    }
                                    else 
                                    if(users[0].server !=server && users[0].admin <=0)
                                    {
                                        client.dn({
                                            msg : 'Bạn chỉ có thể nạp tiền từ máy chủ '+users[0].server+' ',
                                            type : 'info',
                                            loading : -1,
                                        });
                                        client.napvang  = 0;
                                    }
                                    else 
                                    {
                                        users = users[0];
                                        let vangnhan = Math.round(napvang.vang_game*(config.data));
                                        mysqli.query("UPDATE `napvang` SET `status` = '0', `uid` = '"+users.id+"', `vang` = '"+vangnhan+"' WHERE `id` = '"+napvang.id+"'",function(err4,updatevang){
                                            sodu(client.id,users.xu,vangnhan,'Nạp vàng tự động','napvang',napvang.id);
                                            client.dn({
                                                msg : 'Nạp vàng thành công. Bạn nhận được '+checkstring.number_format(vangnhan)+' xu.',
                                                type : 'success',
                                                loading : -1,
                                                vang : users.xu + vangnhan
                                            });
                                            client.napvang  = 0;
                                        });
                                    }
                                });
                            }
                        }
                        catch(e)
                        {
                            client.dn({
                                msg : 'Lỗi dữ liệu.',
                                type : 'danger',
                                loading : -1,
                            });
                            client.napvang  = 0;
                        }
                    });
                }
                else 
                {
                    client.dn({
                        msg  : 'Không tồn tại máy chủ này',
                        type : 'info',
                        loading : -1,
                    });
                    client.napvang  = 0;
                }
            });
        }
    }
}

let actiontsr = function (client,data) {
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    if(client.thesieure ==1)
    {
        client.dn({
            msg : 'Đang có yêu cầu trước đó',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        client.thesieure = 1;
        let magiaodich = checkstring.html(data.magiaodich);
        Promise.all([new Promise(
            (res,fai) => {
                mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'username_thesieure' LIMIT 1",function(err,config){
                    if(err) throw err;
                    res(config[0].data);
                });
            }
        ), new Promise(
            (res,fai) => 
            {
                mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'password_thesieure' LIMIT 1",function(err,config){
                    if(err) throw err;
                    res(config[0].data)
                })
            }
        ), new Promise(
            (res,fai) => 
            {
                mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'nap_atm' LIMIT 1",function(err,config){
                    if(err) throw err;
                    res(config[0].data)
                })
            }
        ),
        new Promise (
            (res,fai) => {
                mysqli.query("SELECT * FROM `thesieure` WHERE `magiaodich` = '"+magiaodich+"' LIMIT 1",function(err,thesieure){
                   try {
                    if(err) throw err;
                    res(thesieure);
                   }
                   catch(e)
                   {
                       res([])
                   }
                })
            }
        )
    ]).then(e => {
            let taikhoan = e[0];
            let matkhau = e[1];
            let tile = Math.fround(e[2]);
            let thesieure = e[3];
            if(thesieure.length >=1)
            {
                client.dn({
                    msg : 'Mã giao dịch đã được nạp bởi người chơi khác.',
                    type : 'info',
                    loading : -1,
                });
                client.thesieure = 0;
            }
            else 
            {
                request("http://toicontre.net/thesieure/index.php?code="+magiaodich+"&t="+taikhoan+"&p="+matkhau+"", function(res,f,body){
                    let vnd = body >> 0;
                    if(vnd <=0)
                    {
                        client.dn({
                            msg : 'Không thể tìm thấy mã giao dịch này. Vui lòng thử lại.',
                            type : 'info',
                            loading : -1
                        });
                        client.thesieure = 0;
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'", function(err2,users){
                            if(users.length >=1)
                            {
                                users = users[0];
                                mysqli.query("SELECT * FROM `server` WHERE `server` = '"+users.server+"' LIMIT 1",function(errd,vutru){
                                    if(vutru.length >=1)
                                    {
                                        vutru = vutru[0];
                                        let vang = Math.round(vnd*vutru.atm);
                                        if(vang <=0)
                                        {
                                            client.dn({
                                                msg : 'Số tiền không hợp lệ, xin vui lòng liên hệ admin.',
                                                type : 'info',
                                                loading : -1,
                                            });
                                            client.thesieure = 0;
                                        }
                                        else 
                                        {
                                            mysqli.query("INSERT INTO `thesieure` SET `magiaodich` = '"+magiaodich+"', `vnd` = '"+vnd+"', `vang` = '"+vang+"', `thoigian` = '"+checkstring.time().thoigian+"', `uid` = '"+client.id+"'",function(err,result){
                                                if(err) throw err;
                                                sodu(client.id,users.xu,vang,'Nạp thẻ siêu rẻ','thesieure',result.insertId);
                                                users.thongtin = JSON.parse(users.thongtin);
                                                users.thongtin.napxu = +users.thongtin.napxu > 0 ? +users.thongtin.napxu + vang : vang;
                                                mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"', `nap` = `nap` + '"+vnd+"' WHERE `id` = '"+client.id+"'");
                                                client.dn({
                                                    msg : 'Nạp thẻ siêu rẻ thành công. Bạn nhận được '+checkstring.number_format(vang)+' xu.',
                                                    type : 'success',
                                                    loading : -1,
                                                    vang : users.xu + vang,
                                                });
                                                client.thesieure = 0;
                                            });
                                        }
                                    }
                                })
                            }
                        });

                       
                    }


                });
            }

        });
    }
}

let momo = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        Promise.all([
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'username_momo' LIMIT 1",function(err,config){
                        if(err) throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data);
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => 
                {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'nap_atm'",function(err,config){
                        if(err) throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data);
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `momo` WHERE `uid` = '"+client.uid+"' ORDER BY `id` DESC LIMIT 25",function(err,momo){
                        let array = [];
                        momo.forEach(e => {
                            array.push({
                                id : e.id,
                                magiaodich  : e.magiaodich,
                                vnd  : e.vnd,
                                vang : e.vang,
                                thoigian : checkstring.thoigian(e.thoigian),
                                date : e.date,
                            })
                        });
                        res(array);
                    })
                }
            ),
            new Promise(
                (res,fai) => 
                {
                    mysqli.query("SELECT `xu`, `server` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
                        if(err) throw err;
                        if(users.length >=1)
                        {
                            res(users[0])
                        }
                    })
                }
            )
        ]).then(e => {
            let taikhoan  = e[0];
            let tile = Math.fround(e[1]);
            let list = e[2];
            let vang = e[3].xu;
            
            mysqli.query("SELECT * FROM `server` WHERE `server` = '"+e[3].server+"' LIMIT 1",function(fg,maychu){
                if(fg) throw fg;
                if(maychu.length <=0)
                {
                    client.dn({
                        msg :' Bạn chưa chọn máy chủ',
                        type : 'info',
                        loading : -1,
                    })
                }
                else 
                {
                    client.dn(
                        {
                            momo : 
                            {
                                taikhoan  : taikhoan,
                                tile : maychu[0].atm,
                                list : list,
                                vang : vang,
                            },
                            vang : vang,
                            loading : -1,
                        }
                    );
                }
            })
        })
    }
}

let sub_momo = function(client,data)
{
    let magiaodich = checkstring.html(data.magiaodich);
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    if(client.momo ==1)
    {
        client.dn({
            msg : 'Bạn đang có một yêu cầu khác, vui lòng chờ',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        client.momo = 1;
        Promise.all([
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT `id` FROM `momo` WHERE `magiaodich` = '"+magiaodich+"'",function(err,momo){
                        try 
                        {
                            if(err) throw err;
                            res(momo);
                        }
                        catch(e)
                        {
                            console.log(e)
                            res([])
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => 
                {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'username_momo'",function(err,config){
                        if(err)throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data);
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value`  ='password_momo'",function(err,config){
                        if(err) throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data)
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'nap_atm'",function(err,config){
                        if(err) throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data);
                        }
                    })
                }
            )
        ]).then(e => {
            let momo = e[0];
            let taikhoan = e[1];
            let matkhau = e[2];
            let tile = e[3] >> 0;
            if(momo.length >=1)
            {
                client.dn({
                    msg : 'mã giao dịch đã được nạp',
                    type :'info',
                    loading : -1,
                });
                client.momo = 0;
            }
            else 
            {
                request("http://toicontre.net/thesieure/v2/momo.php?act=getHistory&momo="+taikhoan+"&password="+matkhau+"&id="+magiaodich+"",function(err,err2,body){
                    let data = JSON.parse(body);
                    if(data.status != "success")
                    {
                        client.dn({
                            msg : 'Mã giao dịch không tồn tại, vui lòng thử lại sau ít phút.',
                            type  : 'info',
                            loading : -1,
                        });
                        client.momo = 0;
                    }
                    else 
                    {
                        let success = data.data;
                        console.log(success)
                        let tien = success.money;
                        tien = tien >> 0;
                        let vnd = Math.round(tien);
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err1,users0){
                            if(err1) throw err1;
                            users0.forEach(users => {
                                mysqli.query("SELECT * FROM `server` WHERE `server` = '"+users.server+"'",function(err2,conf){
                                    conf.forEach(maychu => {
                                        let vang = Math.round(maychu.atm * vnd);
                                        mysqli.query("INSERT INTO `momo` SET `magiaodich` = '"+magiaodich+"', `vnd` = '"+vnd+"', `vang` = '"+vang+"', `thoigian` = '"+checkstring.time().thoigian+"', `uid` = '"+client.id+"'",function(err,insert){
                                            sodu(client.id,users.xu,vang,'Nạp MoMo','momo',insert.insertId);
                                            users.thongtin = JSON.parse(users.thongtin);
                                            users.thongtin.napxu = +users.thongtin.napxu > 0 ? +users.thongtin.napxu + vang : vang;
                                            mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"', `nap` = `nap` + '"+vnd+"' WHERE `id` = '"+client.id+"'");
                                            client.dn({
                                                msg  : 'Nạp MoMo thành công. Bạn nhận được '+checkstring.number_format(vang)+' xu. Chúc bạn chơi game vui vẻ. ',
                                                type : 'success',
                                                loading : -1,
                                                vang : users.xu + vang
                                            });
                                            client.momo = 0;
                                        })
                                    });
                                })
                            });
                        })
                        
                    }
                })
            }
        })
    }
    
}

let thecao = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        Promise.all([
            new Promise(
                (res,fai) => 
                {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'thecao' AND `id` != '18' AND `id` != '19'",function(err,config){
                        if(err) throw err;
                        let array = [];
                        config.forEach(e => {
                            array.push({
                                id :e.id,
                                name : e.name,
                                value : e.value,
                                tile :e.data,
                            });
                        });
                        res(array);
                    })
                }
            ),
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `thecao` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT 25",function(err,thecao){
                        let array = [];
                        thecao.forEach(e => {
                            array.push({
                                id : e.id,
                                KeyID : e.code,
                                mathe : e.mathe,
                                seri : e.seri,
                                menhgia : e.menhgia,
                                status  : e.status,
                                nhamang : e.nhamang,
                                thoigian : checkstring.thoigian(e.thoigian),
                                date : e.date,
                                vang : e.vang,
                                status : e.stt,
                            });
                        });
                        res(array);
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT `xu`, `server` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
                        if(err) throw err;
                        if(users.length >=1)
                        {
                            res(users[0]);
                        }
                    })
                }
            )
        ]).then(e=> {
            let npc = e[0];
            let list = e[1];
            let vang = e[2].xu;
            
            mysqli.query("SELECT * FROM `server` WHERE `server` = '"+e[2].server+"'",function(c,letserver){
                if(c) throw c;
                if(letserver.length <=0)
                {
                    client.dn({
                        msg : 'Bạn phải chọn máy chủ trước chứ ?',
                        loading : -1,
                        type : 'info'
                    })
                }
                else 
                {
                    client.dn({
                        napcard : 
                        {
                            npc : npc,
                            list : list,
                            vang : vang,
                            tile : letserver[0].card,
                        },
                        vang : vang,
                        loading : -1,
                    });
                }
            })
        });
    }
}

let sub_card = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    if(client.thecao ==1)
    {
        client.dn({
            msg : 'Bạn đang có một yêu cầu nạp thẻ, xin vui lòng chờ',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        client.thecao = 1;
        let mathe = checkstring.html(data.mathe);
        let seri = checkstring.html(data.seri);
        let menhgia = checkstring.html(data.menhgia);
        let nhamang = checkstring.html(data.nhamang);
        menhgia = menhgia >> 0;
        if(mathe.length <=4 || seri.length <=5)
        {
            client.dn({
                msg : 'Mã thẻ hoặc seri không hợp lệ',
                type : 'info',
                loading : -1,
            });
            client.thecao = 0;
        }
        else 
        if(menhgia <=0)
        {
            client.dn({
                msg : 'Mệnh giá không hợp lệ',
                type : 'info',
                loading : -1,
            });
            client.thecao = 0;
        }
        else 
        {
            mysqli.query("SELECT * FROM `thecao` WHERE  `seri` = '"+seri+"' AND `mathe` = '"+mathe+"' AND `menhgia` = '"+menhgia+"' AND `nhamang` = '"+nhamang+"'",function(err,thecao){
                try 
                {
                    if(err) throw err;
                    if(thecao.length >=1)
                    {
                        client.dn({
                            msg : 'thẻ cào này đã tồn tại trong hệ thống. Xin chờ xử lý ít phút.',
                            type : 'info',
                            loading : -1,
                        });
                        client.thecao = 0;
                    }
                    else 
                    {
                        Promise.all([
                            new Promise(
                                (res,fai)=> 
                                {
                                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'KeyAPI'",function(err,config){
                                        if(err) throw err;
                                        if(config.length >=1)
                                        {
                                            res(config[0].data);
                                        }
                                    })
                                }
                            ),
                            new Promise(
                                (res,fai)=>
                                {
                                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'Urlweb'",function(err,config){
                                        if(err) throw err;
                                        if(config.length >=1)
                                        {
                                            res(config[0].data);
                                        }
                                    })
                                }
                            )
    
                        ]).then(d => {
                            let keyCode = d[0];
                            let Url = d[1];
                            let yeucau = checkstring.rand(10000000,99999999);
                            request("http://gachthe.vn/API/NapThe?APIKey="+keyCode+"&Network="+nhamang+"&CardCode="+mathe+"&CardSeri="+seri+"&CardValue="+menhgia+"&URLCallback="+Url+"&TrxID="+yeucau+"",function(res,res2,body){
                                let k = JSON.parse(body);
                                if(k.Code == 0)
                                {
                                    client.dn({
                                        msg : k.Message,
                                        type : 'info',
                                        loading : -1,
                                    });
                                    client.thecao = 0;
                                }
                                else 
                                {
                                    mysqli.query("INSERT INTO `thecao` SET `uid` = '"+client.id+"', `code` = '"+yeucau+"', `seri` = '"+seri+"', `mathe` = '"+mathe+"', `menhgia` = '"+menhgia+"', `stt` = '0', `nhamang` = '"+nhamang+"', `thoigian` = '"+checkstring.time().thoigian+"'",function(err,insert){
                                        if(err) throw err;
                                        client.dn({
                                            msg : 'Nạp thẻ thành công. Thẻ của bạn sẽ được xử lý tự động sớm nhất. Vui lòng chờ...',
                                            type : 'success',
                                            loading : -1,
                                        });
                                        client.thecao = 0;
                                    })
                                }
                            })
                        })
                    }
                }
                catch(e)
                {
                    console.log(e)
                    client.dn({
                        msg : 'Đã xẩy ra lỗi dữ liệu, vui lòng thử lại',
                        type : 'danger',
                        loading : -1,
                    });
                    client.thecao = 0;
                }
            })
        }
    }
}

let rutvang = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    
    {
        Promise.all([
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'rut'",function(err,config){
                        if(err) throw err;
                        let array = [];
                        config.forEach(e => {
                            array.push({
                                server : e.value,
                                value : e.data,
                                name : e.name,
                            });
                        });
                        res(array);
                    })
                }
            ),
            new Promise(
                (res,fai) =>
                mysqli.query("SELECT * FROM `rutvang` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT 25",function(err,rutvang){
                    let array = [];
                    rutvang.forEach(e => {
                        array.push({
                            id : e.id,
                            thoigian : checkstring.thoigian(e.thoigian),
                            name : e.name,
                            server : e.server, 
                            vangnhan : e.vangnhan,
                            vangrut : e.vangrut,
                            trangthai : e.trangthai,
                        });
                    });
                    res(array)
                })
            ),
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT `xu`, `server`, `admin` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
                        if(err) throw err;
                        if(users.length >=1)
                        {
                            res(users[0])
                        }
                    })
                }
            )
        ]).then(e => {
            let npc = e[0];
            let list = e[1];
            let vang = e[2].xu;

            mysqli.query("SELECT * FROM `acc` WHERE `server` = '"+e[2].server+"' AND `type` = '1'",function(xcv,acc){
                let array = [];
                //let tilenap = e[0].find(element => element.server == e[2].server).value;
                let tilenap = 1;
                acc.forEach(xx => {
                   array.push({
                       khu : xx.khu, 
                       name : xx.name,
                       value : tilenap,
                       server : e[2].server,
                   })

                });
                client.dn({
                    rutvang : 
                    {
                        npc : array,
                        list : list,
                        vang : vang,
                        server : e[2].server,
                        admin : e[2].admin,
                    },
                    vang : vang,
                    loading : -1,
                });
                captcha(client,{})
            })

            
        });
    }
}

let action_rutvang = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    if(client.rutvang ==1)
    {
        client.dn({
            msg : 'Bạn đang có một yêu cầu rút vàng trước đó, vui lòng chờ hệ thống xử lý',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        client.rutvang = 1;
        let vang = +data.vang;
        let server = data.server >> 0;
        let name = checkstring.html(data.name);
        let code = checkstring.html(data.code);

        if(vang <100000000)
        {
            client.dn({
                msg : 'Số vàng rút tối thiểu 100.000.000 xu.',
                type : 'info',
                loading : -1,
            });
            client.rutvang = 0;
        }
        else
        if(client.code != code)
        {
            client.dn({
                msg : 'Mã xác nhận không chính xác.',
                type : 'info',
                loading : -1,
            });
            client.rutvang = 0;
            captcha(client,{})
        }
        else 
        {
            captcha(client,{})
            mysqli.query("SELECT * FROM `config` WHERE `value` = '"+server+"' AND `group` = 'rut' LIMIT 1",function(err,config){
                if(err) throw err;
                if(config.length >=1)
                {
                    config = config[0];
                    let tile = Math.fround(config.data);
                    let vangrut = Math.round(tile * vang);
                    if(vangrut > 500000000)
                    {
                        client.dn({
                            msg : 'Số vàng rút tối đa 500.000.000 vàng, vui lòng thử lại',
                            type : 'info',
                            loading : -1,
                        });
                        client.rutvang = 0;
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err2,users){
                            if(err2) throw err2;
                            if(users.length <=0)
                            {
                                client.dn({
                                    msg : 'Tài khoản không tồn tại, vui lòng đăng nhập lại',
                                    type : 'info',
                                    loading : -1,
                                });
                                client.rutvang = 0;
                            }
                            else
                            {
                                users = users[0];
                                users.thongtin = JSON.parse(users.thongtin);
                                users.thongtin.choigame = +users.thongtin.choigame > 0 ? +users.thongtin.choigame : 0;
                                if(users.server != server && users.admin <=0)
                                {
                                    client.dn({
                                        msg : 'Bạn chỉ có thể rút vàng về server '+users.server+'.',
                                        type : 'info',
                                        loading : -1,
                                    });
                                    client.rutvang = 0;
                                }
                                else
                                if(users.xu < vang)
                                {
                                    client.dn({
                                        msg : 'Tài khoản bạn chỉ có '+checkstring.number_format(users.xu)+' xu. ',
                                        type : 'info',
                                        loading : -1,
                                    });
                                    client.rutvang = 0;
                                }
                                else 
                                if(+users.thongtin.choigame < 5)
                                {
                                    client.dn({
                                        msg : 'Bạn phải chơi đủ 5 ván tài xỉu hoặc CLTX mới có thể rút. Bạn đã chơi '+users.thongtin.choigame+' ván.  ',
                                        type : 'info',
                                        loading : -1,
                                    });
                                    client.rutvang = 0;
                                }
                                else 
                                {
                                    mysqli.query("INSERT INTO `rutvang` SET `uid` = '"+users.id+"', `name` = '"+name+"', `server` = '"+server+"', `vangnhan` = '"+vangrut+"', `vangrut` = '"+vang+"', `thoigian` = '"+checkstring.time().thoigian+"', `trangthai` = '1'",function(err3,newi){
                                        try 
                                        {
                                            if(err3) throw err3;
                                            sodu(users.id,users.xu,-vang,'Rút vàng tự động','rutvang',newi.insertId);
                                            client.dn({
                                                msg : 'Tạo lệnh rút thành công ! Bạn hãy vào game giao dịch',
                                                type : 'success',
                                                loading : -1,
                                                vang : users.xu - vang,
                                                f5 : 'rutvang'
                                            });
                                            client.rutvang = 0;
                                        }
                                        catch(e)
                                        {
                                            client.dn({
                                                msg : 'Lỗi dữ liệu',
                                                type : 'danger',
                                                loading : -1,
                                                
                                            });
                                            client.rutvang = 0;
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
                else 
                {
                    client.dn({
                        msg : 'Có lỗi xẩy ra.',
                        type : 'info',
                        loading : -1,
                    });
                }
            })
        }
    }
}

let indexnap = function(client)
{
    mysqli.query("SELECT * FROM `nguoichoi` WHERE `nap` >= 1 ORDER BY `nguoichoi`.`nap` DESC LIMIT 10",function(err,data){
        let t = [];
         data.forEach(e => {
            t.push({
                id : e.id,
                name : e.name,
                xu : e.nap
            })
        });
        client.dn({
            loading : -1,
            nap : {
                list : t,
            }
        })
    })
}

let napthoi = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập',
            type : 'danger'
        })
    }
    else 
     
    {
        Promise.all([
            new Promise((res,fai) => {
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(cv,users){
                    if(users.length >=1)
                    {
                        res(users[0])
                    }
                    else 
                    {
                        res({})
                    }
                })
            }),
            new Promise((res,fai) => {
                res([])
            }),
            new Promise((res,fai) => {
                mysqli.query("SELECT * FROM `napthoi` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT 10",function(xcv,napne){
                    let array = [];
                    napne.forEach(e => {
                        array.push({
                            id : e.id,
                            name : e.name,
                            server : e.server,
                            thoigian : checkstring.thoigian(e.thoigian),
                            thoivang : e.thoivang,
                            trangthai : e.trangthai,
                        })
                    });
                    res(array)
                })
            })

        ]).then(e => {
            let users = e[0];
            let npc = e[1];
            let mynap = e[2];
            mysqli.query("SELECT * FROM `npcthoi` WHERE `server`  = '"+users.server+"' ORDER BY `thoigian` DESC LIMIT 1",function(xv,thoivang){
                let array = [];
                thoivang.forEach(e => {
                    array.push({
                        id : e.id,
                        server : e.server,
                        map : e.map,
                        khu : e.khu,
                        name : e.name, 
                        thoivang : e.thoivang,
                    })
                });
                client.dn({
                    loading : -1,
                    napthoi : {
                        admin : users.admin,
                        npc : array,
                        data : mynap,
                    }
                })
            })
        })
    }
}

let action_napthoi = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập',
            type : 'danger'
        })
    }
    else 
    if(client.napthoi ==1)
    {
        client.dn({
            loading : -1,
            msg : 'Bạn đang có một yêu cầu nạp trước đó.',
            type : 'danger',
        })
    }
    else 
    {
        client.napthoi = 1;
        let name = checkstring.html(data.name);
        let server = checkstring.html(data.server);
        let thoi = data.thoi >> 0;
        mysqli.query("SELECT * FROM `napthoi` WHERE `uid` = '"+client.id+"' AND `trangthai` = '0'",function(err,deltecore){
            if(deltecore.length >=1)
            {
                mysqli.query("DELETE FROM `napthoi` WHERE `uid` = '"+client.id+"' AND `trangthai` = '0'  ",function(vcv,delted){

                })
            }
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(vxcv,users){
                if(users.length >=1)
                {
                    users = users[0];
                    if(thoi <= 0 || thoi > 99)
                    {
                        client.dn({
                            msg : 'Thỏi không hợp lệ',
                            type : 'info',
                            loading : -1,
                        })
                        client.napthoi = 0;
                    }
                    else 
                    if(users.admin <= -1)
                    {
                        client.dn({
                            msg : 'Tính năng đang thử nghiệm, chỉ dành cho admin',
                            type : 'info',
                            loading : -1,
                        })
                        client.napthoi = 0;
                    }
                    else 
                    if(users.server != server && users.admin <=0)
                    {
                        client.dn({
                            msg : 'Bạn chỉ có thể nạp thỏi từ vũ trụ '+users.server+'',
                            type : 'info',
                            loading : -1,
                        })
                        client.napthoi = 0;
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `npcthoi` WHERE `server` = '"+users.server+"' ORDER BY `thoigian` DESC LIMIT 1",function(xcxv,npcthoi){
                            if(npcthoi.length <=0)
                            {
                                client.dn({
                                    loading : -1,
                                    msg : 'Bạn vui lòng chờ hệ thống kết nối tới bot',
                                    type : 'info',

                                })
                                client.napthoi = 0;
                            }
                            else 
                            {
                                npcthoi = npcthoi[0];
                                let thoinhan = 99 - npcthoi.thoivang;
                                if(thoinhan <  thoi)
                                {
                                    client.dn({ 
                                        loading  : -1,
                                        msg : 'BOT chỉ có thể nhận thêm '+thoinhan+' thỏi vàng. ',
                                        type : 'info'
                                    })
                                }
                                else 
                                {
                                    mysqli.query("INSERT INTO `napthoi` SET `server` = '"+server+"',`name` = '"+name+"', `uid` = '"+client.id+"', `thoigian` = '"+checkstring.time().thoigian+"', `thoivang` = '"+thoi+"', `trangthai` = '0'",function(xcvbc,inser){
                                        try 
                                        {
                                            client.dn({
                                                msg  : 'Tạo dữ liệu thành công, vui lòng vào game để giao dịch',
                                                loading : -1,
                                                type : 'success',
                                            })
                                            napthoi(client,{})
                                            client.napthoi = 0;
                                        }
                                        catch(e)
                                        {
                                            client.dn({
                                                msg : 'Tạo dữ liệu thất bại',
                                                type : 'danger',
                                                loading : -1,
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        })
    }
}

module.exports = function(client,data)
{
    if(!!data.action_napthoi)
    {
        action_napthoi(client,data.action_napthoi)
    }
    if(!!data.napthoi)
    {
        napthoi(client,data.napthoi)
    }
    if(!!data.index)
    {
        indexnap(client);
    }
    if(!!data.action_rutvang)
    {
        action_rutvang(client,data.action_rutvang);
    }
    if(!!data.rutvang)
    {
        rutvang(client)
    }
    if(!!data.card)
    {
        thecao(client)
    }
    if(!!data.thesieure)
    {
        thesieure(client)
    }
    if(!!data.napvang)
    {
        napvang(client,data.napvang);
    }
    if(!!data.actionvang)
    {
        action_vang(client,data.actionvang);
    }
    if(!!data.action_thesieure)
    {
        actiontsr(client,data.action_thesieure);
    }
    if(!!data.momo)
    {
        momo(client);
    }
    if(!!data.action_momo)
    {
        sub_momo(client,data.action_momo);
    }
    if(!!data.action_card)
    {
        sub_card(client,data.action_card);
    }
}