let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let sodu    =     require('../../../Model/users/sodu');
let game    =     require('../../../Model/TaiXiu/Game');
const e = require('cors');
let cuoc = game.cuoc;

let phientruoc = function(client)
{
    mysqli.query("SELECT * FROM `phien_taixiu` ORDER BY `phien` DESC LIMIT 13",function(err,phien){
        let array = [];
        phien.forEach(e => {
            array.push({
                id : e.phien,
                x1 : e.x1,
                x2 : e.x2,
                x3 : e.x3,
            })
        });
        client.dn({
            phientruoc : {
                list : array,
            }
        })
        mycuoc(client);
    })
}

let cuoctx = function(client,data)
{
    if(client.id  <=0)
    {
        client.dn({
            loading : -1,
            msgtx : 'Bạn chưa đăng nhập',
            type : 'info',
        })
    }
    else 
    if(client.taixiu == 1)
    {
        client.dn({
            loading : -1,
            msgtx : 'Bạn đang có yêu cầu cược trước đó, vui lòng chờ',
            type : 'info'
        })
    }
    else 
    if(game.b <=5)
    {
        client.dn({
            loading : -1,
            msgtx : 'Đã hết thời gian cho phép cược, vui lòng chờ phiên sau,'
        })
    }
    else {
        client.taixiu = 1;
        let type = checkstring.html(data.cuoc);
        let xu = checkstring.int(data.xu);
        if(xu <=0)
        {
            client.dn({
                loading : -1,
                msgtx : 'Tiền cược không hợp lệ',
                type : 'info'
            })
            client.taixiu = 0;
        }
		else 
		if(xu >10000000000 || xu <2000000)
        {
            client.dn({
                loading : -1,
                msgtx : 'Vàng cược từ 2tr - 10 tỉ',
                type : 'info'
            })
            client.taixiu = 0;
        }
        else 
        {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
                if(users.length >=1)
                {
                    users = users[0];
                    if(users.xu < xu)
                    {
                        client.dn({
                            msgtx : 'Tài khoản không có đủ xu',
                            loading : -1,
                        })
                        client.taixiu = 0;
                    }
                    else {
                        mysqli.query("SELECT * FROM `cuoc_taixiu` WHERE `phien` = '" + game.id + "' AND `uid` = '" + client.id + "' AND `trangthai` = '0'", function (err2, phien) {
                            if (phien.length >= 1) {
                                phien = phien[0];
                                if (phien.cuachon != type) {
                                    client.dn({ loading: -1, msgtx: 'Bạn chỉ có thể cược 1 cửa thôi' });
                                    client.taixiu = 0;
                                }
                                else {
                                    mysqli.query("UPDATE `cuoc_taixiu` SET `xucuoc` = `xucuoc` + '" + xu + "' WHERE `id` = '" + phien.id + "'", function (gfgh, udaphien) {
                                        if (type == 'tai') game.t += xu;
                                        else game.x += xu;
                                        cuoc.push({ id: client.id, xu: xu, type: type, hoantra: 0, game: 'taixiu', code: phien.id, name: users.name });
                                        sodu(users.id, users.xu, -xu, 'Cược tài xỉu #' + game.id + '', 'cuoc_taixiu', phien.id);
                                        client.dn({ loading: -1, msgtx: 'Cược thành công', vang: users.xu - xu });
                                        client.taixiu = 0;
                                        mycuoc(client);
                                    })
                                }
                            }
                            else {
                                /* chưa cược */
                                mysqli.query("INSERT INTO `cuoc_taixiu` SET `phien` = '" + game.id + "', `uid` = '" + client.id + "', `cuachon` = '" + type + "', `xucuoc` = '" + xu + "', `thoigian` = '" + checkstring.time().thoigian + "'", function (err3, newid) {
                                    try 
                                    {
                                        if (err3) throw err3;
                                        sodu(users.id, users.xu, -xu, 'Cược tài xỉu #' + game.id + '', 'cuoc_taixiu', newid.insertId);
                                        if (type == 'tai') game.at += 1;
                                        else game.ax += 1;
                                        if (type == 'tai') game.t += xu;
                                        else game.x += xu;
                                        cuoc.push({ id: client.id, xu: xu, type: type, hoantra: 0, game: 'taixiu', code: newid.insertId, name: users.name });
                                        client.dn({ loading: -1, msgtx: 'Cược thành công', vang: users.xu - xu });
                                        client.taixiu = 0;
                                        mycuoc(client);
                                    }
                                    catch(e)
                                    {
                                        client.dn({ loading: -1, msgtx: 'Có lỗi xẩy ra.' });
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }
}
let tiencuoc = function(id,value)
{
	var dn = 0;
	for(var i =0; i<cuoc.length;i++)
	{
		if(cuoc[i].type == value && cuoc[i].id == id)
		{
			dn+= cuoc[i].xu;
		}
	}
	return dn;
}

let mycuoc = function(client)
{
    client.dn({
        nguoichoi_taixiu : {
            cx: tiencuoc(client.id, 'xiu'),
            ct: tiencuoc(client.id, 'tai'),
        }
    })
}

let logcuoc = function(client,data)
{
    if(client.id <= 0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info'
        });
    }
    else
    {
        let trang = data.trang >> 0;
        let kmess = 10;
        let page = trang > 0 ? trang : 1;
        let start = data.trang ? page * kmess - kmess : 0;
        Promise.all([
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `cuoc_taixiu` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT "+start+","+kmess+"",function(err,sodu){
                        let array = [];
                        sodu.forEach(a => {
                            array.push({
                                id : a.id,
                                thoigian : checkstring.thoigian(+a.thoigian),
                                phien : a.phien,
                                cuachon : a.cuachon,
                                xucuoc : a.xucuoc,
                                xuhoantra : a.xuhoantra,
                                xunhan : a.xunhan,
                                trangthai : a.trangthai,
                            });
                        });
                        res(array)
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `cuoc_taixiu` WHERE `uid` = '"+client.id+"'",function(err,sodu){
                        res(sodu.length)
                    })
                }
            )
        ]).then(e => {
            let list = e[0];
            let tong = e[1];
            client.dn({
                cuoc_taixiu : 
                {
                    dulieu : list,
                    TOTAL : tong,
                    page : start,
                    kmess : kmess
                },
                loading : -1,
            });
        })
    }
}

let logphien = function(client,data)
{
    if(client.id <= 0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info'
        });
    }
    else
    {
        let trang = data.trang >> 0;
        let kmess = 10;
        let page = trang > 0 ? trang : 1;
        let start = data.trang ? page * kmess - kmess : 0;
        Promise.all([
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `phien_taixiu`  ORDER BY `id` DESC LIMIT "+start+","+kmess+"",function(err,sodu){
                        let array = [];
                        sodu.forEach(a => {
                            array.push({
                                id : a.id,
                                thoigian : checkstring.thoigian(+a.thoigian),
                                phien : a.phien,
                                x1 : a.x1,
                                x2 : a.x2,
                                x3 : a.x3,
                            });
                        });
                        res(array)
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `phien_taixiu`",function(err,sodu){
                        res(sodu.length)
                    })
                }
            )
        ]).then(e => {
            let list = e[0];
            let tong = e[1];
            client.dn({
                phien_taixiu : 
                {
                    dulieu : list,
                    TOTAL : tong,
                    page : start,
                    kmess : kmess
                },
                loading : -1,
            });
        })
    }
}

module.exports = function(client,data)
{
    if(!!data.logphien)
    {
        logphien(client,data.logphien)
    }
    if(!!data.logcuoc)
    {
        logcuoc(client,data.logcuoc)
    }
    if(!!data.cuoc)
    {
        cuoctx(client,data.cuoc);
    }
    if(!!data.phientruoc)
    {
        phientruoc(client)
    }
}