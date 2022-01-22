let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let sodu = require('../../Model/users/sodu');
let info = require('../../Model/users/info');
let chatcay = require('../../Model/BaCay/chat');

let init = function init(obj){
	io = obj;
	Since04_Bacay();
}

let valuediem = function(v)
{
    return chatcay.find(e => +e.id == +v).value;
}

let Since04_Bacay = function()
{  
    let Playergame = setInterval(function()
    {
        /* With game */
        mysqli.query("SELECT * FROM `3cay_room`",function(err,showbox) {
            if(err) throw err;
            showbox.forEach(game => {
                let noidung = "";
                /**
                 * status 0 => chưa bắt đầu
                 * status 1 => đang bắt đầu
                  */
                /// trạng thái thiếu người chơi và chưa bắt đầu trần
                if(game.player2 <=0 && game.status == 0)
                {
                    let dataplayer1 = game.value_1.split(",");
                    let showplayer1 = game.evalue_1.split(",");
                    let dataplayer2 = game.value_2.split(",");
                    let showplayer2 = game.evalue_2.split(",");
                    let diemu1 = 0;
                    let diemu2 = 0;
                    diemu1+=  +showplayer1[0] ==0 ? 0 : +valuediem(dataplayer1[0]);
                    diemu1+=  +showplayer1[1] ==0 ? 0 : +valuediem(dataplayer1[1]);
                    diemu1+=  +showplayer1[2] ==0 ? 0 : +valuediem(dataplayer1[2]);
                    diemu2+=  +showplayer2[0] ==0 ? 0 : +valuediem(dataplayer2[0]);
                    diemu2+=  +showplayer2[1] ==0 ? 0 : +valuediem(dataplayer2[1]);
                    diemu2+=  +showplayer2[2] ==0 ? 0 : +valuediem(dataplayer2[2]);
                    let tongdiem1_a = String(diemu1);
                    let tongdiem1 = tongdiem1_a[tongdiem1_a.length-1] >> 0;
                    let tongdiem2_a = String(diemu2);
                    let tongdiem2 = tongdiem2_a[tongdiem2_a.length-1] >> 0;
                    tongdiem1 = tongdiem1 == 0 ? 10 : tongdiem1;
                    tongdiem2 = tongdiem2 == 0 ? 10 : tongdiem2;
                    mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+game.id+"'",function(err2,ki) {
                        if(err2) throw err2;
                        ki.forEach(socketid => {
                            io.to({
                                BaCay : {
                                    Room : game.id,
                                    RoomName : game.name,
                                    player1 : game.player1,
                                    player1_name : game.name_1,
                                    diem1 : tongdiem1,
                                    diem2 : tongdiem2,
                                    play1 : {
                                        la1 : +showplayer1[0] ==0 ? 0 : +dataplayer1[0],
                                        la2 : +showplayer1[1] ==0 ? 0 : +dataplayer1[1],
                                        la3 : +showplayer1[2] ==0 ? 0 : +dataplayer1[2]
                                    },
                                    play2 : {
                                        la1 : +showplayer2[0] ==0 ? 0 : +dataplayer2[0],
                                        la2 : +showplayer2[1] ==0 ? 0 : +dataplayer2[1],
                                        la3 : +showplayer2[2] ==0 ? 0 : +dataplayer2[2]
                                    },
                                    player2 : game.player2,
                                    player2_name : game.name_2,
                                    cuoc : game.cuoc,
                                    noidung : "Chờ người chơi vào...",
                                    views : ki,
                                }
                            },socketid.uid)
                        });
                    })
                }
                else 
                if(game.isrun == 0 && game.status == 0)
                {
                    let dataplayer1 = game.value_1.split(",");
                    let showplayer1 = game.evalue_1.split(",");
                    let dataplayer2 = game.value_2.split(",");
                    let showplayer2 = game.evalue_2.split(",");
                    let diemu1 = 0;
                    let diemu2 = 0;
                    diemu1+=  +showplayer1[0] ==0 ? 0 : +valuediem(dataplayer1[0]);
                    diemu1+=  +showplayer1[1] ==0 ? 0 : +valuediem(dataplayer1[1]);
                    diemu1+=  +showplayer1[2] ==0 ? 0 : +valuediem(dataplayer1[2]);
                    diemu2+=  +showplayer2[0] ==0 ? 0 : +valuediem(dataplayer2[0]);
                    diemu2+=  +showplayer2[1] ==0 ? 0 : +valuediem(dataplayer2[1]);
                    diemu2+=  +showplayer2[2] ==0 ? 0 : +valuediem(dataplayer2[2]);
                    let tongdiem1_a = String(diemu1);
                    let tongdiem1 = tongdiem1_a[tongdiem1_a.length-1] >> 0;
                    let tongdiem2_a = String(diemu2);
                    let tongdiem2 = tongdiem2_a[tongdiem2_a.length-1] >> 0;
                    tongdiem1 = tongdiem1 == 0 ? 10 : tongdiem1;
                    tongdiem2 = tongdiem2 == 0 ? 10 : tongdiem2;
                    mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+game.id+"'",function(err2,ki) {
                        if(err2) throw err2;
                        ki.forEach(socketid => {
                            io.to({
                                BaCay : {
                                    diem1 : tongdiem1,
                                    diem2 : tongdiem2,
                                    Room : game.id,
                                    RoomName : game.name, 
                                    player1 : game.player1,
                                    player1_name : game.name_1,
                                    play1 : {
                                        la1 : +showplayer1[0] ==0 ? 0 : +dataplayer1[0],
                                        la2 : +showplayer1[1] ==0 ? 0 : +dataplayer1[1],
                                        la3 : +showplayer1[2] ==0 ? 0 : +dataplayer1[2]
                                    },
                                    play2 : {
                                        la1 : +showplayer2[0] ==0 ? 0 : +dataplayer2[0],
                                        la2 : +showplayer2[1] ==0 ? 0 : +dataplayer2[1],
                                        la3 : +showplayer2[2] ==0 ? 0 : +dataplayer2[2]
                                    },
                                    player2 : game.player2,
                                    player2_name : game.name_2,
                                    cuoc : game.cuoc,
                                    noidung : "Chờ "+game.name_2+" sẵn sàng.",
                                    sansang : game.player2,
                                    views : ki,
                                }
                            },socketid.uid)
                        });
                    })
                    
                }
                else 
                if(game.isrun == 1 && game.status <=0)
                {
                    let dataplayer1 = game.value_1.split(",");
                    let showplayer1 = game.evalue_1.split(",");
                    let dataplayer2 = game.value_2.split(",");
                    let showplayer2 = game.evalue_2.split(",");
                    let diemu1 = 0;
                    let diemu2 = 0;
                    diemu1+=  +showplayer1[0] ==0 ? 0 : +valuediem(dataplayer1[0]);
                    diemu1+=  +showplayer1[1] ==0 ? 0 : +valuediem(dataplayer1[1]);
                    diemu1+=  +showplayer1[2] ==0 ? 0 : +valuediem(dataplayer1[2]);
                    diemu2+=  +showplayer2[0] ==0 ? 0 : +valuediem(dataplayer2[0]);
                    diemu2+=  +showplayer2[1] ==0 ? 0 : +valuediem(dataplayer2[1]);
                    diemu2+=  +showplayer2[2] ==0 ? 0 : +valuediem(dataplayer2[2]);
                    let tongdiem1_a = String(diemu1);
                    let tongdiem1 = tongdiem1_a[tongdiem1_a.length-1] >> 0;
                    let tongdiem2_a = String(diemu2);
                    let tongdiem2 = tongdiem2_a[tongdiem2_a.length-1] >> 0;
                    tongdiem1 = tongdiem1 == 0 ? 10 : tongdiem1;
                    tongdiem2 = tongdiem2 == 0 ? 10 : tongdiem2;
                    mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+game.id+"'",function(err2,ki) {
                        if(err2) throw err2;
                        ki.forEach(socketid => {
                            io.to({
                                BaCay : {
                                    diem1 : tongdiem1,
                                    diem2: tongdiem2,
                                    Room : game.id,
                                    RoomName : game.name,
                                    player1 : game.player1,
                                    player1_name : game.name_1,
                                    play1 : {
                                        la1 : +showplayer1[0] ==0 ? 0 : +dataplayer1[0],
                                        la2 : +showplayer1[1] ==0 ? 0 : +dataplayer1[1],
                                        la3 : +showplayer1[2] ==0 ? 0 : +dataplayer1[2]
                                    },
                                    play2 : {
                                        la1 : +showplayer2[0] ==0 ? 0 : +dataplayer2[0],
                                        la2 : +showplayer2[1] ==0 ? 0 : +dataplayer2[1],
                                        la3 : +showplayer2[2] ==0 ? 0 : +dataplayer2[2]
                                    },
                                    player2 : game.player2,
                                    player2_name : game.name_2,
                                    cuoc : game.cuoc,
                                    noidung : "Chờ chủ phòng bắt đầu.",
                                    start : game.player1,
                                    unsansang : game.player2,
                                    views : ki,
                                }
                            },socketid.uid)
                        });
                    })
                   
                }
                else 
                /// game trạng thái bắt đầu
                if(game.status == 1)
                {
                    let dataplayer1 = game.value_1.split(",");
                    let showplayer1 = game.evalue_1.split(",");
                    let dataplayer2 = game.value_2.split(",");
                    let showplayer2 = game.evalue_2.split(",");
                    let diemu1 = 0;
                    let diemu2 = 0;
                    diemu1+=  +showplayer1[0] ==0 ? 0 : +valuediem(dataplayer1[0]);
                    diemu1+=  +showplayer1[1] ==0 ? 0 : +valuediem(dataplayer1[1]);
                    diemu1+=  +showplayer1[2] ==0 ? 0 : +valuediem(dataplayer1[2]);
                    diemu2+=  +showplayer2[0] ==0 ? 0 : +valuediem(dataplayer2[0]);
                    diemu2+=  +showplayer2[1] ==0 ? 0 : +valuediem(dataplayer2[1]);
                    diemu2+=  +showplayer2[2] ==0 ? 0 : +valuediem(dataplayer2[2]);
                    let tongdiem1_a = String(diemu1);
                    let tongdiem1 = tongdiem1_a[tongdiem1_a.length-1] >> 0;
                    let tongdiem2_a = String(diemu2);
                    let tongdiem2 = tongdiem2_a[tongdiem2_a.length-1] >> 0;
                    tongdiem1 = tongdiem1 == 0 ? 10 : tongdiem1;
                    tongdiem2 = tongdiem2 == 0 ? 10 : tongdiem2;
                    mysqli.query("UPDATE `3cay_room` SET `time` = `time` - '1' WHERE `id` = '"+game.id+"'",function(erccr,update){
                        if(erccr) throw erccr;
                        if(game.time <= 4)
                        {
                            diemu1 = 0;
                            diemu2 = 0;
                            diemu1+=  +valuediem(dataplayer1[0]);
                            diemu1+=  +valuediem(dataplayer1[1]);
                            diemu1+=  +valuediem(dataplayer1[2]);
                            diemu2+=  +valuediem(dataplayer2[0]);
                            diemu2+=  +valuediem(dataplayer2[1]);
                            diemu2+=  +valuediem(dataplayer2[2]);
                            tongdiem1_a = String(diemu1);
                            tongdiem1 = tongdiem1_a[tongdiem1_a.length-1] >> 0;
                            tongdiem2_a = String(diemu2);
                            tongdiem2 = tongdiem2_a[tongdiem2_a.length-1] >> 0;
                            tongdiem1 = tongdiem1 == 0 ? 10 : tongdiem1;
                            tongdiem2 = tongdiem2 == 0 ? 10 : tongdiem2;
                            let noidung = "";
                            let win = 0;
                            if(tongdiem1 > tongdiem2) 
                            {
                                noidung = "<b>"+game.name_1+"</b> thắng với tổng <b>"+tongdiem1+"</b> điểm. Chờ "+game.time+"s.";
                                win = game.player1;
                            }
                            else if(tongdiem1 < tongdiem2)
                            {
                                noidung = "<b>"+game.name_2+"</b> thắng với tổng <b>"+tongdiem2+"</b> điểm. Chờ "+game.time+"s.";
                                win = game.player2;
                            }
                            else if(tongdiem1 == tongdiem2)
                            {
                                noidung = "2 bên có số điểm bằng nhau, hệ thống trừ 2% phí mỗi bên. Chờ "+game.time+"s.";
                                win = 0;
                            }
                            /* tính kết quả */
                            if(game.time == 4)
                            {
                                /// tiền hoà 0.97*cược;
                                /// tiền thắng 1.90* cược;
                                /* Update phiên */
                                mysqli.query("UPDATE `3cay_room` SET `evalue_1` = '1,1,1', `evalue_2` = '1,1,1'",function(dfgdfgdf,updatelan2){
                                    /* tạo dữ liệu phiên*/
                                    mysqli.query("UPDATE `3cay_data` SET `room` = '"+game.id+"', `cuoc` = '"+game.cuoc+"', `win` = '"+win+"', `thoigian` = '"+checkstring.time().thoigian+"', `player1` = '"+game.player1+"', `player2` = '"+game.player2+"', `value1` = '"+game.value_1+"', `value2` = '"+game.value_2+"' WHERE `id` = '"+game.data+"'",function(errdfg,dulieuis){
                                        /* dữ liệu thắng */
                                        if(errdfg) throw errdfg;
                                        /// nếu hoà
                                        if(win ==0)
                                        {
                                            let xunhan = Math.round(+game.cuoc*0.98);
                                            /* Update người chơi 1 */
                                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+game.player1+"'",function(hdfghfdgh,dfghfg){
                                                dfghfg.forEach(e => {
                                                    sodu(e.id,e.xu,xunhan,'HOÀ BA CÂY','3cay_data',game.data);
                                                    io.to({vang : e.xu+xunhan},e.id);
                                                });
                                            })
                                            /* Update người chơi 2 */
                                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+game.player2+"'",function(hdfghfdgh,dfghfg){
                                                dfghfg.forEach(e => {
                                                    sodu(e.id,e.xu,xunhan,'HOÀ BA CÂY','3cay_data',game.data);
                                                    io.to({vang : e.xu+xunhan},e.id);
                                                });
                                            })
                                        }
                                        else 
                                        {
                                            /* Thằng */
                                            let xunhan = Math.round(+game.cuoc*1.95);
                                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+win+"'",function(hdfghfdgh,dfghfg){
                                                dfghfg.forEach(e => {
                                                    let play = JSON.parse(e.thongtin);
                                                    play.bacay_xuthang = (play.bacay_xuthang > 0 ? play.bacay_xuthang : 0) + game.cuoc*0.90;
                                                    play.bacay_thang = (play.bacay_thang > 0 ? play.bacay_thang : 0) + 1;
                                                    mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(play)+"' WHERE `id` = '"+e.id+"'",function(dfsg,dgh){
                                                        sodu(e.id,e.xu,xunhan,'THẮNG BA CÂY','3cay_data',game.data);
                                                        io.to({vang : e.xu+xunhan},e.id);
                                                    })
                                
                                                });
                                            })
                                            /* thua */
                                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+(win == game.player1 ? game.player2 : game.player1)+"'",function(hdfghfdgh,dfghfg){
                                                dfghfg.forEach(e => {
                                                    let play = JSON.parse(e.thongtin);
                                                    play.bacay_xuthua = (play.bacay_xuthua > 0 ? play.bacay_xuthua : 0) + game.cuoc*1;
                                                    play.bacay_thua = (play.bacay_thua > 0 ? play.bacay_thua : 0) + 1;
                                                    mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(play)+"' WHERE `id` = '"+e.id+"'",function(dfsg,dgh){

                                                    })
                                
                                                });
                                            })
                                        }
                                    })
                                })
                            }
                            /* Cập nhật phiên mới, remove trạng thái */
                            if(game.time <=0)
                            {
                                mysqli.query("UPDATE `3cay_room` SET `status` = '0', `isrun` = '0' WHERE `id` = '"+game.id+"'",function(sdfgdf,udate){

                                })
                            }
                            mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+game.id+"'",function(err2,ki) {
                                if(err2) throw err2;
                                ki.forEach(socketid => {
                                    io.to({
                                        BaCay : {
                                            diem1 : tongdiem1,
                                            diem2: tongdiem2,
                                            Room : game.id,
                                            RoomName : game.name,
                                            player1 : game.player1,
                                            player1_name : game.name_1,
                                            play1 : {
                                                la1 : +showplayer1[0] ==0 ? 0 : +dataplayer1[0],
                                                la2 : +showplayer1[1] ==0 ? 0 : +dataplayer1[1],
                                                la3 : +showplayer1[2] ==0 ? 0 : +dataplayer1[2]
                                            },
                                            play2 : {
                                                la1 : +showplayer2[0] ==0 ? 0 : +dataplayer2[0],
                                                la2 : +showplayer2[1] ==0 ? 0 : +dataplayer2[1],
                                                la3 : +showplayer2[2] ==0 ? 0 : +dataplayer2[2]
                                            },
                                            player2 : game.player2,
                                            player2_name : game.name_2,
                                            cuoc : game.cuoc,
                                            noidung : noidung,
                                            success : 1,
                                            views : ki,
                                        }
                                    },socketid.uid)
                                });
                            })
                        }
                        else 
                        
                        {
                            mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+game.id+"'",function(err2,ki) {
                                if(err2) throw err2;
                                ki.forEach(socketid => {
                                    io.to({
                                        BaCay : {
                                            diem1 : tongdiem1,
                                            diem2: tongdiem2,
                                            Room : game.id,
                                            RoomName : game.name,
                                            player1 : game.player1,
                                            player1_name : game.name_1,
                                            play1 : {
                                                la1 : +showplayer1[0] ==0 ? 0 : +dataplayer1[0],
                                                la2 : +showplayer1[1] ==0 ? 0 : +dataplayer1[1],
                                                la3 : +showplayer1[2] ==0 ? 0 : +dataplayer1[2]
                                            },
                                            play2 : {
                                                la1 : +showplayer2[0] ==0 ? 0 : +dataplayer2[0],
                                                la2 : +showplayer2[1] ==0 ? 0 : +dataplayer2[1],
                                                la3 : +showplayer2[2] ==0 ? 0 : +dataplayer2[2]
                                            },
                                            player2 : game.player2,
                                            player2_name : game.name_2,
                                            cuoc : game.cuoc,
                                            noidung : "Hãy lật bài... còn "+game.time+" giây...",
                                            views : ki,
                                        }
                                    },socketid.uid)
                                });
                            })
                        }
                    })
                }
            });
        })
    },1000);
    return Playergame;
}

module.exports = init;