var CronJob = require('cron').CronJob;
let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let sodu = require('../../Model/users/sodu');
let info = require('../../Model/users/info');

let action_bot = function(data)
{
    if(data.length >=1)
    {
        let id = data[0];
        mysqli.query("UPDATE `nguoichoi` SET `xu` = '0' WHERE `id` = '"+id+"'",function(sdf,update){
            data.slice(0).forEach(function (item) {
                if (+item == +id) {
                    data.splice(data.indexOf(item), 1);
                    action_bot(data)
                }
            });
        })
    }
}

let rebot = function()
{
    
    mysqli.query("SELECT * FROM `bot`",function(ss,d){
        let array = [];
        d.forEach(element => {
            array.push(element.uid)
        });
        action_bot(array);
    })
    let time = Date.now() - (24 * 7 * 60 * 60 * 1000);
    mysqli.query("SELECT * FROM `sodu` where `thoigian` <= '" + time + "'", function (loi4, toanbo) {
        toanbo.forEach(e => {
            mysqli.query("DELETE FROM `sodu` WHERE `id` = '" + e.id + "'", function (loi6, xoasodu) {
                if(e.key >=1 && e.nguon != 'thecao' && e.nguon != 'rutvang' && e.nguon != 'napvang' && e.nguon != 'momo' && e.nguon != 'thesieure')
                {
                    mysqli.query("DELETE FROM `" + e.nguon + "` WHERE `id` = '" + e.key + "'", function (loidd, xoatiep) {
                        if(loidd) throw loidd;
                        console.log(xoatiep)
                    })
                }
            })
        });
    })
    console.log('xóa')
    let time2 = Date.now() - (24 * 1 * 60 * 60 * 1000);
    mysqli.query("DELETE FROM `phien_taixiu` where `thoigian` <= '" + time2 + "'", function (loi4, toanbo) {})
    mysqli.query("DELETE FROM `phien` where `thoigian` <= '" + time2 + "'", function (loi4, toanbo) {})
}

let reset_csmm = function()
{
    mysqli.query("SELECT * FROM `cuoc` WHERE `trangthai` = '0' AND `server` != '999' LIMIT 1",function(err,data){
        if(err) throw err;
        if(data.length <=0)
        {
            //GameCSMM();
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
                                reset_csmm();
                            })
                        })
                    })
                });
            })
        });
    })
}

let topbang = function()
{
    mysqli.query("SELECT * FROM `banghoi` WHERE `top` >= '1' ORDER BY `top` ASC LIMIT 7",function(err,banghoi){
        let thuong = [0,500000,250000,100000,50000,30000,20000,10000];
        let i = 0;
        banghoi.forEach(bang => {
            i++;
            mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `bang` = '"+bang.id+"'",function(e2,men){
                men.forEach(u => {
                    mysqli.query("SELECT `xu` FROM `nguoichoi` WHERE `id` = '"+u.uid+"'",function(xcvx,users){
                        if(users.length >=1)
                        {
                            let xunhan = thuong[bang.top] * 1000;
                            users = users[0];
                            sodu(u.uid,users.xu,xunhan,'Thưởng Top #'+bang.top+' bang hội.')
                        }
                    })
                });
            })
        });
        mysqli.query("UPDATE `banghoi` SET `xu` = '0'")
        mysqli.query("UPDATE `banghoi_thanhvien` SET `thanhtich` = '0'")
    })
}
let job = new CronJob('0 0 * * *', function() {
    reset_csmm();
    /* TOP BANG HỘI */
    topbang();
    /* Top tổng */
    mysqli.query("SELECT *, thang_taixiu+thua_taixiu as tien FROM `nguoichoi` ORDER by tien DESC LIMIT 10",function(err,u){
        let i = 0;
        u.forEach(g => {
            i++;
            let thuong = [0,500000,250000,100000,50000,20000,10000,10000,10000,10000,10000,10000,10000];
                //sodu(g.id,g.xu,thuong[i],'TOP '+i+' tổng tiền chơi  tài xỉu ');
        });
    })
    mysqli.query("SELECT *, thang_csmm+thua_csmm as tien FROM `nguoichoi` ORDER by tien DESC LIMIT 10",function(err,u){
        let i = 0;
        u.forEach(g => {
            i++;
            let thuong = [0,500000,250000,100000,50000,20000,10000,10000,10000,10000,10000,10000,10000];
                sodu(g.id,g.xu,thuong[i]*1000,'TOP '+i+' tổng tiền chơi  tài xỉu ');
        });
    })
    /* Top thắng tx */
    mysqli.query("UPDATE `nguoichoi` SET `danhhieu` = '{}'",function(err,sfg){
        /* Top thắng */
        mysqli.query("SELECT `id`, `danhhieu`, `xu` FROM `nguoichoi` ORDER BY `thang_taixiu` DESC LIMIT 10",function(err,list){
            let i = 0;
            list.forEach(g => {
                i++;
                if(i <=3)
                {
                    g.danhhieu = JSON.parse(g.danhhieu);
                    g.danhhieu.thang_taixiu = i;
                    mysqli.query("UPDATE `nguoichoi` SET `danhhieu` = '"+JSON.stringify(g.danhhieu)+"' WHERE `id` = '"+g.id+"'");
                }
                //let thuong = [0,100000,50000,25000,10000,5000,5000,5000,5000,5000,5000,5000,5000];
                //sodu(g.id,g.xu,thuong[i],'TOP '+i+' thắng tài xỉu ');
            });
            mysqli.query("UPDATE `nguoichoi` SET `thang_taixiu` = '0'");
        })
        /* Thua tx */
        mysqli.query("SELECT `id`, `danhhieu`, `xu` FROM `nguoichoi` ORDER BY `thua_taixiu` DESC LIMIT 10",function(err,list){
            let i = 0;
            list.forEach(g => {
                i++;
                if(i <=3)
                {
                    g.danhhieu = JSON.parse(g.danhhieu);
                    g.danhhieu.thua_taixiu = i;
                    mysqli.query("UPDATE `nguoichoi` SET `danhhieu` = '"+JSON.stringify(g.danhhieu)+"' WHERE `id` = '"+g.id+"'");
                }
                //let thuong = [0,100000,50000,25000,10000,5000,5000,5000,5000,5000,5000,5000,5000];
                //sodu(g.id,g.xu,thuong[i],'TOP '+i+' thua tài xỉu ');
            });
            mysqli.query("UPDATE `nguoichoi` SET `thua_taixiu` = '0'");
        })
        /* thua csmm */
        mysqli.query("SELECT `id`, `danhhieu`, `xu` FROM `nguoichoi` ORDER BY `thua_csmm` DESC LIMIT 10",function(err,list){
            let i = 0;
            list.forEach(g => {
                i++;
                if(i <=3)
                {
                    g.danhhieu = JSON.parse(g.danhhieu);
                    g.danhhieu.thua_chanle = i;
                    mysqli.query("UPDATE `nguoichoi` SET `danhhieu` = '"+JSON.stringify(g.danhhieu)+"' WHERE `id` = '"+g.id+"'");
                }
                let thuong = [0,100000,50000,25000,10000,5000,5000,5000,5000,5000,5000,5000,5000];
                //sodu(g.id,g.xu,thuong[i],'TOP '+i+' thua CSMM ');
            });
            mysqli.query("UPDATE `nguoichoi` SET `thua_csmm` = '0'");
        })
        /* thắng */
        mysqli.query("SELECT `id`, `danhhieu`, `xu` FROM `nguoichoi` ORDER BY `thang_csmm` DESC LIMIT 10",function(err,list){
            let i = 0;
            list.forEach(g => {
                i++;
                if(i <=3)
                {
                    g.danhhieu = JSON.parse(g.danhhieu);
                    g.danhhieu.thang_chanle = i;
                    mysqli.query("UPDATE `nguoichoi` SET `danhhieu` = '"+JSON.stringify(g.danhhieu)+"' WHERE `id` = '"+g.id+"'");
                }
                let thuong = [0,100000,50000,25000,10000,5000,5000,5000,5000,5000,5000,5000,5000];
                //sodu(g.id,g.xu,thuong[i],'TOP '+i+' thắng CSMM ');
            });
            mysqli.query("UPDATE `nguoichoi` SET `thang_csmm` = '0'");
        })
    });
}, null, true, 'Asia/Ho_Chi_Minh');



let ResetBOT = new CronJob('*/5 * * * *', function() {
  rebot();
}, null, true, 'Asia/Ho_Chi_Minh');


job.start();
ResetBOT.start();


