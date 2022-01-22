let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');
let sodu = require('../../../Model/users/sodu');
let chatcay = require('../../../Model/BaCay/chat');


let loadphong  = function(client,data,socket)
{
    mysqli.query("SELECT * FROM `3cay_room` ORDER BY `id` DESC",function(err,cc){
        if(err) throw err;
        let array = [];
        cc.forEach(obj => {
            array.push({
                id : obj.id,
                NameRoom : obj.name,
                time : obj.timecho,
                Player1 : obj.name_1,
                Player2 : obj.player2 >0 ? obj.name_2 : 'Chờ',
                Cuoc : obj.cuoc,
                Full : obj.player2 > 0 ? 1 : 0,
            })
        });
        socket.all({
            BaCayRoom : {
                data : array,
            }
        })
    })
}

let TaoRoom = function(client,data,socket)
{
    let xu = data.TienCuoc >> 0;
    let name = checkstring.html(data.Name);
    let time = data.time >> 0;
    if(client.id <=0)
    {
        client.dn({
            msg : "Chưa đăng nhập bạn ơi",
            type : 'info',
            loading : -1,
        })
    }
    else 
    if(xu < 1000 || xu > 500000000)
    {
        client.dn({
            msg : "xu cược tối thiểu 1.000 xu nhỏ hơn 500tr",
            type : 'warning',
            loading : -1,
        })
    }
    else 
    {
        Promise.all([
            new Promise ((res,fai)=> {
                mysqli.query("SELECT * FROM `3cay_users` WHERE `uid` = '"+client.id+"'",function(err,show){
                    if(err) throw err;
                    res(show.length)
                })
            }),
            new Promise( (res,fai)=> {
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,show){
                    if(err) throw err;
                    if(show.length >=1) res(show[0]);
                    else res(0);
                })
            })
        ]).then(e => {
            let checkrom = e[0];
            let xumy = e[1];
            if(checkrom >=1)
            {
                client.dn({
                    msg : 'Tạo phòng thất bại ! Bạn đã đang ở 1 bàn khác chế độ người chơi hoặc quan sát, vui lòng thoát bàn..',
                    type : 'info',
                    loading : -1,
                    vang  : xumy.xu,
                })
            }
            else 
            if(xumy.xu < xu)
            {
                client.dn({
                    msg : "Tài khoản bạn không đủ xu để tạo phòng",
                    type : "info", 
                    loading : -1,
                    vang : xumy.xu,
                })
            }
            else  
            {
                /* Creaft phòng */
                mysqli.query("INSERT INTO `3cay_room` SET `timecho` = '"+time+"',`name` = '"+name+"', `player1` = '"+client.id+"', `name_1` = '"+xumy.name+"', `cuoc` = '"+xu+"'",function(err,insert){
                    if(err) throw err;
                    mysqli.query("INSERT INTO `3cay_users` SET `uid` = '"+client.id+"', `room` = '"+insert.insertId+"', `thoigian` = '"+checkstring.time().thoigian+"',`avatar` = '"+(JSON.parse(xumy.thongtin)).avatar+"', `name` = '"+xumy.name+"', `type` = '1'",function(err2,insert2){
                        if(err2) throw err2;
                        client.dn({
                            TaoPhong : true,
                            Realid : insert.insertId,
                            time : Date.now(),
                            loading : -1,
                        })
                        loadphong(client,{},socket);
                    })
                })
            }
        })
    }
}

let play = function(client,data,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập',
            type : 'info'
        })
    }
    else 
    {
        let id = data.id >> 0;
        Promise.all([
            new Promise ( (res,fai) => {
                mysqli.query("SELECT * FROM `3cay_room` WHERE `id` = '"+id+"'",function(err,d){
                    if(err) throw err;
                    if(d.length >=1) res(d[0]);
                    else res(0);
                })
            }),
            new Promise ( (res,fai) => {
                mysqli.query("SELECT * FROM `3cay_users` WHERE `uid` = '"+client.id+"'",function(err,d){
                    if(err) throw err;
                    res(d.length);
                })
            }),
            new Promise ( (res,fai) => {
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,d){
                    if(err) throw err;
                    if(d.length >=1) res(d[0]);
                    else res(0);
                })
            })
        ]).then(e => {
            let room = e[0];
            let uroom = e[1];
            let users = e[2];
            if(uroom != 0)
            {
                client.dn({
                    msg : 'Bạn đã tham gia phòng khác nên không được vào',
                    type : 'info',
                    loading : -1,
                })
            }
            else 
            if(room ==0)
            {
                client.dn({
                    msg : 'Phòng không tồn tại hoặc đã bị huỷ.',
                    type : 'info',
                    loading : -1,
                })
            }
            else 
            if(room.player2 >=1)
            {
                client.dn({
                    msg : 'Phòng đã đầy người không thể vào.',
                    type : 'info',
                    loading : -1,
                })
            }
            else 
            if(users.xu < room.cuoc)
            {
                client.dn({
                    msg : 'Bạn không có đủ tiền để vào phòng này',
                    type : 'info',
                    loading : -1,
                })
            }
            else 
            {
                mysqli.query("UPDATE `3cay_room` SET `player2` = '"+users.id+"', `name_2` = '"+users.name+"' WHERE `id` = '"+room.id+"'",function(err,updte){
                    if(err) throw err;
                    mysqli.query("INSERT INTO `3cay_users` SET `uid` = '"+client.id+"', `thoigian` = '"+checkstring.time().thoigian+"', `room` = '"+room.id+"', `avatar` = '"+(JSON.parse(users.thongtin)).avatar+"', `name` = '"+users.name+"', `type` = '1'",function(err,insert){
                        client.dn({
                            TaoPhong : true,
                            Realid : insert.insertId,
                            time : Date.now(),
                            loading : -1,
                        })
                        mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+room.id+"'",function(roomerr,datarom){
                            datarom.forEach(e => {
                                socket.to({chatroom : {name : 'Hệ thống', avatar : '/vendor/avatar/avatar.png', msg : ''+users.name+' tham gia chơi phòng.'}},e.uid);
                            });
                        })
                        loadphong(client,{},socket);
                    })
                })
            }
        })
    }
}

let view = function(client,data,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập',
            type : 'info'
        })
    }
    else 
    {
        let id = data.id >> 0;
        Promise.all([
            new Promise ( (res,fai) => {
                mysqli.query("SELECT * FROM `3cay_room` WHERE `id` = '"+id+"'",function(err,d){
                    if(err) throw err;
                    if(d.length >=1) res(d[0]);
                    else res(0);
                })
            }),
            new Promise ( (res,fai) => {
                mysqli.query("SELECT * FROM `3cay_users` WHERE `uid` = '"+client.id+"'",function(err,d){
                    if(err) throw err;
                    res(d.length);
                })
            }),
            new Promise ( (res,fai) => {
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,d){
                    if(err) throw err;
                    if(d.length >=1) res(d[0]);
                    else res(0);
                })
            })
        ]).then(e => {
            let room = e[0];
            let uroom = e[1];
            let users = e[2];
            if(uroom != 0)
            {
                client.dn({
                    msg : 'Bạn đã tham gia phòng khác nên không được vào',
                    type : 'info',
                    loading : -1,
                })
            }
            else 
            if(room ==0)
            {
                client.dn({
                    msg : 'Phòng không tồn tại hoặc đã bị huỷ.',
                    type : 'info',
                    loading : -1,
                })
            }
            
            else {
                mysqli.query("INSERT INTO `3cay_users` SET `uid` = '" + client.id + "', `thoigian` = '" + checkstring.time().thoigian + "', `room` = '" + room.id + "', `avatar` = '"+(JSON.parse(users.thongtin)).avatar+"', `name` = '"+users.name+"', `type` = '0'", function (err, insert) {
                    client.dn({
                        TaoPhong: true,
                        Realid: insert.insertId,
                        time: Date.now(),
                        loading: -1,
                    })
                    mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+room.id+"'",function(roomerr,datarom){
                        datarom.forEach(e => {
                            socket.to({chatroom : {name : 'Hệ thống', avatar : '/vendor/avatar/avatar.png', msg : ''+users.name+' tham gia quan sát phòng.'}},e.uid);
                        });
                    })
                    loadphong(client, {}, socket);
                })

            }
        })
    }
}
let daobai = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }  return array;
}

let taobai = function(client,data,socket)
{
    let room = data.room;
    mysqli.query("SELECT * FROM `3cay_room` WHERE `id` = '"+room+"'",function(err,kkk){
        if(err) throw err;
        kkk.forEach(room => {
            let baiu1 = room.value_1.split(",");
            let baiu2 = room.value_2.split(",");
            let traibao1=[{id:1,value:1,},{id:2,value:2,},{id:3,value:3,},{id:4,value:4,},{id:5,value:5,},{id:6,value:6,},{id:7,value:7,},{id:8,value:8,},{id:9,value:9,},{id:14,value:1,},{id:15,value:2,},{id:16,value:3,},{id:17,value:4,},{id:18,value:5,},{id:19,value:6,},{id:20,value:7,},{id:21,value:8,},{id:22,value:9,},{id:27,value:1,},{id:28,value:2,},{id:29,value:3,},{id:30,value:4,},{id:31,value:5,},{id:32,value:6,},{id:33,value:7,},{id:34,value:8,},{id:35,value:9,},{id:40,value:1,},{id:41,value:2,},{id:42,value:3,},{id:43,value:4,},{id:44,value:5,},{id:45,value:6,},{id:46,value:7,},{id:47,value:8,},{id:48,value:9,},]
            /* Xoá bài đã tồn tại */
            baiu1.forEach(remove1 => {
                traibao1.slice(0).forEach(function (item) {
                    if (+remove1 ==  item.id) {
                        traibao1.splice(traibao1.indexOf(item), 1);
                    }
                });
            });
            baiu2.forEach(remove1 => {
                traibao1.slice(0).forEach(function (item) {
                    if (+remove1 ==  item.id) {
                        traibao1.splice(traibao1.indexOf(item), 1);
                    }
                });
            });
            /* đảo bài 1 */
            let baodai1 = daobai(traibao1);
            for(let i = 0; i<=2; i++)
            {
                let daobai2 = daobai(baodai1); // đảo bài lần 3
                let idbairut = daobai2[checkstring.rand(0,daobai2.length-1)].id;
                baiu1[i] =  idbairut;
                baodai1.slice(0).forEach(function (item) {
                    if (+idbairut ==  item.id) {
                        baodai1.splice(baodai1.indexOf(item), 1);
                    }
                });
                if(i == 2)
                {
                    for (let j = 0; j <= 2; j++) {
                        let daobai2 = daobai(baodai1); // đảo bài lần 3
                        let idbairut = daobai2[checkstring.rand(0, daobai2.length - 1)].id;
                        baiu2[j] = idbairut;
                        baodai1.slice(0).forEach(function (item) {
                            if (+idbairut == item.id) {
                                baodai1.splice(baodai1.indexOf(item), 1);
                            }
                        });

                    }
                }
            }

            
            let new1 = ""+baiu1[0]+","+baiu1[1]+","+baiu1[2]+"";
            let new2 = ""+baiu2[0]+","+baiu2[1]+","+baiu2[2]+"";
            mysqli.query("UPDATE `3cay_room` SET `value_1` = '"+new1+"', `value_2` = '"+new2+"' WHERE `id` = '"+room.id+"'",function(err,sohw){
                console.log(new1);
                console.log(new2)
            })
        });
    })
}

let batdau = function(client,socket)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập',
            type : 'info'
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `3cay_room` WHERE `player1` = '"+client.id+"' LIMIT 1",function(err,kkk){
            if(err) throw err;
            if(kkk.length <=0)
            {
                client.dn({
                    loading :  -1,
                    msg : 'Bạn không phải chủ phòng hoặc chưa vào phòng',
                    tpye : 'info'
                })
            }
            kkk.forEach(room => {
                Promise.all([
                    new Promise( (res,fai)=> {
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+room.player1+"'",function(gggg,users){
                            if(users.length >0) res(users[0]);
                            else res({ xu : 0, name :''});
                        })
                    }),
                    new Promise( (res,fai)=> {
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+room.player2+"'",function(gggg,users){
                            if(users.length >0) res(users[0]);
                            else res({ xu : 0, name :''});
                        })
                    })
                ]).then(e => {
                    let u1 = e[0];
                    let u2 = e[1];
                    if(u1.xu < room.cuoc)
                    {
                        socket.io({
                            loading :-1,
                            msg : ''+u1.name+' không có đủ tiền để bắt đầu',
                            type : 'info',
                        },u1.id)
                    }
                    else 
                    if(u2.xu < room.cuoc)
                    {
                        socket.io({
                            loading :-1,
                            msg : ''+u2.name+' không có đủ tiền để bắt đầu',
                            type : 'info',
                        },u2.id)
                    }
                    else
                    if (room.status == 1) {
                        client.dn({
                            msg: 'Ván đấu đang diễn ra',
                            type: 'info',
                            loading: -1,
                        })
                    }
                    else
                        if (room.isrun == 0) {
                            client.dn({
                                msg: 'Có người chưa sẵn sàng nên chưa thể bắt đầu.',
                                type: 'info',
                                loading: -1,
                            })

                        }
                        else {
                            
                            socket.to({vang : u1.xu- room.cuoc },u1.id);
                            socket.to({vang : u2.xu- room.cuoc },u2.id);
                            
                            let baiu1 = room.value_1.split(",");
                            let baiu2 = room.value_2.split(",");
                            let traibao1 = [{ id: 1, value: 1, }, { id: 2, value: 2, }, { id: 3, value: 3, }, { id: 4, value: 4, }, { id: 5, value: 5, }, { id: 6, value: 6, }, { id: 7, value: 7, }, { id: 8, value: 8, }, { id: 9, value: 9, }, { id: 14, value: 1, }, { id: 15, value: 2, }, { id: 16, value: 3, }, { id: 17, value: 4, }, { id: 18, value: 5, }, { id: 19, value: 6, }, { id: 20, value: 7, }, { id: 21, value: 8, }, { id: 22, value: 9, }, { id: 27, value: 1, }, { id: 28, value: 2, }, { id: 29, value: 3, }, { id: 30, value: 4, }, { id: 31, value: 5, }, { id: 32, value: 6, }, { id: 33, value: 7, }, { id: 34, value: 8, }, { id: 35, value: 9, }, { id: 40, value: 1, }, { id: 41, value: 2, }, { id: 42, value: 3, }, { id: 43, value: 4, }, { id: 44, value: 5, }, { id: 45, value: 6, }, { id: 46, value: 7, }, { id: 47, value: 8, }, { id: 48, value: 9, },]
                            /* Xoá bài đã tồn tại */
                            baiu1.forEach(remove1 => {
                                traibao1.slice(0).forEach(function (item) {
                                    if (+remove1 == item.id) {
                                        traibao1.splice(traibao1.indexOf(item), 1);
                                    }
                                });
                            });
                            baiu2.forEach(remove1 => {
                                traibao1.slice(0).forEach(function (item) {
                                    if (+remove1 == item.id) {
                                        traibao1.splice(traibao1.indexOf(item), 1);
                                    }
                                });
                            });
                            /* đảo bài 1 */
                            let baodai1 = daobai(traibao1);
                            for (let i = 0; i <= 2; i++) {
                                let daobai2 = daobai(baodai1); // đảo bài lần 3 tránh trùng lặp
                                let idbairut = daobai2[checkstring.rand(0, daobai2.length - 1)].id;
                                baiu1[i] = idbairut;
                                baodai1.slice(0).forEach(function (item) {
                                    if (+idbairut == item.id) {
                                        baodai1.splice(baodai1.indexOf(item), 1);
                                    }
                                });
                                if (i == 2) {
                                    for (let j = 0; j <= 2; j++) {
                                        let daobai2 = daobai(baodai1); // đảo bài lần 3+i tránh trùng lặp
                                        let idbairut = daobai2[checkstring.rand(0, daobai2.length - 1)].id;
                                        baiu2[j] = idbairut;
                                        baodai1.slice(0).forEach(function (item) {
                                            if (+idbairut == item.id) {
                                                baodai1.splice(baodai1.indexOf(item), 1);
                                            }
                                        });

                                    }
                                }
                            }


                            let new1 = "" + baiu1[0] + "," + baiu1[1] + "," + baiu1[2] + "";
                            let new2 = "" + baiu2[0] + "," + baiu2[1] + "," + baiu2[2] + "";
                            mysqli.query("INSERT INTO `3cay_data` SET `room` = '"+room.id+"', `cuoc` = '"+room.cuoc+"', `win` = '0', `thoigian` = '"+checkstring.time().thoigian+"', `player1` = '"+room.player1+"', `player2` = '"+room.player2+"', `value1` = '0,0,0', `value2` = '0,0,0'",function(errxx,insert)
                            {
                                mysqli.query("UPDATE `3cay_room` SET `value_1` = '" + new1 + "', `value_2` = '" + new2 + "', `status` = '1', `time` = `timecho`, `evalue_1` = '0,0,0', `evalue_2` = '0,0,0', `data` = '"+insert.insertId+"' WHERE `id` = '" + room.id + "'", function (err, sohw) {
                                    sodu(u1.id,u1.xu,-room.cuoc,'Cược 3 cây','3cay_data',insert.insertId);
                                    sodu(u2.id,u2.xu,-room.cuoc,'Cược 3 cây','3cay_data',insert.insertId);
                                    /* Insert dữ liệu ván đấu */
                                    console.log(new1);
                                    console.log(new2);
                                    client.dn({
                                        loading: -1,
                                    })
                                })
                            })
                            
                        }
                })

            });
        });
    }
}

let sansang = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập',
            type : 'danger,'
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `3cay_room` WHERE `player2` = '"+client.id+"' LIMIT 1",function(err,show){
            if(show.length >=1)
            {
                let room = show[0];
                if(room.status !=0)
                {
                    client.dn({
                        msg : 'Ván đấu đang bắt đầu, vui lòng chờ kết thúc',
                        type : 'info',
                        loading : -1,
                    })
                }
                else 
                {
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(errc,users){
                        if(errc) throw errc;
                        if(users.length >=1)
                        {
                            users = users[0];
                            if(users.xu < room.cuoc)
                            {
                                client.dn({
                                    msg : 'Không đủ tiền cược',
                                    type : 'info',
                                    loading :-1,
                                })
                            }
                            else {
                                let isrun = room.isrun == 1 ? 0 : 1;
                                mysqli.query("UPDATE `3cay_room` SET `isrun` = '" + isrun + "' WHERE `id` = '" + room.id + "'", function (errr, showud) {
                                    client.dn({
                                        loading: -1,
                                    })
                                })
                            }
                        }
                    })
                }
            }
            else {
                client.dn({
                    msg : 'Không tìm thấy phòng',
                    type : 'info',
                    loading : -1,
                })
            }
        })
    }
}

let latbai = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            loading :-1,
            msg :'Chưa đăng nhập',
            type : 'info'
        })
    }
    else 
    {
        let post = data >> 0;
        mysqli.query("SELECT * FROM `3cay_room` WHERE `player1` = '"+client.id+"' or `player2` = '"+client.id+"' LIMIT 1",function(err,data){
            if(data.length >0)
            {
                let room = data[0];
                if(room.status != 1)
                {
                    client.dn({
                        loading :-1,
                    })
                }
                else 
                if(room.time >=10)
                {
                    client.dn({
                        loading : -1,
                    })
                }
                else 
                {
                    if(client.id == room.player1)
                    {
                        let sp = room.evalue_1.split(",");
                        sp[post] = 1;
                        mysqli.query("UPDATE `3cay_room` SET `evalue_1` = '"+sp[0]+","+sp[1]+","+sp[2]+"' WHERE `id` = '"+room.id+"'",function(sdfsdf,kk){
                            client.dn({
                                loading : -1,
                            })
                        })
                    }
                    else 
                    {
                        let sp = room.evalue_2.split(",");
                        sp[post] = 1;
                        mysqli.query("UPDATE `3cay_room` SET `evalue_2` = '"+sp[0]+","+sp[1]+","+sp[2]+"' WHERE `id` = '"+room.id+"'",function(sdfsdf,kk){
                            client.dn({
                                loading : -1,
                            })
                        })
                    }
                }
            }
            else 
            {
                client.dn({
                    loading : -1,
                    msg : 'Bạn là khách nên chỉ được xem thôi',
                    type : 'info'
                })
            }
        })
    }
}

let thoat = function(client,socket)
{
    console.log('thoat:'+client.id);
    mysqli.query("SELECT * FROM `3cay_room` WHERE `player1` = '"+client.id+"' OR `player2` = '"+client.id+"' LIMIT 1",function(err,room){
        if(err) throw err;
        /* Nếu có trong phòng */
        if(room.length >=1)
        {
            room = room[0];
            /* Nếu là người bình thường */
            if(room.status == 1)
            {
                client.dn({
                    msg : 'Đang trong trận không thể thoát',
                    type : 'info',
                    loading : -1,
                })
            }
            else
            if(client.id == room.player2)
            {
                mysqli.query("UPDATE `3cay_room` SET `player2` = '0', `name_2` = 'Trống' WHERE `id` = '"+room.id+"'",function(kkk,updaterom){
                    mysqli.query("DELETE FROM `3cay_users` WHERE `uid` = '"+client.id+"'",function(fhfdhg,delteroom){
                        loadphong(client,{},socket);
                        client.dn({
                            loadbacay : true,
                            loading : -1,
                        })
                        mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+room.id+"'",function(roomerr,datarom){
                            datarom.forEach(e => {
                                socket.to({chatroom : {name : 'Hệ thống', avatar : '/vendor/avatar/avatar.png', msg : ''+room.name_2+' thoát phòng.'}},e.uid);
                            });
                        })
                    })
                })
            }
            else 
            {
                /* Nếu là chủ phòng */
                mysqli.query("DELETE FROM `3cay_room` WHERE `id` =  '"+room.id+"'",function(fdghdfgh,xoaphong){
                    /* lấy danh sách người chơi */
                    mysqli.query("SELECT * FROM `3cay_users` WHERE `room` = '"+room.id+"'",function(sdfgd,list){
                        mysqli.query("DELETE FROM `3cay_users` WHERE `room` = '"+room.id+"' ",function(ssdf,delteallusers){
                            list.forEach(e => {
                                socket.to({
                                    loading : -1,
                                    loadbacay : true,
                                    msg : 'Phòng này đã bị xoá bởi chủ phòng. Vui lòng chọn phòng khác.',
                                    type : 'info'
                                },e.uid);
                            });
                            loadphong(client,{},socket);
                        })
                    })
                })
            }
        }
        else 
        {
            mysqli.query("DELETE FROM `3cay_users` WHERE `uid` = '"+client.id+"'",function(del,delusers){
                if(del)  throw del;
                loadphong(client,{},socket);
                client.dn({
                    loadbacay : true,
                    loading : -1,
                })
                
            })
        }
    })
}

let chat = function(client,data,socket)
{
    let noidung = checkstring.html(data.noidung);
    if(client.id <=0)
    {
        client.dn({
            msg : "chưa đăng nhập",
            type : "info",
            loading : -1,
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(users.length >=1)
            {
                users = users[0];
                mysqli.query("SELECT * FROM `3cay_room` WHERE `player1` = '"+client.id+"' OR `player2` = '"+client.id+"' LIMIT 1",function(err,room){
                    if(room.length >=1)
                    {
                        room = room[0];
                        mysqli.query("SELECT `uid` FROM `3cay_users` WHERE `room` = '"+room.id+"'",function(roomerr,datarom){
                            datarom.forEach(e => {
                                socket.to({chatroom : {name : users.name, avatar :(JSON.parse(users.thongtin)).avatar, msg : noidung}},e.uid);
                            });
                        })
                    }
                    else 
                    {
                        mysqli.query("SELECT `room` FROM `3cay_users` WHERE `uid` = '"+client.id+"'",function(sdf,uroom){
                            if(uroom.length >=1)
                            {
                                uroom = uroom[0];
                                mysqli.query("SELECT `uid` FROM `3cay_users` WHERE `room` = '"+uroom.room+"'",function(roomerr,datarom){
                                    datarom.forEach(e => {
                                        socket.to({chatroom : {name : users.name+'[khách]', avatar :(JSON.parse(users.thongtin)).avatar, msg : noidung}},e.uid);
                                    });
                                })
                            }
                        })
                    }
                });
            }
        })
        
    }
}

module.exports = function(client,data,socket)
{
    if(!!data.chat)
    {
        chat(client,data.chat,socket)
    }
    if(!!data.thoat)
    {
        thoat(client,socket);
    }
    if(!!data.latbai)
    {
        latbai(client,data.latbai);
    }
    if(!!data.sansang)
    {
        sansang(client)
    }
    if(!!data.batdau)
    {
        batdau(client,socket);
    }
    if(!!data.chatcay)
    {
        taobai(client,data.chatcay,socket);
    }
    if(!!data.view)
    {
        view(client,data.view,socket);
    }
    if(!!data.play)
    {
        play(client,data.play,socket);
    }
    if(!!data.loadphong)
    {
        loadphong(client,data,socket);
    }
    if(!!data.TaoRoom)
    {
        TaoRoom(client,data.TaoRoom,socket)
    }
}