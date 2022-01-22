let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');
const sodu = require('../../../Model/users/sodu');
let msg = function(text,type,client)
{
    client.dn({
        msg : text,
        type : type,
        loading: -1,
    })
}
let QuaVip = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            loading : -1,
            type : 'info'
        })
    }
    else 
    if(client.nhanquavip == 1)
    {
        client.dn({
            msg : 'Bạn đang có 1 yêu cầu nhận quà VIP, vui lòng chờ',
            loading : -1,
            type : 'info'
        })
    }
    else 
    {
        client.nhanquavip = 1;
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(err) throw err;
            if(users.length <=0)
            {
                msg('Không thể tìm thấy người chơi','info',client)
                client.nhanquavip = 0;
            }
            else 
            {
                users = users[0];
                if(users.mode == 1)
                {
                    msg('Tài khoản của bạn không thể dùng chức năng này.','info',client);
                    client.nhanquavip = 0;
                }
                else 
                {
                    mysqli.query("SELECT * FROM `ip` WHERE `ip` = '"+client.ip+"' ORDER BY `id` ASC LIMIT 1",function(er2,checkip){
                        if(er2) throw er2;
                        if(checkip.length >=1)
                        {
                            checkip = checkip[0];
                            if(checkip.uid != users.id)
                            {
                                mysqli.query("UPDATE `nguoichoi` SET `mode` = '1' WHERE `id` = '"+users.id+"'",function(err3,updateu){
                                    msg('Tài khoản của bạn không thể sử dụng chức năng này','info',client)
                                })
                                client.nhanquavip = 0;
                            }
                            else 
                            {
                                if(users.vip <=0)
                                {
                                    client.nhanquavip = 0;
                                    msg('Tài khoản của bạn là VIP mới có thể sử dụng chức năng này.','info',client);
                                }
                                else
                                if(users.xu >=1000)
                                {
                                    client.nhanquavip = 0;
                                    msg('Tài khoản của bạn phải nhỏ hơn 1.000 xu mới có thể sử dụng chức năng này','info',client);
                                }
                                else 
                                {
                                    users.thongtin = JSON.parse(users.thongtin);
                                    users.thongtin.thoigianquavip = +users.thongtin.thoigianquavip > 0 ? users.thongtin.thoigianquavip : 1;
                                    if(users.thongtin.thoigianquavip > Date.now())
                                    {
                                        msg('Bạn vui lòng chờ '+Math.round((users.thongtin.thoigianquavip-Date.now())/1000)+' giây nữa để nhận.','info',client);
                                        client.nhanquavip = 0;
                                    }
                                    else 
                                    {
                                        let xuvip = [0,10000,11000,12000,13000,14000,15000,16000,17000,18000];
                                        let time = [999,180,150,130,110,90,70,50,30,20,10];
                                        let xunhan = xuvip[users.vip];
                                        users.thongtin.thoigianquavip = Date.now() + time[users.vip]*60*1000;
                                        mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"' WHERE `id` = '"+users.id+"'",function(dfgdg,updatenguoichoi){
                                            sodu(users.id,users.xu,xunhan,'Nhận quà VIP');
                                            client.dn({
                                                vang : users.xu + xunhan,
                                                msg : 'Bạn nhận được '+checkstring.number_format(xunhan)+' xu. ',
                                                type : 'success',
                                                loading : -1,
                                            })
                                            client.nhanquavip = 0;
                                        })
                                        
                                    }

                                }
                            }
                        }
                        else 
                        {
                            msg('Không hợp lệ. Vui lòng đăng nhập lại để sử dụng chức năng này.','info',client)
                            client.nhanquavip = 0;
                        }
                    })
                }
            }
        })
    }
}

let vongquay = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            type : 'info',
            msg : 'Đăng nhập đi.'
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(err) throw err;
            if(users.length <=0)
            {
                client.dn({
                    loading : -1,
                    msg : 'Vui lòng đăng nhập lại'
                })
            }
            else 
            {
                users = users[0];
                users.thongtin = JSON.parse(users.thongtin);
                users.thongtin.timevqm = +users.thongtin.timevqm > 0 ? users.thongtin.timevqm : 0;
                if(users.thongtin.timevqm > Date.now())
                {
                    client.dn({
                        vongquayngay : {
                            time : 'Vui lòng chờ '+Math.round((users.thongtin.timevqm-Date.now())/1000)+' giây.',
                            loading : -1,
                        },
                        loading : -1,
                    })
                }
                else 
                {
                    client.dn({
                        vongquayngay : {
                            time : 'Bạn đang có 1 lần miễn phí',
                            loading : -1,
                        },
                        loading : -1,
                    })
                }
            }
        })
    }
}



let quayngay = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            loading : -1,
            type : 'info'
        })
    }
    else 
    if(client.everday == 1)
    {
        client.dn({
            msg : 'Bạn đang có 1 yêu cầu nhận quà VIP, vui lòng chờ',
            loading : -1,
            type : 'info'
        })
    }
    else 
    {
        client.everday = 1;
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(err) throw err;
            if(users.length <=0)
            {
                msg('Không thể tìm thấy người chơi','info',client)
                client.everday = 0;
            }
            else 
            {
                users = users[0];
                if(users.mode == 1)
                {
                    msg('Tài khoản của bạn không thể dùng chức năng này.','info',client);
                    client.everday = 0;
                }
                else 
                {
                    mysqli.query("SELECT * FROM `ip` WHERE `ip` = '"+client.ip+"' ORDER BY `id` ASC LIMIT 1",function(er2,checkip){
                        if(er2) throw er2;
                        if(checkip.length >=1)
                        {
                            checkip = checkip[0];
                            if(checkip.uid != users.id)
                            {
                                mysqli.query("UPDATE `nguoichoi` SET `mode` = '1' WHERE `id` = '"+users.id+"'",function(err3,updateu){
                                    msg('Tài khoản của bạn không thể sử dụng chức năng này','info',client)
                                })
                                client.everday = 0;
                            }
                            else 
                            {
                                if(users.vip <=0)
                                {
                                    client.everday = 0;
                                    msg('Tài khoản của bạn là VIP mới có thể sử dụng chức năng này.','info',client);
                                }
                                
                                else 
                                {
                                    users.thongtin = JSON.parse(users.thongtin);
                                    users.thongtin.timevqm = +users.thongtin.timevqm > 0 ? users.thongtin.timevqm : 1;
                                    if(users.thongtin.timevqm > Date.now())
                                    {
                                        msg('Bạn vui lòng chờ '+Math.round((users.thongtin.timevqm-Date.now())/1000)+' giây nữa để quay.','info',client);
                                        client.everday = 0;
                                    }
                                    else 
                                    {
                                        let thuong=[0,500000,10000,20000,50000,0,100000,20000,5000];
                                        let tile = checkstring.rand(1, 500);
                                        let trung = 0;
                                        if (tile <= 0) trung = 1;
                                        else if (tile >= 2 && tile <= 4) trung = 6;
                                        else if (tile >= 5 && tile <= 7) trung = 4;
                                        else if (tile >= 8 && tile <= 11) trung = 3;
                                        else if (tile >= 12 && tile <= 15) trung = 7;
                                        else if (tile >= 15 && tile <= 25) trung = 2;
                                        else if (tile >= 26 && tile <= 40) trung = 8;
                                        else trung  = 5;
                                        let text = '';
                                        let xu = 0;
                                        if(trung == 5)
                                        {
                                            xu = checkstring.rand(1000,20000);
                                            text = 'Bạn quay trúng ô NGẪU NHIÊN, bạn nhận được '+checkstring.number_format(xu)+' xu';
                                        }
                                        else 
                                        {
                                            xu = thuong[trung];
                                            text = 'Bạn quay trúng ô  '+checkstring.number_format(xu)+' xu';
                                        }
                                        users.thongtin.timevqm = Date.now() + 24*60*1000*60;
                                        mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"' WHERE `id` = '"+client.id+"'",function(fgdg,canhat){
                                            sodu(users.id,users.xu,xu,'Vòng quay hằng ngày');
                                            client.dn({
                                                vang : users.xu + xu,
                                                everday :{
                                                    data : {
                                                        key : trung,
                                                        info : text,
                                                    }
                                                }
                                            })
                                            client.everday = 0;
                                        })
                                    }

                                }
                            }
                        }
                        else 
                        {
                            msg('Không hợp lệ. Vui lòng đăng nhập lại để sử dụng chức năng này.','info',client)
                            client.everday = 0;
                        }
                    })
                }
            }
        })
    }
}

module.exports = function(client,data)
{
    if(!!data.quavip)
    {
        QuaVip(client,data.quavip);
    }
    if(!!data.vq)
    {
        vongquay(client,data.vongquay)
    }
    if(!!data.quayngay)
    {
        quayngay(client)
    }
}