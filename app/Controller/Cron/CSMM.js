let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let sodu = require('../../Model/users/sodu');
let info = require('../../Model/users/info');
let cuoc = require('../../Model/CSMM/cuoc')
let init = function init(obj){
	io = obj;
	reset();
}
/* reset phiên... */
let reset = function()
{
    mysqli.query("SELECT * FROM `cuoc` WHERE `trangthai` = '0' LIMIT 1",function(err,data){
        if(err) throw err;
        if(data.length <=0)
        {
            GameCSMM();
        }
        data.forEach(cuoc => {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+cuoc.uid+"' LIMIT 1",function(er2,player){
                if(er2) throw er2;
                player.forEach(users => {
                    mysqli.query("UPDATE `cuoc` SET `trangthai` = '2', `phien` = '0', `vangnhan` = `vangcuoc` WHERE `id` = '"+cuoc.id+"'",function(err3,updatecuoc){
                        if(err3) throw err3;
                        /* insert log */
                        mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc', `key` = '" + cuoc.id + "', `uid` = '" + users.id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + cuoc.vangcuoc) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + cuoc.vangcuoc + "', `noidung` = 'HOÀN TRẢ CƯỢC CLTX DO PHIÊN KHÔNG CHẠY'",function(err4,insertodu){
                            if(err4) throw err4;
                            mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '"+cuoc.vangcuoc+"' WHERE `id` = '"+users.id+"'",function(err5,updatexu){
                                if(err5) throw err5;
                                io.to({ 
                                    vang : users.xu + cuoc.vangcuoc,
                                },users.id)
                                reset();
                            })
                        })
                    })
                });
            })
        });
    })
}
let trathuong = function(phien,ketqua)
{
    ketqua = ketqua >> 0;
    mysqli.query("SELECT * FROM `cuoc` WHERE `phien` = '"+phien+"' AND `trangthai` = '0' LIMIT 1",function(err,data){
        data.forEach(obj => {
            let win = 0;
            /* Xóa log */
            cuoc.slice(0).forEach(function (item) {
                if (+item.id <= obj.id) {
                    cuoc.splice(cuoc.indexOf(item), 1);
                }
            });
            if(obj.game == "taixiu" && obj.cuoc == "tai" && ketqua >=50) win = obj.vangcuoc * 1.95;
            else if(obj.game == "taixiu" && obj.cuoc == "xiu" && ketqua <=49) win = obj.vangcuoc * 1.95;
            else if(obj.game == "chanle" && obj.cuoc == "chan" && ketqua%2 == 0) win = obj.vangcuoc * 1.95;
            else if(obj.game == "chanle" && obj.cuoc == "le" && ketqua%2 != 0) win = obj.vangcuoc * 1.95;
            else if(obj.game == "xien" && obj.cuoc == "chantai" && ketqua%2 == 0 && ketqua >=50) win = obj.vangcuoc * 3.2;
            else if(obj.game == "xien" && obj.cuoc == "chanxiu" && ketqua%2 == 0 && ketqua <50) win = obj.vangcuoc * 3.2;
            else if(obj.game == "xien" && obj.cuoc == "letai" && ketqua%2 != 0 && ketqua >=50) win = obj.vangcuoc * 3.2;
            else if(obj.game == "xien" && obj.cuoc == "lexiu" && ketqua%2 != 0 && ketqua <50) win = obj.vangcuoc * 3.2;
            mysqli.query("UPDATE `cuoc` SET `trangthai` = '1', `vangnhan` = '"+win+"' WHERE `id` = '"+obj.id+"'",function(xvz,updatecuoc){
                /* bang hội */
                mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+obj.uid+"'",function(xcv,banghoitv){
                    if(banghoitv.length >=1)
                    {
                        banghoitv = banghoitv[0];
                        mysqli.query("UPDATE `banghoi_thanhvien` SET `thanhtich` = `thanhtich` + '"+obj.vangcuoc+"' WHERE `id` = '"+banghoitv.id+"'",function(xcvxvc,asdas){
                            mysqli.query("UPDATE `banghoi` SET `xu` = `xu` + '"+obj.vangcuoc+"', `exp` = `exp` + '"+obj.vangcuoc+"' WHERE `id` = '"+banghoitv.bang+"'")
                        });
                    }
                })
                /* Win */
                if(win > 0)
                {
                    mysqli.query("SElECT * FROM `nguoichoi` WHERE `id` = '"+obj.uid+"'",function(errr,datau){
                        datau.forEach(users => {
                            mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc', `key` = '"+obj.id+"', `uid` = '"+users.id+"', `truoc` = '"+users.xu+"', `sau` = '"+(users.xu+win)+"', `thoigian` = '"+checkstring.time().thoigian+"', `xu` = '"+win+"', `noidung` = 'Chiến thắng CLTX #"+obj.id+"'",function(ryurty,insertlog){
                                users.thongtin = JSON.parse(users.thongtin);
                                users.thongtin.choigame = +users.thongtin.choigame > 0 ? +users.thongtin.choigame+1 : 1;
                                users.thongtin.cltx_thang = +users.thongtin.cltx_thang >0 ? users.thongtin.cltx_thang + obj.vangcuoc*0.95 : obj.vangcuoc*0.95;
                                users.thongtin.chanle_chuoi_thang = +users.thongtin.chanle_chuoi_thang > 0 ? +users.thongtin.chanle_chuoi_thang + 1 : 1;
                                users.thongtin.chanle_chuoithua = 0;
                                mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '"+win+"', `thongtin` = '"+JSON.stringify(users.thongtin)+"', `thang_csmm` = `thang_csmm` + '"+(obj.vangcuoc*0.95)+"' WHERE `id` = '"+obj.uid+"'",function(ghjgfhj,updateusers){
                                    /* Nhiệm vụ bang hội */
                                    mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+users.id+"' LIMIT 1",function(xcv,nhiemvu){
                                        if(nhiemvu.length >=1)
                                        {
                                            nhiemvu = nhiemvu[0];
                                            if(nhiemvu.type == "chanle_thang")
                                            {
                                                mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'1' WHERE `id` = '"+nhiemvu.id+"'");
                                            }
                                            if(nhiemvu.type == "chanle_thangvang")
                                            {
                                                mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'"+win+"' WHERE `id` = '"+nhiemvu.id+"'");
                                            }
                                            if(nhiemvu.type == "chanle_chuoithang" && users.thongtin.chanle_chuoi_thang > nhiemvu.MIN)
                                            {
                                                mysqli.query("UPDATE `banghoi_data` SET `MIN` = '"+users.thongtin.chanle_chuoi_thang+"' WHERE `id` = '"+nhiemvu.id+"'");
                                            }
                                        }
                                    })
                                    io.to({
                                        vang : users.xu + win
                                    }, users.id)
                                    trathuong(phien,ketqua);
                                })
                            })
                        });
                    })
                }
                else 
                {
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+obj.uid+"'",function(cxb,datau){
                        datau.forEach(users => {
                            users.thongtin = JSON.parse(users.thongtin);
                            users.thongtin.choigame = +users.thongtin.choigame > 0 ? +users.thongtin.choigame+1 : 1;
                            users.thongtin.chanle_chuoi_thang = 0;
                            users.thongtin.cltx_thua = +users.thongtin.cltx_thua >0 ? users.thongtin.cltx_thua + obj.vangcuoc : obj.vangcuoc;
                            users.thongtin.chanle_chuoithua = +users.thongtin.chanle_chuoithua > 0 ? +users.thongtin.chanle_chuoithua + 1 : 1;
                            mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"', `thua_csmm` = `thua_csmm` + '"+(obj.vangcuoc)+"' WHERE `id` = '"+obj.uid+"'",function(hfdgh,updatenguoicohi){
                                /* nhiệm vụ bang hội */
                                mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+users.id+"' LIMIT 1",function(xcv,nhiemvu){
                                    if(nhiemvu.length >=1)
                                    {
                                        nhiemvu = nhiemvu[0];
                                        if(nhiemvu.type == "chanle_thua")
                                        {
                                            mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'1' WHERE `id` = '"+nhiemvu.id+"'");
                                        }
                                        if(nhiemvu.type == "chanle_thuavang")
                                        {
                                            mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'"+obj.vangcuoc+"' WHERE `id` = '"+nhiemvu.id+"'");
                                        }
                                        if(nhiemvu.type == "chanle_chuoithua" && users.thongtin.chanle_chuoithua > nhiemvu.MIN)
                                        {
                                            mysqli.query("UPDATE `banghoi_data` SET `MIN` = '"+users.thongtin.chanle_chuoithua+"' WHERE `id` = '"+nhiemvu.id+"'");
                                        }
                                    }
                                })
                                trathuong(phien,ketqua);
                            })
                        });
                    })
                }
            })
        });
    })
}
let GameCSMM = function()
{
    let Game = setInterval(function(){

        mysqli.query("SELECT * FROM `phien` WHERE `status` = '0'",function(err,data){
            if(err) throw err;
            let server9999 = 0;
            let array = [];
            let admin = [];
            let server = [];

            data.forEach(obj => {
                if(obj.server == 999) server9999 = 1;
                server.push({id : obj.id})
				if(obj.status == 0 && obj.ketqua != '' && obj.server != 999)
                    {
                        mysqli.query("UPDATE `phien` SET `status` = '1' WHERE `id` = '"+obj.id+"'",function(err45,capnhatserver){
                            trathuong(obj.id,obj.ketqua)
                            io.all({
                                reloadphien : obj.server,
                            })
                        })
                    }
                mysqli.query("UPDATE `phien` SET `time` = `time` - '1' WHERE `id` = '"+obj.id+"' AND `server` = '999'",function(err2,updatephien){
                    /* nếu có kết quả, và chưa trả, và time <=0 */
                    if(obj.time <=0 && obj.status == 0 &&  obj.server == 999)
                    {
                        mysqli.query("UPDATE `phien` SET `status` = '1' WHERE `id` = '"+obj.id+"'",function(err45,capnhatserver){
                            trathuong(obj.id,obj.ketqua)
                            io.all({
                                reloadphien : obj.server,
                            })
                        })
                    }

                })
                let chan = 0;
                let le = 0;
                let tai = 0;
                let xiu = 0;
                let users = [];
                
                cuoc.filter(e => e.phien == obj.id && e.server == obj.server).forEach(sin => {
                    chan+=sin.chan;
                    le+=sin.le;
                    tai+=sin.tai;
                    xiu+=sin.xiu;
                    users.push({
                        id : sin.id,
                        uid : sin.uid,
                        name : sin.name,
                        vang : -1,
                        game : sin.game,
                        cuoc : sin.cuoc,
                        vangcuoc : checkstring.number_format(sin.vangcuoc)
                    })
                });
                array.push({id : obj.id, time : obj.time ,server : obj.server, tai : tai, xiu : xiu, chan : chan, le : le})
                if(obj.server == 999)
                io.admin({
                    csmm_999 : {
                        id : obj.id, time : obj.time ,server : obj.server, tai : tai, xiu : xiu, chan : chan, le : le, ketqua : obj.ketqua, users : JSON.stringify(users)
                    }
                })

            });
            io.all({
                server : array
            })
            
             
            /* Chưa tồn tại 9999 */
            if(server9999 == 0)
            mysqli.query("INSERT INTO `phien` SET `time` = '120', `ketqua` = '"+checkstring.rand(1,99)+"', `thoigian` = '"+checkstring.time().thoigian+"', `status` = '0', `server` = '999'",function(ghfgh,insert999){
				if(ghfgh) throw ghfgh;
            })
        })
        /* Log cược */

        /*
        mysqli.query("SELECT * FROM cuoc ORDER by `id` DESC LIMIT 20",function(err,logc){
            let array = [];
            logc.forEach(obj => {
                array.push({
                    id : obj.id,
                    uid : obj.uid,
                    name : obj.name,
                    phien : obj.phien,
                    server : obj.server,
                    game : obj.game,
                    vangcuoc : obj.vangcuoc,
                    vangnhan : obj.vangnhan,
                    cuoc : obj.cuoc,
                    trangthai : obj.trangthai,
                    thoigian : checkstring.thoigian(obj.thoigian),
                });
            });
            io.all({
                logcuoc : array
            })
            
        })
        */
    },1000)
    return Game;

}

module.exports = init;
