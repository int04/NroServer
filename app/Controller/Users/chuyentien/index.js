let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');
let sodu = require('../../../Model/users/sodu');

let index = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        let trang = data.trang >> 0;
        let kmess = 25;
        let page = trang > 0 ? trang : 1;
        let start = data.trang ? page * kmess - kmess : 0;
        Promise.all([
            new Promise (
                (Res,fai) => {
                    mysqli.query("SELECT * FROM `chuyentien` WHERE `from` = '"+client.id+"' or `to` = '"+client.id+"' ORDER BY `id` DESC LIMIT "+start+",25",function(err,chuyentien){
                        try 
                        {
                            let array = [];
                            if(chuyentien.length <=0)
                            {
                                Res(array)
                            } 
                            else {
                                Promise.all(chuyentien.map(function (obj) {
                                    return new Promise(
                                        (res1, fai1) => {
                                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '" + obj.to + "'", function (err2, to) {
                                                try 
                                                {
                                                    if (to.length >= 1) {
                                                        to = info(to[0]);
                                                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '" + obj.from + "'", function (err3, from) {
                                                            if (err3) throw err3;
                                                            if (from.length >= 1) {
                                                                from = info(from[0]);
                                                                array.push({
                                                                    id: obj.id,
                                                                    vang: obj.vang,
                                                                    thoigian: checkstring.thoigian(obj.thoigian),
                                                                    phi: obj.phi,
                                                                    from: from.name,
                                                                    to: to.name,
                                                                    noidung: obj.noidung
                                                                });
                                                            }
                                                            res1(array)
                                                        })
                                                    }
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                            })
                                        }
                                    )
                                })).then(e => {
                                    Res(e);
                                });
                            }
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            ),
            new Promise (
                (res, fai) => {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'chuyentien'",function(err,config){
                        if(err) throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data);
                        }
                        else 
                        {
                            res(1);
                        }
                    })
                }
            ),
            new Promise( 
                (res, fai) => 
                {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'min_chuyentien'",function(err,config){
                        if(err) throw err;
                        if(config.length >=1)
                        {
                            res(config[0].data)
                        }
                        else 
                        {
                            res(10000);
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => 
                {
                    mysqli.query("SELECT `xu` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
                        if(err) throw err;
                        if(users.length >=1)
                        {
                            res(users[0].xu)
                        }
                        else 
                        {
                            res(0)
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) =>
                mysqli.query("SELECT * FROM `chuyentien` WHERE `from` = '"+client.id+"' or `to` = '"+client.id+"'",function(err,chuyentien){
                    if(err)throw err;
                    res(chuyentien.length);
                })
            )
        ]).then(e => {
            let list = e[0];
            let phi = Math.fround(e[1]);
            let min = Math.round(e[2]);
            let vang  = e[3];
            let tong = e[4];
            client.dn({
                loading : -1,
                chuyentien : {
                    list : list,
                    phi : phi,
                    min : min,
                    vang : vang,
                    TOTAL : tong,
                    page : start,
                },
                vang : vang,
            })
        })
    }
}

let find = function(client,data)
{
    let uid = checkstring.html(data.text);
    if(client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            type  : 'info',
            loading : -1,
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+uid+"' or `name` = '"+uid+"' LIMIT 1",function(err,users){
            try 
            {
                if(users.length <=0)
                {
                    client.dn({
                        findchuyentien : 
                        {
                            text : 'Không tồn tại'
                        },
                        loading : -1,
                    })
                }
                else 
                {
                    users = info(users[0]);
                    client.dn({
                        findchuyentien : 
                        {
                            text : users.ten,
                        },
                        loading  : -1,
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}

let chuyentien = function(client,data,all)
{
    let name = checkstring.html(data.name);
    let noidung = checkstring.html(data.noidung);
    let type = +data.vang;
    let datax = [0,10000000,20000000,50000000,100000000,200000000,500000000];
    let vang = datax[type];
    vang = +vang ;
    if (client.chuyentien == 1) {
        client.dn({
            msg: "đang thực hiện yêu cầu, vui lòng chờ",
            loading: -1,
            type: 'info'
        })
    }
    else {
        client.chuyentien = 1;
        Promise.all([
            new Promise(
                (res, fai) =>
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'chuyentien'", function (err, config) {
                        if (err) throw err;
                        if (config.length >= 1) {
                            res(config[0].data)
                        }
                        else {
                            res(1);
                        }
                    })
            ),
            new Promise(
                (res, fai) => {
                    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'min_chuyentien'", function (err, config) {
                        if (err) throw err;
                        if (config.length >= 1) {
                            res(config[0].data)
                        }
                        else {
                            res(10000)
                        }
                    })
                }
            ),
            new Promise(
                (res, fai) => {
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `name` = '" + name + "' or `id` = '" + name + "' ", function (err, users) {
                        try 
                        {
                            if (users.length >= 1) {
                                res(users[0]);
                            }
                            else {
                                res(0)
                            }
                        }
                        catch(e)
                        {
                            res(0)
                        }
                    })
                }

            ),
            new Promise(
                (res, fai) => {
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '" + client.id + "'", function (err, users) {
                        if (err) throw err;
                        if (users.length >= 1) {
                            res(users[0]);
                        }
                        else {
                            res(0);
                        }
                    })
                }
            )
        ]).then(e => {
            let phi = Math.fround(e[0]);
            let min = Math.round(e[1]);
            let to = e[2];
            let from = e[3];
            if (vang < min) {
                client.dn({
                    msg: 'Số xu chuyển tối thiểu là ' + checkstring.number_format(min) + '',
                    type: 'info',
                    loading: -1,
                })
                client.chuyentien = 0;
            }
            else
                if (to == 0) {
                    client.dn({
                        msg: 'Người nhận không tồn tại',
                        type: 'info',
                        loading: -1,
                    })
                    client.chuyentien = 0;
                }
                else
                    if (from == 0) {
                        client.dn({
                            msg: 'Bạn chưa đăng nhập',
                            type: 'info',
                            loading: -1,
                        })
                        client.chuyentien = 0;
                    }
                    else
                        if (from.id == to.id) {
                            client.dn({
                                msg: 'Bạn không thể chuyển cho chính mình',
                                type: 'info',
                                loading: -1,
                            })
                            client.chuyentien = 0;
                        }
                        else {
                            let tong = Math.round(phi * vang);
                            if (from.xu < tong) {
                                client.dn({
                                    msg: 'Tài khoản của bạn chỉ có ' + checkstring.number_format(from.xu) + ' xu. Hãy nạp thêm để chuyển nhé. ',
                                    type: 'warn',
                                    loading: -1,
                                })
                                client.chuyentien = 0;
                            }
                            else 
                            if (from.sdt.length < 3) {
                                client.dn({
                                    msg: ' '+from.name+' chưa kích hoạt tài khoản nên không thể chuyển tiền. ',
                                    type: 'warn',
                                    loading: -1,
                                })
                                client.chuyentien = 0;
                            }
                            else 
                            if (to.sdt.length < 3) {
                                client.dn({
                                    msg: ' '+to.name+' chưa kích hoạt tài khoản nên không thể chuyển tiền. ',
                                    type: 'warn',
                                    loading: -1,
                                })
                                client.chuyentien = 0;
                            }
							else  
                            if (to.server != from.server && to.admin <=0 && from.admin <=0) {
                                client.dn({
                                    msg: ' 2 người chơi cùng máy chủ mới có thể chuyển tiền. ',
                                    type: 'warn',
                                    loading: -1,
                                })
                                client.chuyentien = 0;
                            }
                            else
                                if (noidung.length >= 500) {
                                    client.dn({
                                        msg: 'Nội dung tối đa 500 kí tự thôi',
                                        type: 'info',
                                        loading: -1,
                                    })
                                    client.chuyentien = 0;
                                }
                                else {
                                    mysqli.query("INSERT INTO `chuyentien` SET `from` = '" + from.id + "', `to` = '" + to.id + "', `vang` = '" + vang + "', `thoigian` = '" + checkstring.time().thoigian + "', `phi` = '" + phi + "', `noidung` = '" + noidung + "'", function (err, done) {
                                        try 
                                        {
                                            sodu(from.id, from.xu, -tong, 'Chuyển tiền cho người khác', 'chuyentien', done.insertId);
                                            sodu(to.id, to.xu, vang, 'Nhận tiền từ người chơi', 'chuyentien', done.insertId);
                                            client.dn({
                                                msg: 'Chuyển tiền thành công, người chơi đã nhận được tiền từ bạn',
                                                type: 'info',
                                                loading: -1,
                                                vang: from.xu - tong,
                                                newchuyen: true,
                                            })
                                            client.chuyentien = 0;
                                            index(client,{trang :0})
                                            all.all({
                                                msgchuyentien:
                                                {
                                                    id: to.id,
                                                    from: from.name,
                                                    vang: vang,
                                                    noidung: noidung,
                                                }
                                            })
                                        }
                                        catch(e)
                                        {
                                            console.log(e)
                                        }
                                    })
                                }
                        }

        })
    }
}

module.exports = function(client,data,socket)
{
    if(!!data.index)
    {
        index(client,data.index);
    }
    if(!!data.submit)
    {
        chuyentien(client,data.submit,socket);
    }
    if(!!data.find)
    {
        find(client,data.find);
    }
}
