let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info =  require('../../../Model/users/info');
let game = require('../../../Model/VXMM/game');
let cuoc = require('../../../Model/VXMM/cuoc');
let  sodu = require('../../../Model/users/sodu');

/** 
 * Hướng chạy Oản tù tì
 * step 1 mời người*/ 
let moi = function(client,data,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập'
        })
    }
    else 
    if(client.ott ==1)
    {
        client.dn({
            loading : -1,
            msg : 'Vui lòng chờ...'
        })
    }
    else 
    {
        client.ott = 1;
        // kiểm tra xem người chơi này có đang chơi với ai kh
        let pk = data.pk >> 0;
        let type = checkstring.html(data.type);
        let vang = +data.vang;
        Promise.all([
            new Promise( (res,fai) => {
                mysqli.query("SELECT * FROM `oantuti` WHERE (`player1` = '"+pk+"' or `player2` = '"+pk+"') AND `status` = '0' AND `time` >= '"+checkstring.time().thoigian+"'",function(err,show){
                    res(show.length)
                })
            }),
            new Promise( (res,fai) => {
                mysqli.query("SELECT * FROM `oantuti` WHERE (`player1` = '"+client.id+"' or `player2` = '"+client.id+"') AND `status` = '0' AND `time` >= '"+checkstring.time().thoigian+"'",function(err,show){
                    res(show.length)
                })
            })
        ]).then(e => {
            let pkis = e[0];
            let pkmy = e[1];
            if(vang <1000 || vang > 500000000)
            {
                client.dn({
                    msg : 'Tiền cược tối thiểu 1.000 xu và nhỏ hơn 500tr',
                    type : 'info',
                    loading : -1,
                })
                client.ott = 0;
            }
            else
            if(pkis >0)
            {
                client.dn({
                    msg : 'Đối thủ hiện tại đang có lời mời hoặc đang solo với người khác',
                    type : 'info',
                    loading : -1,
                })
                client.ott = 0;
            }
            else 
            if(pkmy >0)
            {
                client.dn({
                    msg : 'Bạn đang có lời mời với người khác, vui lòng thử lại sau ít giây',
                    type : 'info',
                    loading : -1,
                })
                client.ott = 0;
            }
            else 
            {
                let time = checkstring.time().thoigian + 30000;
                mysqli.query("INSERT INTO `oantuti` SET `chose1`  ='"+type+"', `player1` = '"+client.id+"', `player2` = '"+pk+"', `thoigian` = '"+checkstring.time().thoigian+"', `time` = '"+time+"', `vang` = '"+vang+"'",function(err,show){
                    client.dn({
                        loading : -1,
                        msg : 'Tạo lời mời thành công. Vui lòng chờ đối thủ đồng ý',
                        type : 'success',
                    });
                    client.ott = 0;
                    mysqli.query("SELECT `name` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(erccc,users){
                        if(users.length >=1)
                        {
                            socket.to({ 
                                OTT : {
                                    name : users[0].name,
                                    vang : vang,
                                    id : show.insertId,
                                }
                            },pk);
                        }
                    })
                })
            }
        })
    }
}

let nametype = function(name)
{
    if(name == "bua") return "Búa";
    else if(name == "keo") return "Kéo";
    else return "Bao";
}

let chapnhan = function(client,data,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading  : -1,
            msg : 'đăng nhập đ đâu mà chơi',
            type : 'info'
        })
    }
    else 
    if(client.acpott == 1)
    {
        client.dn({
            loading  : -1,
            msg : 'Bạn đã có một yêu cầu chấp thuận khác, vui lòng chờ.',
            type : 'info'
        })
    }
    else 
    {
        client.acpott = 1;
        let type2 = checkstring.html(data.type);
        let id = data.id >>0;
        mysqli.query("SELECT * FROM `oantuti` WHERE `id` = '"+id+"' AND `status` = '0' LIMIT 1",function(err,phien){
            
            phien.forEach(ott => {
                Promise.all([
                    new Promise((res,fai)=>mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+ott.player1+"'",function(err,users){
                        if(users.length >=1) {
                            res(users[0])
                        }
                    })),
                    new Promise((res,fai)=>mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+ott.player2+"'",function(err,users){
                        if(users.length >=1) {
                            res(users[0])
                        }
                    }))
                ]).then(e => {
                    let u1 = e[0];
                    let u2 = e[1];
                    if(u1.xu < ott.vang || u2.xu < ott.vang)
                    {
                        socket.to({
                            msg : 'Vấn đấu bị huỷ do 1 trong 2 đối thủ không có đủ tiền.',
                            type : 'info',
                            loading : -1,
                        },u1.id);
                        socket.to({
                            msg : 'Vấn đấu bị huỷ do 1 trong 2 đối thủ không có đủ tiền.',
                            type : 'info',
                            loading : -1,
                        },u2.id)
                        client.acpott = 0;
                        mysqli.query("DELETE FROM `oantuti` WHERE `id` = '"+ott.id+"'");
                    }
					else 
					if(u1.server != u2.server)
                    {
                        socket.to({
                            msg : '2 người không chung máy chủ không thể PK.',
                            type : 'info',
                            loading : -1,
                        },u1.id);
                        socket.to({
                            msg : '2 người không chung máy chủ không thể PK.',
                            type : 'info',
                            loading : -1,
                        },u2.id)
                        client.acpott = 0;
                        mysqli.query("DELETE FROM `oantuti` WHERE `id` = '"+ott.id+"'");
                    }
                    else 
                    {
                        let win = 0;
                        let type1 = ott.chose1;
                        if(type1 == type2)
                        {
                            win = 0;
                        }
                        else 
                        if(type1 == "bao" && type2 == "bua")
                        {
                            win = ott.player1;
                        }
                        else 
                        if(type1 == "bao" && type2 == "keo")
                        {
                            win = ott.player2;
                        }
                        else 
                        if(type1 == "keo" && type2 == "bua")
                        {
                            win = ott.player2;
                        }
                        else 
                        if(type1 == "keo" && type2 == "bao")
                        {
                            win = ott.player1;
                        }
                        else 
                        if(type1 == "bua" && type2 == "bao")
                        {
                            win = ott.player2;
                        }
                        else 
                        if(type1 == "bua" && type2 == "keo")
                        {
                            win = ott.player1;
                        }
                        mysqli.query("UPDATE `oantuti` SET `chose2` = '"+type2+"', `status` = '1', `win` = '"+win+"' WHERE `id` = '"+ott.id+"'",function(eee,suceess){
                            /* Thường hợp 1, 2 bên hoà nhau :v */
                            let noidung = '';
                            if(win == 0) 
                            {
                                let xutru = ott.vang * 0.05;
                                sodu(u1.id,u1.xu,-xutru,'HOÀ OẲN TÙ TÌ','oantuti',ott.id);
                                sodu(u2.id,u2.xu,-xutru,'HOÀ OẲN TÙ TÌ','oantuti',ott.id);
                                socket.to({
                                    msg : 'Kết thúc trận chiến, kết quả là hoà.',
                                    type : 'info',
                                    loading : -1,
                                    vang : u1.xu - xutru,
                                },u1.id)
                                socket.to({
                                    msg : 'Kết thúc trận chiến, kết quả là hoà.',
                                    type : 'info',
                                    loading : -1,
                                    vang : u2.xu - xutru,
                                },u2.id)
                                client.acpott = 0;
                            }
                            else 
                            if(win == u1.id)
                            {
                                let xunhan = ott.vang * 0.95;
                                sodu(u1.id,u1.xu,xunhan,'Chiến thắng oản tù tì','oantuti',ott.id);
                                sodu(u2.id,u2.xu,-ott.vang,'Thua oản tù tì','oantuti',ott.id);
                                socket.to({
                                    msg : 'Xin chúc mừng, bạn đã chiến thắng ('+nametype(type1)+' vs '+nametype(type2)+').',
                                    type : 'info',
                                    loading : -1,
                                    vang : u1.xu + xunhan,
                                },u1.id)
                                socket.to({
                                    msg : 'Xin chia buồn, bạn thua rồi. ('+nametype(type2)+' vs '+nametype(type1)+')',
                                    type : 'info',
                                    loading : -1,
                                    vang : u2.xu - ott.vang,
                                },u2.id)
                                noidung = " Tù thủ "+u1.name+"("+nametype(type1)+") vừa hạ gục tù thủ "+u2.name+"("+nametype(type2)+") nhận được "+checkstring.number_format(xunhan)+" xu.";
                                client.acpott = 0;
                            }
                            else 
                            {
                                client.acpott = 0;
                                let xunhan = ott.vang * 0.8;
                                sodu(u2.id,u2.xu,xunhan,'Chiến thắng oản tù tì','oantuti',ott.id);
                                sodu(u1.id,u1.xu,-ott.vang,'Thua oản tù tì','oantuti',ott.id);
                                socket.to({
                                    msg : 'Xin chúc mừng, bạn đã chiến thắng. ('+nametype(type2)+' vs '+nametype(type1)+')',
                                    type : 'info',
                                    loading : -1,
                                    vang : u2.xu + xunhan,
                                },u2.id)
                                socket.to({
                                    msg : 'Xin chia buồn, bạn thua rồi. ('+nametype(type1)+' vs '+nametype(type2)+')',
                                    type : 'info',
                                    loading : -1,
                                    vang : u1.xu - ott.vang,
                                },u1.id)
                                noidung = " Tù thủ "+u2.name+"("+nametype(type2)+") vừa hạ gục tù thủ "+u1.name+"("+nametype(type1)+") nhận được "+checkstring.number_format(xunhan)+" xu.";
                            }
                            if (noidung.length >= 4) {
                                mysqli.query("INSERT INTO `chat` SET `thoigian` = '" + Date.now() + "', `noidung` = '" + noidung + "', `uid` = '1'", function (er, g) {
                                    io.all(
                                        {
                                            chatbox:
                                            {
                                                name: 'Hệ thống',
                                                avatar: '/vendor/avatar/avatar.png',
                                                msg: noidung
                                            }
                                        },

                                    );

                                })
                            }
                        });
                    }
                })
            });
        })
    }
}

module.exports = function(client,data,socket)
{
    if(!!data.moi)
    {
        moi(client,data.moi,socket);
    }
    if(!!data.chapnhan)
    {
        chapnhan(client,data.chapnhan,socket)
    }
}