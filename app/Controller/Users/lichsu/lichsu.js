let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');
let request = require('request');
const sodu = require('../../../Model/users/sodu');

let admin = async function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập'
        });
    }
    else 
    {
        let profile = await info(client.id);
        if(profile.admin <=0)
        {
            client.dn({
                msg : 'Không thể tải dữ liệu',
                type : 'info'
            });
        }
        else 
        {
            let id = data.id >> 0;
            let trang = data.trang >> 0;
            let from = data.from.length >=3 ? ' AND `date` >= \''+data.from+'\'' : '';
            let to = data.to.length >=3 ? ' AND `date` <= \''+data.to+'\'' : '';
            let kmess = 25;
            let page = trang > 0 ? trang : 1;
            let start = data.trang ? page * kmess - kmess : 0;
            let tab_sodu = await mysqli("SELECT * FROM `sodu` WHERE `uid` = '"+id+"' "+from+" "+to+" ORDER BY `id` DESC LIMIT "+start+",25");
            let dulieu = [];
            tab_sodu.forEach(r => {
                dulieu.push({
                    id : r.id,
                    truoc : r.truoc,
                    sau : r.sau,
                    date : r.date,
                    noidung : r.noidung,
                    xu : r.xu,
                    nguon : r.nguon,
                    key : r.key,
                    thoigian : checkstring.thoigian(+r.thoigian)
                });
            });
            let tong = await mysqli("SELECT `id` FROM `sodu` WHERE `uid` = '"+id+"' "+from+" "+to+" ");
            client.dn({
                lichsu :
                {
                    info_sodu :
                    {
                        dulieu,
                        TOTAL : tong.length,
                        page : start,
                        from : data.from,
                        to : data.to,
                        id : id,
                    }
                },
                loading : true
            });

        }
    }
}


let list_sodu = async function(client,data)
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
        let kmess = 25;
        let page = trang > 0 ? trang : 1;
        let start = data.trang ? page * kmess - kmess : 0;
        Promise.all([
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `sodu` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT "+start+",25",function(err,sodu){
                        try {
                            let array = [];
                            sodu.forEach(a => {
                                array.push({
                                    id : a.id,
                                    truoc : a.truoc,
                                    sau : a.sau,
                                    date : a.date,
                                    noidung : a.noidung,
                                    nguon : a.nguon,
                                    key : a.key, 
                                    vang : a.xu,
                                    thoigian : checkstring.thoigian(+a.thoigian),
                                });
                            });
                            res(array)
                        }
                        catch(e)
                        {
                            res([])
                        }
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `sodu` WHERE `uid` = '"+client.id+"'",function(err,sodu){
                        res(sodu.length)
                    })
                }
            )
        ]).then(e => {
            let list = e[0];
            let tong = e[1];
            client.dn({
                sodu : 
                {
                    dulieu : list,
                    TOTAL : tong,
                    page : start,
                },
                loading : -1,
            });
        })
        
    }
}

let doc = function(client,data)
{
    let id = data.key >> 0;
    let nguon = checkstring.html(data.nguon);
    if(client.admin >=1 || client.id >=1)
    {
        if(nguon == "cuoc_taixiu")
        {
            mysqli.query("SELECT * FROM `cuoc_taixiu` WHERE `id` = '"+id+"' LIMIT 1",function(err,dulieu){
                try 
                {
                    if(dulieu.length <=0)
                    {
                        client.dn({
                            loading : -1,
                            msg : 'không thể dọc'
                        })
                    }
                    else 
                    {
                        dulieu = dulieu[0];
                        client.dn({
                            loading : -1,
                            doc : {
                                head : 'Thời gian,phiên,cửa chọn,xu cược,xu hoàn trả,xu nhận,trạng thái',
                                body : ''+checkstring.thoigian(dulieu.thoigian)+'|'+checkstring.number_format(dulieu.phien)+'| '+(dulieu.cuachon == "tai" ? 'Tài' : 'Xỉu')+'|'+checkstring.number_format(dulieu.xucuoc)+'|'+checkstring.number_format(dulieu.xuhoantra)+'|'+checkstring.number_format(dulieu.xunhan)+'|'+(dulieu.trangthai == 0 ? '<button class="btn btn-info">Đang chạy</button>' : (dulieu.trangthai == 1 ? '<button class="btn btn-success">Hoàn tất</button>' : '<button class="btn btn-danger">Hoàn trả</button>'))+' ',
                            }
                        })
                    }
                }
                catch(e)
                {
                    console.log(e)
                }
            })
        }
        if(nguon == "3cay_data")
        {
            mysqli.query("SELECT * FROM `3cay_data` WHERE `id` = '"+id+"'",function(err,dulieu){
                if(err) throw err;
                if(dulieu.length <=0)
                {
                    client.dn({
                        loading : -1,
                        msg : 'không thể đọc dữ liệu'
                    })
                }
                else 
                {
                   let e = dulieu[0];
                   Promise.all([
                       new Promise((res,fai) => {
                           mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.player1+"'",function(errr,users){
                               if(users.length <=0)
                               {
                                   res({});
                               }
                               else 
                               {
                                   res(users[0])
                               }
                           })
                       }),
                       new Promise((res,fai) => {
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.player2+"'",function(errr,users){
                            if(users.length <=0)
                            {
                                res({});
                            }
                            else 
                            {
                                res(users[0])
                            }
                        })
                    })
                   ]).then(res => {
                       let u1 = res[0];
                       let u2 = res[1];
                       client.dn({
                           loading : -1,
                           doc : {
                               head : 'Thời gian, phòng, tiền cược, người chơi 1, người chơi 2, người thắng',
                               body : ' '+checkstring.thoigian(e.thoigian)+'| '+checkstring.number_format(e.room)+'| '+checkstring.number_format(e.cuoc)+'| '+u1.name+' | '+u2.name+' | '+(e.win == 0 ? 'Hòa' : (e.win == u1.id ? u1.name : u2.name))+' ',
                           }
                       })
                   })
                }
            })
        }
        if(nguon == "chuyentien")
        {
            mysqli.query("SELECT * FROM `chuyentien` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({
                        loading : -1
                    })
                }
                else 
                {
                    e = e[0];
                    Promise.all([
                        new Promise( (res,fai) => {
                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.from+"'",function(err2,users){
                                if(users.length<=0) res({});
                                else res(users[0])
                            })
                        }),
                        new Promise( (res,fai) => {
                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.to+"'",function(err2,users){
                                if(users.length<=0) res({});
                                else res(users[0])
                            })
                        }),
                    ]).then(b => {
                        let from = b[0];
                        let to = b[1];
                        client.dn({
                            loading : -1,
                            doc : {
                                head : 'Thời gian, người chuyển, người nhận, số tiền, nội dung',
                                body : ' '+checkstring.thoigian(e.thoigian)+'| '+from.name+' | '+to.name+' | '+checkstring.number_format(e.vang)+'| '+e.noidung+' ',
                            }
                        })
                    })
                }
            })
        }
        if(nguon == "cuoc")
        {
            mysqli.query("SELECT * FROM `cuoc` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length >=1)
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'thời gian, máy chủ, phiên chơi, game chơi, cửa chọn, xu cược, xu nhận, trạng thái ',
                            body : ' '+checkstring.thoigian(e.thoigian)+'| '+e.server+' | '+e.phien+' | '+(e.game == "chanle" ? "chẵn lẻ" : (e.game == "taixiu" ? 'Tài xỉu' : 'xiên'))+' | '+(e.cuoc == "tai" ? "tài" : (e.cuoc == "xiu" ? "xỉu" : (e.cuoc == "chan" ? "Chẵn" : (e.cuoc == "le" ? "lẻ" : (e.cuoc=="chantai" ? "Chẵn - tài" : (e.cuoc == "chanxiu" ? "Chẵn - xỉu" : (e.cuoc == "letai" ? "Lẻ - tài" : "Lẻ - xỉu")))))))+'| '+checkstring.number_format(e.vangcuoc)+' | '+checkstring.number_format(e.vangnhan)+' | '+(e.trangthai == 0 ? '<button class="btn btn-info">Đang chạy</button>' : (e.trangthai == 1 ? '<button class="btn btn-success">Hoàn tất</button>' : '<button class="btn btn-danger">Hoàn trả</button>'))+'  '
                        }
                    })
                }
                else 
                {
                    client.dn({loading : -1})
                }
            })
        }
        if(nguon == "cuoc_vongquay")
        {
            mysqli.query("SELECT * FROM `cuoc_vongquay` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({loading : -1})
                }
                else 
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'Thời gian, Phiên, Xu cược, Xu thắng, Trạng thái',
                            body : ' '+checkstring.thoigian(e.thoigian)+' | '+e.phien+' | '+checkstring.number_format(e.xu)+' | '+checkstring.number_format(e.win)+' | '+(e.trangthai == 0 ? '<button class="btn btn-info">Đang chạy</button>' : (e.trangthai == 1 ? '<button class="btn btn-success">Hoàn tất</button>' : '<button class="btn btn-danger">Hoàn trả</button>'))+'   ',
                        }
                    })
                }
            })
        }
        if(nguon == "log_giftcode")
        {
            mysqli.query("SELECT * FROM `log_giftcode` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({loading   : -1})
                }
                else 
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'Thời gian, mã, giá trị',
                            body : ' '+checkstring.thoigian(e.thoigian)+' | '+e.ma+' | '+checkstring.number_format(e.value)+' ',
                        }
                    })
                }
            })
        }
        if(nguon == "momo")
        {
            mysqli.query("SELECT * FROM `momo` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({loading : -1})
                }
                else 
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'Thời gian, mã giao dịch, Số tiền, Xu nhận ',
                            body : ' '+checkstring.thoigian(e.thoigian)+'| '+e.magiaodich+' | '+checkstring.number_format(e.vnd)+' | '+checkstring.number_format(e.vang)+'',
                        }
                    })
                }
            })
        }
        if(nguon == "thesieure")
        {
            mysqli.query("SELECT * FROM `thesieure` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({loading : -1})
                }
                else 
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'Thời gian, mã giao dịch, Số tiền, Xu nhận ',
                            body : ' '+checkstring.thoigian(e.thoigian)+'| '+e.magiaodich+' | '+checkstring.number_format(e.vnd)+' | '+checkstring.number_format(e.vang)+'',
                        }
                    })
                }
            })
        }
        if(nguon == "napvang")
        {
            mysqli.query("SELECT * FROM `napvang` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({
                        loading : -1,
                    })
                }
                else 
                {
                    e = e[0];
                    client.dn({
                        loading  : -1,
                        doc : {
                            head : 'Thời gian, Vũ trụ, Vàng, Xu nhận',
                            body : ''+checkstring.thoigian(e.thoigian)+' | '+e.server+' | '+checkstring.number_format(e.vang_game)+'| '+checkstring.number_format(e.vang)+'',
                        }
                    })
                }
            })
        }
        if(nguon == "rutvang")
        {
            mysqli.query("SELECT * FROM `rutvang` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({
                        loading  :-1,
                    })
                }
                else 
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'Thời gian, Mã đơn, Vũ trụ, Tên nhân vật, Số vàng, Số xu, Trạng thái',
                            body : ' '+checkstring.thoigian(e.thoigian)+'|'+e.id+'|'+e.server+'|'+e.name+'| '+checkstring.number_format(e.vangnhan)+' | '+checkstring.number_format(e.vangrut)+' | '+(e.trangthai == 1 ? '<button class="btn btn-info">Chưa rút</button>' : '<button class="btn btn-success">Đã Giao dịch</button>')+'  '
                        }
                    })
                }
            })
        }
        if(nguon == "thecao")
        {
            mysqli.query("SELECT * FROM `thecao` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({loading : -1})
                }
                else
                {
                    e = e[0];
                    client.dn({
                        loading : -1,
                        doc : {
                            head : 'Thời gian, Mã thẻ, Serial, Nhà Mạng, Mệnh giá, Xu nhận, Trạng thái',
                            body : ' '+checkstring.thoigian(e.thoigian)+'| '+e.mathe+' | '+e.seri+'| '+e.nhamang+'| '+checkstring.number_format(e.menhgia)+'| '+checkstring.number_format(e.vang)+' | '+(e.stt == 0 ? '<button class="btn btn-info">Đang nạp</button>' : (e.stt == 1 ? '<button class="btn btn-success">Thành công</button' : (e.stt == 2 ? '<button class="btn btn-warning">Sai mệnh giá</button>' : '<button class="btn btn-danger">Thẻ sai</button>')))+' ',
                        }
                    })
                }
            })
        }
        if(nguon == "oantuti")
        {
            mysqli.query("SELECT * FROM `oantuti` WHERE `id` = '"+id+"'",function(err,e){
                if(err) throw err;
                if(e.length <=0)
                {
                    client.dn({
                        loading : -1,

                    })
                }
                else 
                {
                    e = e[0];
                    Promise.all([
                        new Promise((res,fai) => {
                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.player1+"'",function(err2,users){
                                if(err2) throw err2;
                                if(users.length <=0) res({})
                                else res(users[0])
                            })
                        }),
                        new Promise((res,fai) => {
                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.player2+"'",function(err2,users){
                                if(users.length <=0) res({})
                                else res(users[0])
                            })
                        })
                    ]).then(b => {
                        let u1 = b[0];
                        let u2 = b[1];
                        let ten = function(k)
                        {
                            if (k == "bua") return "Búa";
                            else if(k == "bao") return "Bao";
                            else return "Kéo";
                        }
                        client.dn({
                            loading : -1,
                            doc : {
                                head : 'Thời gian, Người chơi 1, Người chơi 2, Cược, Người thắng',
                                body : ' '+checkstring.thoigian(e.thoigian)+'| '+u1.name+'('+ten(e.chose1)+') | '+u2.name+'('+ten(e.chose2)+') | '+checkstring.number_format(e.vang)+' | '+(e.win == 0 ? 'Hòa' : (e.win == u1.id ? u1.name : u2.name))+' ',
                            }
                        })
                    })
                }
            })
        }
    }
    else 
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            loading  : -1,
            type : 'info'
        })
    }
}


let list_sodu2 = async function(client,data)
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
        let uid = data.id >> 0;
        Promise.all([
            new Promise(
                (res,fai) =>
                {
                    mysqli.query("SELECT * FROM `sodu` WHERE `uid` = '"+uid+"' ORDER BY `id` DESC LIMIT "+start+","+kmess+"",function(err,sodu){
                        let array = [];
                        sodu.forEach(a => {
                            array.push({
                                id : a.id,
                                truoc : a.truoc,
                                sau : a.sau,
                                date : a.date,
                                noidung : a.noidung,
                                nguon : a.nguon,
                                key : a.key, 
                                vang : a.xu,
                                thoigian : checkstring.thoigian(+a.thoigian),
                            });
                        });
                        res(array)
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `sodu` WHERE `uid` = '"+uid+"'",function(err,sodu){
                        res(sodu.length)
                    })
                }
            )
        ]).then(e => {
            let list = e[0];
            let tong = e[1];
            client.dn({
                checksd : 
                {
                    dulieu : list,
                    TOTAL : tong,
                    page : start,
                    uid : uid,
                    kmess : kmess,
                },
                loading : -1,
            });
        })
        
    }
}


let list_csmm =  function(client,data)
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
                    mysqli.query("SELECT * FROM `cuoc` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT "+start+",10",function(err,sodu){
                        let array = [];
                        sodu.forEach(a => {
                            array.push({
                                id : a.id,
                                thoigian : checkstring.thoigian(+a.thoigian),
                                phien : a.phien,
                                server : a.server,
                                game : a.game,
                                vangcuoc : a.vangcuoc,
                                vangnhan : a.vangnhan,
                                cuoc : a.cuoc,
                                phien : a.phien,
                                trangthai : a.trangthai,
                            });
                        });
                        res(array)
                    })
                }
            ),
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `cuoc` WHERE `uid` = '"+client.id+"'",function(err,sodu){
                        res(sodu.length)
                    })
                }
            )
        ]).then(e => {
            let list = e[0];
            let tong = e[1];
            client.dn({
                logcsmm : 
                {
                    dulieu : list,
                    TOTAL : tong,
                    page : start,
                },
                loading : -1,
            });
        })
        
    }
}

let huycsmm = function(client,data)
{
    let id = data.id >> 0;
    if(client.id <=0)
    {
        client.dn({
            msg :'Chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    if(client.huycsmm == 1)
    {
        client.dn({
            msg :'Đang có 1 yêu cầu',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        client.huycsmm = 1;
        console.log('uc')
        mysqli.query("SELECT * FROM `cuoc` WHERE `id` = '"+id+"' LIMIT 1",function(err,c){
            c.forEach(cuoc => {
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(ex,uc){
                    uc.forEach(users => {
                        if(cuoc.uid != users.id)
                        {
                            client.dn({
                                msg : 'Không phải của bạn',
                                type : 'info',
                                loading :-1,
                            })
                            client.huycsmm = 0;
                        }
                        else
                        if(cuoc.trangthai !=0)
                        {
                            client.dn({
                                msg : 'Không thể hủy',
                                type : 'info',
                                loading : -1,
                            })
                            client.huycsmm = 0;
                        }
                        else 
                        {
                            mysqli.query("SELECT * FROM `phien` WHERE `id` = '"+cuoc.phien+"' AND `server` = '"+cuoc.server+"' LIMIT 1",function(ccc,phien){
                                if(phien.length >=1)
                                {
                                    phien = phien[0];
                                    if(phien.time <=20)
                                    {
                                        client.dn({
                                            msg : 'Chỉ có thể hủy khi thời gian >20s',
                                            type : 'info',
                                            loading : -1,
                                        })
                                        client.huycsmm = 0;
                                    }
                                    else 
                                    {
                                        mysqli.query("UPDATE `cuoc` SET `trangthai` = '2' WHERE `id` = '"+cuoc.id+"'",function(dfd,sdf){
                                            sodu(users.id,users.xu,cuoc.vangcuoc,'HỦY cược CSMM #'+id+'','cuoc',id)
                                            client.dn({
                                                msg : 'Hủy thành công',
                                                type : 'info',
                                                loading : -1,
                                                vang : users.xu+cuoc.vangcuoc,
                                            })
                                            client.huycsmm = 0;
                                        })
                                    }
                                }
                            })
                        }
                    });
                })
            });
        })
    }
}

module.exports = function(client,data)
{
    console.log(data)
    if(!!data.huycsmm)
    {
        huycsmm(client,data.huycsmm);
    }
    if(!!data.doc)
    {
        doc(client,data.doc);
    }
    if(!!data.sodu)
    {
        list_sodu(client,data.sodu);
    }
    if(!!data.check)
    {
        list_sodu2(client,data.check);
    }
    if(!!data.check)
    {
        check(client,data.check);
    }
    if(!!data.admin)
    {
        admin(client,data.admin);
    }
    if(!!data.csmm)
    {
        list_csmm(client,data.csmm);
    }
}