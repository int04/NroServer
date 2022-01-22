let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');
const sodu = require('../../../Model/users/sodu');

let tao = function(client,data,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            type : 'info',
            msg : 'Tinh nang dang bao tri'
        })
    }
    else
    if(client.taolx == 1)
    {
        client.dn({
            loading : -1,
            type : 'info',
            msg : 'Đang có đơn tạo LX'
        })
    }
    else 
    {
        let xu = +data.xu >> 0;
        let soluong = data.soluong >> 0;
        if(xu <= 5000|| xu > 500000000)
        {
            client.dn({
                loading  : -1,
                type : 'info',
                msg : 'Xu lì xì từ 5.000 xu - 500.000.000 xu'
            })
        }
        else 
        if(soluong <=0 || soluong > 40)
        {
            client.dn({
                loading : -1,
                type : 'info',
                msg : 'Số lượng lì xì tối đa từ 0-40 người'
            })
        }
        else 
        if(xu/soluong <=100000)
        {
            client.dn({
                loading : -1,
                type : 'info',
                msg : 'Nghèo còn sĩ diện -.-, trên 100k/1 người đi.'
            })
        }
        else 
        {
            client.taolx = 1;
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
                if(err) throw err;
                if(users.length <=0)
                {
                    client.dn({
                        loading : -1,
                        type : 'info',
                        msg : 'Vui lòng đăng nhập lại'
                    })
                    client.taolx = 0;
                }
                else 
                {
                    users = users[0];
                    if(users.xu < xu)
                    {
                        client.dn({
                            msg : 'Tài khoản không đủ tiền',
                            type : 'info',
                            loading : -1,
                        })
                        client.taolx = 0;
                    }
                    else 
                    if(users.ban == 1)
                    {
                        client.dn({

                        })
                    }
                    else 
                    {
                        mysqli.query("INSERT INTO `lixi` SET `uid` = '"+client.id+"', `max` = '"+soluong+"', `xu` = '"+xu+"'",function(err2,taolx){
                            try 
                            {
                                if(err2) throw err2;
                                sodu(users.id,users.xu,-xu,'Share lì xì','lixi',taolx.insertId);
                                client.dn({
                                    vang : users.xu - xu,
                                    loading : -1,
                                })
                                let noidung = 'Đại gia '+users.name+' vừa tạo lì xì. <button class=\"btn btn-success\" onclick=\"nhanlx('+taolx.insertId+')\">Nhận 0/'+soluong+'</button> ';
                                mysqli.query("INSERT INTO `chat` SET `thoigian` = '" + Date.now() + "', `noidung` = '" + noidung + "', `uid` = '1'", function (er, g) {
                                    socket.all(
                                        {
                                            chatbox:
                                            {
                                                name: 'Lì xì',
                                                avatar: '/vendor/avatar/avatar.png',
                                                msg: noidung
                                            }
                                        },
                                    );
                                    client.taolx = 0;
                                });
                            }
                            catch(e)
                            {
                                console.log(e);
                                client.taolx = 0;
                                client.dn({
                                    msg : 'Có lỗi xẩy ra, vui lòng thử lại',
                                    loading : -1,
                                    type : "danger",
                                })
                            }
                        })
                    }
                }
            })
        }
    }
}

let nhan = function(client,data,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            type : 'info',
            msg : 'Bạn vui lòng đăng nhập để tiếp tục'
        })
    }
    else
    if(client.nhanlx == 1)
    {
        client.dn({
            loading : -1,
            type : 'info',
            msg : 'Đang có đơn nhận LX'
        })
    }
    else 
    {
        let id = data.id >> 0;
        client.nhanlx = 1;
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(users.length >=1)
            {
                users = users[0];
                mysqli.query("SELECT * FROM `lixi` WHERE `id` = '"+id+"'",function(err4,lixi){
                    try {
                        if(lixi.length >=1)
                        {
                            lixi = lixi[0];
                            if(lixi.min >= lixi.max )
                            {
                                client.dn({
                                    loading : -1,
                                    msg : 'Đã hết lượt nhận rồi',
                                    type : 'info'
                                })
                                client.nhanlx = 0;
                            }
                            else 
                            {
                                mysqli.query("SELECT * FROM  `lixi_data` WHERE `lixi` = '"+id+"' AND `uid` = '"+client.id+"' ",function(err3,danhan){
                                    if(err3) throw err3;
                                    if(danhan.length >=1)
                                    {
                                        client.dn({
                                            loading : -1,
                                            msg : 'Đã nhận rồi',
                                            type : 'info'
                                        })
                                        client.nhanlx = 0;
                                    }
                                    else 
                                    {
                                        let xu = Math.round(lixi.xu/lixi.max);
                                        let xunhan = xu - (xu/100*checkstring.rand(5,80));
                                        mysqli.query("UPDATE `lixi` SET `min` = `min` + '1' WHERE `id` = '"+id+"'",function(dfgdf,update1){
                                            mysqli.query("INSERT INTO `lixi_data` SET `lixi` = '"+id+"', `uid` = '"+client.id+"', `xu` = '"+xunhan+"', `thoigian` = '"+Date.now()+"'",function(err5,cref){
                                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+lixi.uid+"'",function(dfggdf,share){
                                                    if(share.length > 0)
                                                    {
                                                        share = share[0]
                                                    }
                                                    else 
                                                    {
                                                        share = {};
                                                    }
                                                    sodu(users.id,users.xu,xunhan,'Nhận lì xì','lixi_data',cref.insertId);
                                                    client.dn({
                                                        vang : users.xu + xunhan,
                                                        loading : -1,
                                                    })
                                                    users = info(users);
                                                    let noidung = 'Mở lì xì của đại gia <b>' + share.name + '</b> nhận được '+checkstring.number_format(xunhan)+' xu. <button class=\"btn btn-success\" onclick=\"nhanlx(' + lixi.id + ')\">Nhận '+(lixi.min+1)+'/' + lixi.max + '</button> ';
                                                    mysqli.query("INSERT INTO `chat` SET `thoigian` = '" + Date.now() + "', `noidung` = '" + noidung + "', `uid` = '1'", function (er, g) {
                                                        socket.all(
                                                            {
                                                                chatbox:
                                                                {
                                                                    name: users.name,
                                                                    avatar: users.thongtin.avatar,
                                                                    msg: noidung
                                                                }
                                                            },
                                                        );
                                                        client.nhanlx = 0;
                                                    });
                                                })
                                            })
                                        })
                                    }
                                });
                            }
                        }
                    }
                    catch(e)
                    {
                        console.log()
                    }
                });
            }
        });
    }
}



module.exports = function(client,data,socket)
{
    console.log(data)
    if(!!data.tao)
    {
        tao(client,data.tao,socket)
    }
    if(!!data.nhan)
    {
        nhan(client,data.nhan,socket)
    }
}