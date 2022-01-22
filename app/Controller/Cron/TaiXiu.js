let mysqli = require('../../Model/mysqli');
let checkstring = require('../../Model/string');
let validator = require('validator');
let info = require('../../Model/users/info');
let sodu = require('../../Model/users/sodu');
let game = require('../../Model/TaiXiu/Game');
let cuoc = game.cuoc;
let init = function init(obj) {
    io = obj;
    GameTaiXiu();
}

let time = 60;

let startgame = function () {

    mysqli.query("SELECT * FROM `cuoc_taixiu` WHERE `trangthai` = '0' LIMIT 1", function (err2, toall) {
        if (toall.length <= 0) {
            mysqli.query("SELECT * FROM `phien_taixiu` ORDER BY `phien_taixiu`.`phien` DESC LIMIT 1", function (err, phien) {
                if (err) throw err;
                if (phien.length <= 0) {
                    game.id = 1;
                }
                else {
                    game.id = phien[0].phien;
                    game.id += 1;
                }
                game.trangthai = 'dangchay';
                game.b = time;
                mysqli.query("UPDATE `bot` SET `taixiu` = '0'")
            })
        }
        else {
            let obj = toall[0];
            mysqli.query("SELECT `id`, `xu`, `thongtin` FROM `nguoichoi` WHERE `id` = '" + obj.uid + "'", function (err4, users) {
                if (err4) throw err4;
                if (users.length >= 1) {
                    users = users[0];
                    let win = obj.xucuoc + obj.xuhoantra;
                    mysqli.query("UPDATE `cuoc_taixiu` SET `xuhoantra` = '" + win + "', `xucuoc` = '0', `trangthai` = '2' WHERE `id` = '" + obj.id + "'", function (err6, updatecuoc) {
                        /* thắng */
                        if (win >= 1) {
                            mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc_taixiu', `key` = '" + obj.id + "', `uid` = '" + users.id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + win) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + win + "', `noidung` = 'HOÀN TRẢ PHIÊN #" + obj.phien + "'", function (hdghgfd, insertsodu) {
                                mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '" + win + "' WHERE `id` = '" + obj.uid + "'", function (hfgfgh, updatexune) {
                                    io.to({
                                        vang: users.xu + win
                                    }, users.id)
                                    startgame();
                                })
                            })
                        }

                    })
                }
            })

        }
    })

}
let tiencuoc = function (id, value) {
    var dn = 0;
    for (var i = 0; i < cuoc.length; i++) {
        if (cuoc[i].type == value && cuoc[i].id == id) {
            dn += cuoc[i].xu;
        }
    }
    return dn;
}

let cancua = function () {
    if (game.trangthai == "dangtinh" && +game.t == +game.x || game.trangthai == "dangtinh" && 1+1 == 2 ) {
        cuoc.slice(0).forEach(function (item) {
            if (+item.xu <= 0 && item.game == "taixiu") {
                cuoc.splice(cuoc.indexOf(item), 1);
            }
        });
        if (+game.b3 <= 0) {
            game.b3 = (Math.floor(Math.random() * 6) + 1);
        }

        if (+game.b2 <= 0) {
            game.b2 = (Math.floor(Math.random() * 6) + 1);
        }

        if (+game.b1 <= 0) {
            game.b1 = (Math.floor(Math.random() * 6) + 1);
        }

        if (+game.x1 <= 0) {
            game.x1 = (Math.floor(Math.random() * 6) + 1);
        }

        if (+game.x3 <= 0) {
            game.x3 = (Math.floor(Math.random() * 6) + 1);
        }

        if (+game.x2 <= 0) {
            game.x2 = (Math.floor(Math.random() * 6) + 1);
        }
        game.trangthai = 'ketqua';
    }
    else {
        let tai = +game.t;
        let xiu = +game.x;
        let taihon = tai - xiu;
        let xiuhon = xiu - tai;

        /* If tài hơn */
        if (taihon >= 1) {
            let j = cuoc.indexOf(cuoc.filter(value => +value.xu > 0 && value.type == "tai" && value.game == "taixiu").pop());
            if (j != -1) {
                mysqli.query("SELECT `xu`,`id` FROM `nguoichoi` WHERE `id` = '" + cuoc[j].id + "'", function (err, users) {
                    if (users.length >= 1) {
                        users = users[0];
                        if (+cuoc[j].xu <= +taihon) {
                            mysqli.query("UPDATE `cuoc_taixiu` SET `xucuoc` = `xucuoc` - '" + cuoc[j].xu + "', `xuhoantra` = `xuhoantra` + '" + cuoc[j].xu + "' WHERE `id` = '" + cuoc[j].code + "'", function (err2, updatelogcuoc) {
                                /* Update số dư */
                                mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc_taixiu', `key` = '" + cuoc[j].code + "', `uid` = '" + cuoc[j].id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + cuoc[j].xu) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + cuoc[j].xu + "', `noidung` = 'CÂN CỬA TÀI XỈU #" + cuoc[j].code + "'", function (err3, insersodu) {
                                    /* Update tiền */
                                    mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '" + cuoc[j].xu + "' WHERE `id` = '" + users.id + "'", function (err4, updateusersdone) {
                                        game.t -= +cuoc[j].xu;
                                        cuoc[j].hoantra += +cuoc[j].xu;
                                        io.to({
                                            vang: users.xu + cuoc[j].xu,
                                            nguoichoi_taixiu: {
                                                cx: tiencuoc(users.id, 'xiu'),
                                                ct: tiencuoc(users.id, 'tai'),
                                            }
                                        }, users.id)
                                        cuoc[j].xu = 0;
                                        cancua(); // callback cân cửa
                                    })
                                })
                            })
                        }
                        else {
                            mysqli.query("UPDATE `cuoc_taixiu` SET `xucuoc` = `xucuoc` - '" + taihon + "', `xuhoantra` = `xuhoantra` + '" + taihon + "' WHERE `id` = '" + cuoc[j].code + "'", function (err2, updatelogcuoc) {
                                /* Update số dư */
                                mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc_taixiu', `key` = '" + cuoc[j].code + "', `uid` = '" + cuoc[j].id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + taihon) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + taihon + "', `noidung` = 'CÂN CỬA TÀI XỈU #" + cuoc[j].code + "'", function (err3, insersodu) {
                                    /* Update tiền */
                                    mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '" + taihon + "' WHERE `id` = '" + users.id + "'", function (err4, updateusersdone) {
                                        game.t -= +taihon;
                                        cuoc[j].hoantra += +taihon;
                                        cuoc[j].xu -= +taihon;
                                        io.to({
                                            vang: users.xu + taihon,
                                            nguoichoi_taixiu: {
                                                cx: tiencuoc(users.id, 'xiu'),
                                                ct: tiencuoc(users.id, 'tai'),
                                            }
                                        }, users.id)
                                        cancua(); // callback cân cửa
                                    })
                                })
                            })
                        }
                    }
                })
            }
        }
        else {
            let j = cuoc.indexOf(cuoc.filter(value => +value.xu > 0 && value.type == "xiu" && value.game == "taixiu").pop());
            if (j != -1) {
                mysqli.query("SELECT `xu`,`id` FROM `nguoichoi` WHERE `id` = '" + cuoc[j].id + "'", function (err, users) {
                    if (users.length >= 1) {
                        users = users[0];
                        if (+cuoc[j].xu <= +xiuhon) {

                            mysqli.query("UPDATE `cuoc_taixiu` SET `xucuoc` = `xucuoc` - '" + cuoc[j].xu + "', `xuhoantra` = `xuhoantra` + '" + cuoc[j].xu + "' WHERE `id` = '" + cuoc[j].code + "'", function (err2, updatelogcuoc) {
                                /* Update số dư */
                                mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc_taixiu', `key` = '" + cuoc[j].code + "', `uid` = '" + cuoc[j].id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + cuoc[j].xu) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + cuoc[j].xu + "', `noidung` = 'CÂN CỬA TÀI XỈU #" + cuoc[j].code + "'", function (err3, insersodu) {
                                    /* Update tiền */
                                    mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '" + cuoc[j].xu + "' WHERE `id` = '" + users.id + "'", function (err4, updateusersdone) {
                                        game.x -= +cuoc[j].xu;
                                        cuoc[j].hoantra += +cuoc[j].xu;
                                        io.to({
                                            vang: users.xu + cuoc[j].xu,
                                            nguoichoi_taixiu: {
                                                cx: tiencuoc(users.id, 'xiu'),
                                                ct: tiencuoc(users.id, 'tai'),
                                            }
                                        }, users.id)
                                        cuoc[j].xu = 0;
                                        cancua(); // callback cân cửa
                                    })
                                })
                            })
                        }
                        else {
                            mysqli.query("UPDATE `cuoc_taixiu` SET `xucuoc` = `xucuoc` - '" + xiuhon + "', `xuhoantra` = `xuhoantra` + '" + xiuhon + "' WHERE `id` = '" + cuoc[j].code + "'", function (err2, updatelogcuoc) {
                                /* Update số dư */
                                mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc_taixiu', `key` = '" + cuoc[j].code + "', `uid` = '" + cuoc[j].id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + xiuhon) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + xiuhon + "', `noidung` = 'CÂN CỬA TÀI XỈU #" + cuoc[j].code + "'", function (err3, insersodu) {
                                    /* Update tiền */
                                    mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '" + xiuhon + "' WHERE `id` = '" + users.id + "'", function (err4, updateusersdone) {
                                        game.x -= +xiuhon;
                                        cuoc[j].hoantra += +xiuhon;
                                        cuoc[j].xu -= +xiuhon;
                                        io.to({
                                            vang: users.xu + xiuhon,
                                            nguoichoi_taixiu: {
                                                cx: tiencuoc(users.id, 'xiu'),
                                                ct: tiencuoc(users.id, 'tai'),
                                            }
                                        }, users.id)
                                        cancua(); // callback cân cửa
                                    })
                                })
                            })
                        }
                    }
                })
            }

        }
    }
}

let Bottx = function () {
    mysqli.query("SELECT * FROM `config` WHERE `value` = 'bot_tx_cuoc'", function (err, ggggg) {
        ggggg.forEach(config => {
            if (+config.data > 0) {
                mysqli.query("SELECT * FROM `config` WHERE `value` = 'tile_tx'", function (hhhh, hhhh) {
                    hhhh.forEach(tile => {
                        if (+tile.data >= checkstring.rand(1, 100)) {
                            console.log('select1')
                            let xucuoc = +config.data * checkstring.rand(1, 10);
                            xucuoc = Math.round(xucuoc)
                            console.log(xucuoc)
                            /* lấy BOT */
                            mysqli.query("SELECT * FROM `bot` WHERE `taixiu` = '0' ORDER BY rand() LIMIT 1", function (fghg, laybot) {
                                laybot.forEach(bot => {
                                    mysqli.query("UPDATE `bot` SET `taixiu` = '1' WHERE `id` = '" + bot.id + "'", function (fghfgh, updarebot) {
                                        let type = checkstring.rand(1, 18) >= 11 ? 'tai' : 'xiu';
                                        mysqli.query("INSERT INTO `cuoc_taixiu` SET `phien` = '" + game.id + "', `uid` = '" + bot.uid + "', `cuachon` = '" + type + "', `xucuoc` = '" + xucuoc + "', `thoigian` = '" + checkstring.time().thoigian + "'", function (dhgh, insertID) {
                                            if (type == 'tai') game.at += 1;
                                            else game.ax += 1;
                                            if (type == 'tai') game.t += xucuoc;
                                            else game.x += xucuoc;
                                            cuoc.push({ id: bot.uid, xu: xucuoc, type: type, hoantra: 0, game: 'taixiu', code: insertID.insertId, name: 'bot' });
                                        })
                                    })
                                });
                            })
                        }
                    });
                })
            }
        });
    })
}
let timegift = 0;
let Botgift = function () {
    let ma = 'N' + checkstring.az(5) + '-G' + checkstring.az(4) + '-H' + checkstring.az(3) + '-I' + checkstring.az(4) + '-A' + checkstring.az(5) + '';
    let value = checkstring.rand(5000,20000);
    mysqli.query("INSERT INTO `giftcode` SET `value` = '" + value + "', `text` = '" + ma + "'", function (err, update) {
        let noidung = 'Giftcode 15 phút với mức thưởng là '+checkstring.number_format(value)+' xu: <code>'+ma+'</code>.';
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

        });
    })
}

let GameTaiXiu = function () {
    
    startgame(); // tiến hành chạy phiên
    let Rungame = setInterval(function () {
        if (timegift == 600) {
            tinegift = 0;
            Botgift();
        }
        timegift++;
        game.b--; // thời gian chạy phiên
        game.a--; // thời gian chờ phiên
        /* sén res admin */
        let chan = [];
        io.admin(
            {
                phientxx:
                {
                    r: game.id,
                    a: game.a,
                    b: game.b,
                    bc1: checkstring.numberPad(game.bc1),
                    bc2: checkstring.numberPad(game.bc2),
                    bc3: checkstring.numberPad(game.bc3),
                    bc4: checkstring.numberPad(game.bc4),
                    bc5: checkstring.numberPad(game.bc5),
                    bc6: checkstring.numberPad(game.bc6),
                    xocdia: chan,
                    at: game.at,
                    ax: game.ax,
                    t: game.t,
                    x: game.x,
                    trangthai: game.trangthai,
                    c1: game.c1,
                    c2: game.c2,
                    c3: game.c3,
                    c4: game.c4,
                    c5: game.c5,
                    b1: game.b1,
                    b2: game.b2,
                    b3: game.b3,
                    x1: game.x1,
                    x2: game.x2,
                    x3: game.x3
                },
                cuoctx: cuoc,
            }
        );
        /* ducnghia */
        /* Game status hoàn thành, set new phiên mới */
        if (game.trangthai == 'hoanthanh' && game.a <= 0) {
            game.id += 1;
            game.t = 0;
            game.x = 0;
            game.at = 0;
            game.ax = 0;
            game.b = time;
            game.trangthai = "dangchay";
            game.bc1 = 0;
            game.bc2 = 0;
            game.bc3 = 0;
            game.bc4 = 0;
            game.bc5 = 0;
            game.bc6 = 0;
            game.x1 = 0;
            game.x2 = 0;
            game.x3 = 0;
            game.b1 = 0;
            game.b2 = 0;
            game.b3 = 0;
            cuoc.slice(0).forEach(function (item) {
                cuoc.splice(cuoc.indexOf(item), 1);
            });

        }
        if (game.trangthai == "dangchay" && game.b > 5) {
            Bottx();
        }

        /* Game trạng thái đang chạy */
        if (game.trangthai != "ketqua" && game.trangthai != "hoanthanh") {
            io.all(
                {
                    r: game.id,
                    a: 20,
                    ducnghia: 'realtime',
                    b: game.b,
                    at: game.at,
                    ax: game.ax,
                    t: game.t,
                    x: game.x,
                    bc1: checkstring._formatMoneyVND(game.bc1),
                    bc2: checkstring._formatMoneyVND(game.bc2),
                    bc3: checkstring._formatMoneyVND(game.bc3),
                    bc4: checkstring._formatMoneyVND(game.bc4),
                    bc5: checkstring._formatMoneyVND(game.bc5),
                    bc6: checkstring._formatMoneyVND(game.bc6),
                });
        }

        /* Game trạng thái hoàn thành chờ tạo phiên mới */
        if (game.trangthai == "hoanthanh") {
            io.all({
                r: game.id,
                ducnghia: 'realtime',
                a: game.a,
                b: 0,
                at: game.at,
                ax: game.ax,
                t: game.t,
                x: game.x,
                bc1: checkstring._formatMoneyVND(game.bc1),
                bc2: checkstring._formatMoneyVND(game.bc2),
                bc3: checkstring._formatMoneyVND(game.bc3),
                bc4: checkstring._formatMoneyVND(game.bc4),
                bc5: checkstring._formatMoneyVND(game.bc5),
                bc6: checkstring._formatMoneyVND(game.bc6),
            });

        }
        /* hết thời gian chạy và tiến hành cân cửa */
        if (+game.b <= 0 && game.trangthai == "dangchay") {
            game.trangthai = 'dangtinh';
            cancua();
        }

        /* Game trạng thái có kết quả, insert */
        if (game.trangthai == "ketqua") {
            io.all(
                {
                    roll: game.id,
                    ducnghia: 'char',
                    a: game.a,
                    b: 1,
                    xn1: game.x1,
                    xn2: game.x2,
                    xn3: game.x3,
                    xn4: game.x1 + game.x2 + game.x3,
                    color: (game.x1 + game.x2 + game.x3 <= 10 ? 'xiu-wrap' : 'tai-wrap'),
                    bc1: game.b1,
                    bc2: game.b2,
                    bc3: game.b3,
                }
            );
            game.trangthai = "hoanthanh";
            game.a = 20;
            mysqli.query("INSERT INTO `phien_taixiu` SET `phien` = '" + game.id + "', `x1` = '" + game.x1 + "', `x2` = '" + game.x2 + "', `x3` = '" + game.x3 + "', `thoigian` = '" + checkstring.time().thoigian + "'", function (err, Insertphien) {
                if (err) throw err;
                let ketqua = (game.x1 + game.x2 + game.x3) >= 11 ? 'tai' : 'xiu';
                thanhtoan(ketqua, game.id);
                mysqli.query("UPDATE `bot` SET `taixiu` = '0'")
                /*
                mysqli.query("SELECT * FROM `phien_taixiu` ORDER BY `phien` DESC LIMIT 13", function (err, phien) {
                    let array = [];
                    phien.forEach(e => {
                        array.push({
                            id: e.phien,
                            x1: e.x1,
                            x2: e.x2,
                            x3: e.x3,
                        })
                    });
                    io.all({
                        phientruoc: {
                            list: array,
                        }
                    })
                    
                })
                */

            })


        }
        Promise.all([new Promise((call, res) => {
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `time_online` >= '" + checkstring.time().thoigian + "'", function (err, users) {
                let array = [];
                if (err) throw err;
                users.forEach(e => {
                    array.push({
                        id: e.id,
                        name: e.name,
                        username: e.taikhoan,
                        vang: checkstring.number_format(e.xu),
                    })
                });
                call(array)
            })
        })
        ]).then(e => {
            io.admin({
                online:
                {
                    list: e[0],
                    online: global['TOTALONLINE'],

                }
            })
        })
    }, 1000)
    return Rungame;
}

let thanhtoan = function (ketqua, gamephien) {
    mysqli.query("SELECT * FROM `cuoc_taixiu` WHERE `trangthai` = '0' AND `phien` = '" + gamephien + "'", function (err2, toall) {
        toall.forEach(obj => {
            mysqli.query("SELECT `id`, `xu`, `thongtin` FROM `nguoichoi` WHERE `id` = '" + obj.uid + "'", function (err4, users) {
                if (err4) throw err4;
                if (users.length >= 1) {
                    users = users[0];
                    let win = obj.xucuoc * 1.90;
                    if (obj.cuachon != ketqua) win = 0;
                    /* xử lý bang hội */
                    mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+users.id+"'",function(xcv,banghoitv){
                        if(banghoitv.length >=1)
                        {
                            banghoitv = banghoitv[0];
                            mysqli.query("UPDATE `banghoi_thanhvien` SET `thanhtich` = `thanhtich` + '"+obj.xucuoc+"' WHERE `id` = '"+banghoitv.id+"'",function(xcvxvc,asdas){
                                mysqli.query("UPDATE `banghoi` SET `xu` = `xu` + '"+obj.xucuoc+"', `exp` = `exp` + '"+obj.xucuoc+"' WHERE `id` = '"+banghoitv.bang+"'")
                            });
                        }
                    })
                    mysqli.query("UPDATE `cuoc_taixiu` SET `xunhan` = '" + win + "', `trangthai` = '1' WHERE `id` = '" + obj.id + "'", function (err6, updatecuoc) {
                        /* thắng */
                        users.thongtin = JSON.parse(users.thongtin);
                        users.thongtin.choigame = +users.thongtin.choigame > 0 ? +users.thongtin.choigame+1 : 1;
                        if (obj.cuachon == ketqua && win >= 1) {
                            users.thongtin.taixiu_thang_chuoi = +users.thongtin.taixiu_thang_chuoi > 0 ? +users.thongtin.taixiu_thang_chuoi + 1 : 1;
                            users.thongtin.taixiu_thua_chuoi = 0;
                            /* Nhiệm vụ bang hội */
                            mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+obj.uid+"' LIMIT 1",function(xcv,nhiemvu){
                                if(nhiemvu.length >=1)
                                {
                                    nhiemvu = nhiemvu[0];
                                    if(nhiemvu.type == "taixiu_thang")
                                    {
                                        mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'1' WHERE `id` = '"+nhiemvu.id+"'");
                                    }
                                    if(nhiemvu.type == "taixiu_thangvang")
                                    {
                                        mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'"+win+"' WHERE `id` = '"+nhiemvu.id+"'");
                                    }
                                    if(nhiemvu.type == "taixiu_chuoithang" && users.thongtin.taixiu_thang_chuoi > nhiemvu.MIN)
                                    {
                                        mysqli.query("UPDATE `banghoi_data` SET `MIN` = '"+users.thongtin.taixiu_thang_chuoi+"' WHERE `id` = '"+nhiemvu.id+"'");
                                    }
                                }
                            })
                            users.thongtin.taixiu_thang = +users.thongtin.taixiu_thang > 0 ? +users.thongtin.taixiu_thang + obj.xucuoc * 0.90 : obj.xucuoc * 0.90;
                            mysqli.query("INSERT INTO `sodu` SET `nguon` = 'cuoc_taixiu', `key` = '" + obj.id + "', `uid` = '" + users.id + "', `truoc` = '" + users.xu + "', `sau` = '" + (users.xu + win) + "', `thoigian` = '" + checkstring.time().thoigian + "', `xu` = '" + win + "', `noidung` = 'THẮNG TÀI XỈU #" + obj.phien + "'", function (hdghgfd, insertsodu) {
                                mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '" + win + "', `thongtin` = '" + JSON.stringify(users.thongtin) + "', `thang_taixiu` = `thang_taixiu` + '"+(obj.xucuoc * 0.90)+"' WHERE `id` = '" + obj.uid + "'", function (hfgfgh, updatexune) {
                                    io.to({
                                        vang: users.xu + win
                                    }, obj.uid)
                                    thanhtoan(ketqua, gamephien);
                                })
                            })
                        }
                        else {
                            users.thongtin.taixiu_thua_chuoi = +users.thongtin.taixiu_thua_chuoi > 0 ? +users.thongtin.taixiu_thua_chuoi + 1 : 1;
                            users.thongtin.taixiu_thang_chuoi = 0;
                            /* Nhiệm vụ bang hội */
                            mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+obj.uid+"' LIMIT 1",function(xcv,nhiemvu){
                                if(nhiemvu.length >=1)
                                {
                                    nhiemvu = nhiemvu[0];
                                    if(nhiemvu.type == "taixiu_thua")
                                    {
                                        mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'1' WHERE `id` = '"+nhiemvu.id+"'");
                                    }
                                    if(nhiemvu.type == "taixiu_thuavang")
                                    {
                                        mysqli.query("UPDATE `banghoi_data` SET `MIN` = `MIN` +'"+obj.xucuoc+"' WHERE `id` = '"+nhiemvu.id+"'");
                                    }
                                    if(nhiemvu.type == "taixiu_chuoithua" && users.thongtin.taixiu_thua_chuoi > nhiemvu.MIN)
                                    {
                                        mysqli.query("UPDATE `banghoi_data` SET `MIN` = '"+users.thongtin.taixiu_thua_chuoi+"' WHERE `id` = '"+nhiemvu.id+"'");
                                    }
                                }
                            })
                            users.thongtin.taixiu_thua = +users.thongtin.taixiu_thua > 0 ? +users.thongtin.taixiu_thua + obj.xucuoc : obj.xucuoc;
                            console.log(users.thongtin)
                            mysqli.query("UPDATE `nguoichoi` SET  `thongtin` = '" + JSON.stringify(users.thongtin) + "', `thua_taixiu` = `thua_taixiu` + '"+obj.xucuoc+"' WHERE `id` = '" + obj.uid + "'", function (fhfhg, updateusers) {
                                thanhtoan(ketqua, gamephien);
                            })
                        }

                    })
                }
            })
        });
    })
}


module.exports = init;
