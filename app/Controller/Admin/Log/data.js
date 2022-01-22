let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');

let napvang = function(client,data)
{
    if(client.admin <=0)
    {
        client.dn({
            msg : '-',
            type : 'error',
            loading : -1,
        })
    }
    else 
    {
        let type = data.type >> 0;
        let where = type == 1 ? 'WHERE `status` = \'1\'' : '';
        Promise.all([
            new Promise(
                (res,fai) => {
                    mysqli.query("SELECT * FROM `napvang` "+where+" ORDER BY `id` DESC",function(err,nap){
                        if(err) throw err;
                        let array = [];
                        nap.forEach(obj => {
                            array.push({
                                id : obj.id,
                                name_gd : obj.name,
                                vang_gd : checkstring.number_format(obj.vang_game),
                                vangnhan : checkstring.number_format(obj.vang_nhan),
                                server : obj.server,
                                status : (obj.status == 0 ? '<button class="btn btn-success">Đã nạp</button>' : '<Button class="btn btn-info">Chưa nạp</button>'),
                                thoigian : checkstring.thoigian(obj.thoigian),
                                date : obj.date,
                                UID : obj.uid,
                            });
                        });
                        res(array);
                    })
                }
            ),
        ]).then(e => {
            client.dn({
                napvang : 
                {
                    list : e[0],
                },
                loading : -1,
            })
        })
    }
}

let rutvang = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else
    {
        let type = data.type >> 0;
        let where = type == 1 ? 'WHERE `trangthai` = \'1\'' : '';
        Promise.all([new Promise( (res,fai) => {
            mysqli.query("SELECT * FROM `rutvang` "+where+" ORDER BY `id` DESC",function(err,rutvang){
                let array = [];
                rutvang.forEach(e => {
                    array.push({
                        id : e.id, 
                        uid : e.uid,
                        thoigian : checkstring.thoigian(e.thoigian),
                        server : e.server ,
                        vangnhan : e.vangnhan,
                        vangrut : e.vangrut,
                        name : e.name,
                        trangthai : e.trangthai == 1 ? '<button class="btn btn-error" onclick="huydon_vang('+e.id+')">Huỷ đơn</button>' : '<button class="btn btn-success">Đã rút</button>'
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                rutvang : 
                {
                    list : e[0]
                }
            })
        })
    }
}

let huydonrutvang = function(client,data)
{
    let id = data.id >> 0;
    if(client.admin <=0)
    {

    }
    else 
    {
        mysqli.query("SELECT * FROM `rutvang` WHERE `id` = '"+id+"' AND `trangthai` ='1'",function(err,rutvangc){
            if(err) throw err;
            if(rutvangc.length <=0)
            {
                client.dn({
                    msg : 'Đơn hàng không tồn tại hoặc đã được huỷ bỏ.',
                    tpye : 'error',
                    loading : -1,
                })
            }
            else 
            {
                rutvangc = rutvangc[0];
                mysqli.query("DELETE FROM `rutvang` WHERE `id` = '"+rutvangc.id+"'",function(err2,delterecond){
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id`  = '"+rutvangc.uid+"'",function(err3,users){
                        if(users.length >=1)
                        {
                            users = users[0];
                            sodu(users.id,users.vang,rutvangc.vangrut,'Huỷ đơn rút vàng');
                            client.dn({
                                msg : 'Huỷ đơn thành công, đã hoàn cho người này '+checkstring.number_format(rutvangc.vangrut)+' tiền',
                                tpye : 'success',
                                loading : -1,
                            })
                            rutvang(client,{type : 1})
                        }
                    })
                })
            }
        })
    }
}

let momo = function(client,data)
{
    if(client.admin <=0)
    {
        
    }
    else
    {
        Promise.all([new Promise ( (res,fai) => {
            mysqli.query("SELECT * FROM `momo` ORDER BY `id` DESC",function(err,data){
                let array = [];
                data.forEach(e => {
                    array.push({
                        id : e.id,
                        thoigian : checkstring.thoigian(e.thoigian),
                        vnd : checkstring.number_format(e.vnd),
                        magiaodich : e.magiaodich,
                        uid : e.uid,
                        vang : checkstring.number_format(e.vang),
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                NapMoMo : {
                    list : e[0]
                }
            })
        })
    }
}

let thesieure  = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([new Promise((call,sa) =>{
            mysqli.query("SELECT * FROM `thesieure`",function(err,data){
                if(err) throw err;
                let array = [];
                data.forEach(e => {
                    array.push({
                        id : e.id,
                        magiaodich :e.magiaodich,
                        vnd : checkstring.number_format(e.vnd),
                        vang : checkstring.number_format(e.vang),
                        thoigian : checkstring.thoigian(e.thoigian),
                        uid : e.uid,
                    })
                    call(array);
                });
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                Naptsr : {
                    list : e[0],
                }
            })
        })
    }
}

let thecao = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([new Promise( (call,back) => {
            mysqli.query("SELECT * FROM `thecao`",function(err,data){
                if(err) throw err;
                let array = [];
                data.forEach(e => {
                    array.push({
                        id : e.id,
                        uid : e.uid,
                        code : e.code,
                        seri : e.seri,
                        mathe : e.mathe,
                        menhgia : checkstring.number_format(e.menhgia),
                        thoigian : checkstring.thoigian(e.thoigian),
                        vang : checkstring.number_format(e.vang),
                        stt : (e.stt == 0 ? '<button class="btn btn-info">Đang nạp</button>' : (e.stt == 1 ? '<button class="btn btn-success">Thành công</button>' : (e.stt == 2 ? '<button class="btn btn-warning">Sai mệnh giá</button>' : '<button class="btn btn-error">Sai thẻ</button>'))),
                    })
                });
                call(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                Napthecao : {
                    list : e[0]
                }
            })
        })
    }
}

let giftcode = function(client,data)
{
    if(client.admin <=0)
    {
        
    }
    else 
    {
        Promise.all([new Promise ((res,fai) => {
            mysqli.query("SELECT * FROM `giftcode`",function(err,code){
                if(err) throw err;
                let array = [];
                code.forEach(e => {
                    array.push({
                        id : e.id,
                        value : checkstring.number_format(e.value),
                        text : e.text,
                        action : '<button class="btn btn-success" onclick="xoa_giftcode('+e.id+')">Xoá</button>',
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                giftcode : {
                    list : e[0]
                }
            })
        })
    }
}

let taogfit = function(client,data)
{
    let value = data.value >> 0;
    let soluong = data.soluong >> 0;
    if(client.admin <=0)
    {
        
    }
    else 
    {
        for(var i=0; i < soluong; i++)
        {
            let ma = 'N'+checkstring.az(5)+'-G'+checkstring.az(4)+'-H'+checkstring.az(3)+'-I'+checkstring.az(4)+'-A'+checkstring.az(5)+'';
            mysqli.query("INSERT INTO `giftcode` SET `value` = '"+value+"', `text` = '"+ma+"'",function(err,update){

            })
            if(i+1 == soluong)
            {
                giftcode(client,data);
                client.dn({
                    msg : 'Tạo thành công',
                    loading : -1,
                    type : 'success'
                })
            }
        }
    }
}

let DELTEGIFT = function(client,data)
{
    let id = data.id >>0;
    if(client.admin <=0)
    {

    }
    else 
    {
        mysqli.query("DELETE FROM `giftcode` WHERE `id` = '"+id+"'",function(err,b){
            if(err) throw err;
            client.dn({
                msg : 'Xoá thành công',
                type : 'info',
                loading : -1,
            })
            giftcode(client,data)
        })
    }
}

let log_giftcode = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([new Promise((res,fai)=> {
            mysqli.query("SELECT * FROM `log_giftcode`",function(err,show){
                if(err) throw err;
                let array = [];
                show.forEach(e => {
                    array.push({
                        id : e.id,
                        uid : e.uid,
                        text : e.ma,
                        value : checkstring.number_format(e.value),
                        thoigian : checkstring.thoigian(e.thoigian),
                        date : e.date,
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                ducnghia : true,
                log_giftcode : 
                {
                    list : e[0],
                }
            })
        })
    }
}
let wherephien = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let server = data.type >> 0;
        let where  = '';
        where = server == 0 ? '' : ' WHERE `server` = \''+server+'\'';
        
        mysqli.query("SELECT * FROM `phien` "+where+" ",function(err,phien){
            if(err) throw err;
            let array = [];
            Promise.all(phien.map(function(obj){
                return Promise.all([
                    new Promise((res,fai) => 
                    {
                        let search = "";
                        search+="SELECT (SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"') as play, (SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"') as win";
                        search+=",(SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `game` = 'chanle') as vangcuoc_chanle";
                        search+=",(SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `game` = 'chanle') as vangthang_chanle";
                        search+=",(SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `game` = 'taixiu') as vangcuoc_taixiu";
                        search+=", (SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `game` = 'taixiu') as vangthang_taixiu";
                        search+=", (SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'tai') as cuoc_tai";
                        search+=", (SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'tai') as thang_tai";
                        search+=",(SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'chan') as cuoc_chan";
                        search+=", (SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'chan') as thang_chan";
                        search+=", (SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'le') as cuoc_le";
                        search+=", (SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'le') as thang_le ";
                        search+=", (SELECT sum(vangcuoc)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'xiu') as cuoc_xiu";
                        search+=",  (SELECT sum(vangnhan)  FROM `cuoc` WHERE `phien` = '"+obj.id+"' AND `server` = '"+obj.server+"' AND `cuoc` = 'xiu') as thang_xiu";

                        mysqli.query(search,function(lo,sum){
                            if(lo) throw lo;
                            res(sum[0]);
                        })
                    }),
                    
                ]).then(c => {
                    let run = c[0];
                    array.push({
                        phien : obj.id,
                        ketqua : obj.ketqua, 
                        status : obj.status == 1 ? 'Xong' : 'Đang chạy',
                        thoigian : checkstring.thoigian(obj.thoigian),
                        server : obj.server,
                        tienchoi : checkstring.number_format(run.play),
                        tienthang  : checkstring.number_format(run.win),
                        chanle_cuoc :checkstring.number_format(run.vangcuoc_chanle),
                        chanle_thang : checkstring.number_format(run.vangthang_chanle),
                        taixiu_cuoc : checkstring.number_format(run.vangcuoc_taxiu),
                        taixiu_thang : checkstring.number_format(run.vangthang_taixiu),
                        taicuoc : checkstring.number_format(run.cuoc_tai),
                        taithang : checkstring.number_format(run.thang_tai),
                        chancuoc : checkstring.number_format(run.cuoc_chan),
                        chanthang : checkstring.number_format(run.thang_chan),
                        lecuoc : checkstring.number_format(run.cuoc_le),
                        lethang : checkstring.number_format(run.thang_le),
                        xiucuoc : checkstring.number_format(run.cuoc_xiu),
                        xiuthang : checkstring.number_format(run.thang_xiu),

                    })
                })
            })).then(e => {
                client.dn({
                    loading : -1,
                    phien : 
                    {
                        list : array,
                    }
                })
            }) 
        })
    }
}

let where_cuoc = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let phien = data.id >> 0;
        let uid = data.uid >> 0;
        let server = data.server >>0;
        let where = '';
        let type = 'Tất cả';
        if(phien >0) where = 'WHERE `phien` = \''+phien+'\'';
        else if(uid >0) where = 'WHERE `uid` = \''+uid+'\' ';
        else if(server >0) where = 'WHERE `server` = \''+server+'\'';
        else where = '';

        if(phien >0) type = 'Phiên: '+phien+' ';
        else if(uid >0) type = 'Người chơi: '+uid+'';
        else if(server >0) type = 'Vũ trụ : '+server+'';
        Promise.all([
            new Promise( (f,s) => {
                mysqli.query("SELECT * FROM `cuoc`  "+where+" ",function(err,k){
                    if(err) throw err;
                    let array = [];
                    k.forEach(e => {
                        array.push({
                            id : e.id,
                            server : e.server,
                            uid : e.uid,
                            phien : e.phien,
                            cuoc : checkstring.number_format(e.vangcuoc),
                            game : e.game,
                            win : checkstring.number_format(e.vangnhan),
                            dat : e.cuoc,
                            trangthai : e.trangthai == 0 ? '<button class="btn btn-info">Đang chạy</button>' : '<button class="btn btn-success">Hoàn tất</button>',
                            thoigian : checkstring.thoigian(e.thoigian),
                        })
                    });
                    f(array)
                })
            })
        ]).then(e => {
            client.dn({
                loading : -1,
                cuoc : {
                    list : e[0],
                    type : type
                }
            })
        })
    }
}

let lsgd = function(client,data)
{
    let uid = data.uid >> 0;
    let begin = data.begin;
    let end = data.end;
    if(client.admin <=0)
    {

    } 
    else 
    {
        let start_searhc = "";
        let close = "";
        if(!!begin) start_searhc = ' AND `date` >= \''+begin+'\' ';
        if(!!end) close = ' AND `date` <= \''+end+'\' ';
        Promise.all([ 
            new Promise( (f,s) => {
                mysqli.query("SELECT * FROM `sodu` WHERE `uid` = '"+uid+"' "+start_searhc+" "+close+"",function(err,sodu){
                    if(err) throw err;
                    let array = [];
                    sodu.forEach(e => {
                        array.push({
                            id : e.id,
                            uid : e.uid,
                            truoc : checkstring.number_format(e.truoc),
                            sau : checkstring.number_format(e.sau),
                            xu : checkstring.number_format(e.xu),
                            thoigian : checkstring.thoigian(e.thoigian),
                            noidung : e.noidung,
                            info : e.key >=1 ? '<button class="btn btn-success" onclick="doc(\''+e.nguon+'\',\''+e.key+'\')">Chi tiết</button>' : '<button class="btn btn-info">Không đọc</button>',
                        })
                    });
                    f(array);
                })
            })
        ]).then(e => {
            client.dn({
                loading : -1,
                sodu : {
                    list : e[0],
                    uid : uid,
                    start : begin,
                    end : end,
                }
            })
        })
    }
}


let chuyentien = function(client,data)
{
    let uid = data.uid >> 0;
    let begin = data.begin;
    let end = data.end;
    if(client.admin <=0)
    {

    } 
    else 
    {
        let id = "";
        if(!!uid) id = ' AND (`to` = \''+uid+'\' OR   `from` = \''+uid+'\' ) ';
        let start_searhc = "";
        let close = "";
        if(!!begin) start_searhc = ' AND `date` >= \''+begin+'\' ';
        if(!!end) close = ' AND `date` <= \''+end+'\' ';
        Promise.all([ 
            new Promise( (f,s) => {
                mysqli.query("SELECT * FROM `chuyentien` WHERE `id` >='1' "+id+" "+start_searhc+" "+close+"",function(err,paymothoud){
                    if(err) throw err;
                    let array = [];
                    paymothoud.forEach(e => {
                        array.push({
                            id : e.id,
                            from : e.from,
                            to : e.to,
                            value : checkstring.number_format(e.vang),
                            thoigian : checkstring.thoigian(e.thoigian),
                            noidung : e.noidung,
                            phi : e.phi,
                            tophi : checkstring.number_format( Math.round(  (e.phi*e.vang) - e.vang) ),

                        })
                    });
                    f(array);
                })
            })
        ]).then(e => {
            client.dn({
                loading : -1,
                chuyentien : {
                    list : e[0],
                    uid : uid,
                    start : begin,
                    end : end,
                }
            })
        })
    }
}

let configbot = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'nap'",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                display : e.display,
                                name : e.name,
                                data : e.data,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Edit BOT nạp',
                    ghichu : 'Tên hiển thị chính là tên BOT',
                }
            })
        })
    }
}

let edit = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else
    {
        mysqli.query("UPDATE `config` SET `name` = '"+data.name+"', `data` = '"+data.data+"' WHERE `id` = '"+data.id+"'",function(err,thr){
            if(err) throw err;
            client.dn({
                loading : -1,
                type : 'success',
                msg : 'Chỉnh sửa thành công.'
            })
        })
    }
}

let configrut = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'rut'",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                display : e.display,
                                name : e.name,
                                data : e.data,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Edit BOT rút',
                    ghichu : 'Tên hiển thị chính là tên BOT',
                }
            })
        })
    }
}

let atm = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'napatm'",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                display : e.display,
                                name : e.name,
                                data : e.data,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Chỉnh sửa ATM',
                    ghichu : 'không cần qtam tên hiển thị',
                }
            })
        })
    }
}

let thecaox = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'thecao'",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                display : e.display,
                                name : e.name,
                                data : e.data,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Chỉnh sửa thẻ cào',
                    ghichu : 'không cần qtam tên hiển thị',
                }
            })
        })
    }
}

let configchuyentien = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'chuyentien'",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                display : e.display,
                                name : e.name,
                                data : e.data,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Chỉnh sửa Chuyển tiền',
                    ghichu : 'không cần qtam tên hiển thị',
                }
            })
        })
    }
}

let settingbot = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise(
                (res,fai) =>
                mysqli.query("SELECT * FROM `config` WHERE `group` = 'bot'",function(err,bot){
                    if(err) throw err;
                    let array = [];
                    bot.forEach(e => {
                        array.push({
                            id : e.id,
                            display : e.display,
                            name : e.name,
                            data : e.data,
                        })
                    });
                    res(array)
                })
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Cài đặt BOT',
                    ghichu : 'Chỉ cần quan tâm tới giá trị nhập'
                }
            })
        })
    }
}


let notice = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `config` WHERE `group` = 'thongbao'",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                display : e.display,
                                name : e.name,
                                data : e.data,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                config : {
                    list : e[0],
                    title : 'Chỉnh sửa thông báo',
                    ghichu : 'không cần qtam tên hiển thị',
                }
            })
        })
    }
}

let chon = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let kq = -1;
        kq = checkstring.rand(1,99);
        let type = data.type;
        let id = data.id;
        if(type == "le")
        {
            while(kq%2 ==0)
            {
                kq = checkstring.rand(0,99);
                if(kq%2 != 0)
                {
                    mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `id`  = '"+id+"'",function(err,res){
                        if(err) throw err;
                        client.dn({
                            loading : -1,
                        })
                    })
                }
                else 
                {
                    kq = 4;
                }
                console.log(kq);
            }
        }

        if(type == "chan")
        {
            while(kq%2 !=0)
            {
                kq = checkstring.rand(0,99);
                if(kq%2 == 0)
                {
                    mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `id`  = '"+id+"'",function(err,res){
                        if(err) throw err;
                        client.dn({
                            loading : -1,
                        })
                    })
                }
            }
        }

        if(type == "tai")
        {
            
            kq = checkstring.rand(50,99);
            if(kq >=50)
            {
                mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `id`  = '"+id+"'",function(err,res){
                    if(err) throw err;
                    client.dn({
                        loading : -1,
                    })
                })
            }
            
        }

        if(type == "xiu")
        {
            
            kq = checkstring.rand(0,49);
            if(kq <=49)
            {
                mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `id`  = '"+id+"'",function(err,res){
                    if(err) throw err;
                    client.dn({
                        loading : -1,
                    })
                })
            }
            
        }


    }
}

let input = function(client,data)
{
    if(client.admin <=0)
    {}
    else 
    {
        mysqli.query("UPDATE `phien` SET `ketqua` = '"+data.value+"' WHERE `server` = '999' AND `status` = '0'",function(err,show){
            if(err) throw err;
            client.dn({
                loading : -1,
            })
        })
    }
}

let sendarray = function(array,tieude,noidung)
{
    if(array.length >=1)
    {
        let id = array[0];
        mysqli.query("INSERT INTO `sms` SET `uid` = '"+id+"', `tieude` = '"+tieude+"', `noidung` = '"+noidung+"', `thoigian` = '"+checkstring.time().thoigian+"', `doc` = '1'",function(err,insert){
            array.slice(0).forEach(function (item) {
                if (+item == +id) {
                    array.splice(array.indexOf(item), 1);
                }
            });
            sendarray(array,tieude,noidung)
        })
        

    }
}

let sendsms = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let uid = data.uid;
        let noidung = data.noidung;
        let tieude = data.tieude;
        /* send all */
        if(uid == 0)
        {
            mysqli.query("SELECT `id` FROM `nguoichoi`",function(err,users){
                let array = [];
                users.forEach(e => {
                    array.push(e.id)
                });
                sendarray(array,tieude,noidung)
                client.dn({
                    loading : -1,
                    msg : 'Gửi thành công',
                    type : 'success'
                })
            })
           
        }
        else 
        {
            let users = uid.split(",");
            Promise.all(users.map(function(obj){
                return new Promise((res, fai) => {
                    mysqli.query("INSERT INTO `sms` SET `uid` = '"+obj+"', `tieude` = '"+tieude+"', `noidung` = '"+noidung+"', `thoigian` = '"+checkstring.time().thoigian+"', `doc` = '1'",function(err,insert){

                    })
                    res('true');
                } )
            })).then(e => {
                client.dn({
                    loading : -1,
                    msg : 'Gửi thành công cho '+uid+' ',
                    type : 'success'
                })
            })

        }
    }
}

let taobot = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([new Promise((res,fai)=>{
            mysqli.query("SELECT * FROM `bot`",function(err,int) {
                if(err) throw err;
                let array = [];
                int.forEach(e => {
                    array.push({
                        id : e.id,
                        uid : e.uid,
                        name : e.name,
                        action : '<button class="btn btn-success" onclick="xoabot('+e.id+')">Xoá</button>',
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                bot : {
                    list : e[0],
                }
            })
        })
    }
}

let taobotnow = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let name = checkstring.html(data.name);
        if(name.length <=4)
        {
            client.dn({
                loading :-1,
                msg : 'Tên phải lớn hơn 4 kí tự',
                type : 'info'
            })
        }
        else
        {
            mysqli.query("SELECT `id` FROM `nguoichoi` WHERE `name` = '"+name+"'",function(err,users){
                if(err) throw err;
                if(users.length >=1)
                {
                    client.dn({
                        loading : -1,
                        msg : 'Tên BOT đã có người sử dụng',
                        type : 'danger',
                    })
                }
                else 
                {
                    mysqli.query("INSERT INTO `nguoichoi` SET `taikhoan` = 'BOT', `name` = '"+name+"', `thongtin` = '"+JSON.stringify({avatar : '/vendor/avatar/avatar.png'})+"'",function(err2,insert){
                        if(err2) throw err2;
                        /* Creft */
                        mysqli.query("INSERT INTO `bot` SET `uid` = '"+insert.insertId+"', `name` = '"+name+"'",function(err3,success){
                            if(err3)  throw err3;
                            client.dn({
                                msg : 'Tạo BOT thành công,',
                                type : 'success',
                                loading : -1,
                            })
                            taobot(client,{});
                        })
                    })
                }
            })
        }
    }
}

let cauhinhnap = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        Promise.all([
            new Promise( 
                (f,a) => {
                    mysqli.query("SELECT * FROM `server`",function(er,k) {
                        if(er) throw er;
                        let array = [];
                        k.forEach(e => {
                            array.push({
                                id : e.id,
                                server : e.server,
                                card : e.card,
                                atm : e.atm,
                            })
                        });
                        f(array);
                    })
                }
            )
        ]).then(e => {
            client.dn({
                loading : -1,
                cauhinhnap : {
                    list : e[0],
                    title : 'Edit BOT rút',
                    ghichu : 'Tên hiển thị chính là tên BOT',
                }
            })
        })
    }
}


let confgi_gia = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let card = data.card >> 0;
        let atm = data.atm >> 0;
        let id = data.id >> 0;
        mysqli.query("UPDATE `server` SET card = '"+card+"', atm = '"+atm+"' WHERE `id` = '"+id+"'");
        client.dn({
            msg : 'Thành công',
            type : 'success',
            loading : -1,
        })
    }
}

let acc = function(client,data)
{
    if(client.admin <=0)
    {
        
    }
    else 
    {
        Promise.all([new Promise ((res,fai) => {
            mysqli.query("SELECT * FROM `acc`",function(err,code){
                if(err) throw err;
                let array = [];
                code.forEach(e => {
                    array.push({
                        id : e.id,
                        server :e.server,
                        name : e.name,
                        khu : e.khu,
                        type : e.type == 0 ? 'Nạp' : 'Rút',
                        action : '<button class="btn btn-success" onclick="xoa_ac('+e.id+')">Xoá</button>',
                    })
                });
                res(array)
            })
        })]).then(e => {
            client.dn({
                loading : -1,
                acc : {
                    list : e[0]
                }
            })
        })
    }
}

let taoacc = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        mysqli.query("INSERT INTO `acc` SET `server` = '"+data.server+"', `khu` = '"+data.khu+"', `name`= '"+data.name+"', `type` = '"+data.type+"'",function(ssdf,inser){
            acc(client,{});
        })
    }
}

let xoaac = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        mysqli.query("DELETE FROM `acc` WHERE `id` = '"+data.id+"'",function(xcv,df){
            acc(client,{})
        })
    }
}

module.exports = function(client,data)
{
    if(!!data.xoaac)
    {
        xoaac(client,data.xoaac);
    }
    if(!!data.taobot)
    {
        taoacc(client,data.taobot);
    }
    if(!!data.acc)
    {
        acc(client,data.acc);
    }
    if(!!data.confgi_gia)
    {
        confgi_gia(client,data.confgi_gia);
    }
    if(!!data.taobotnow)
    {
        taobotnow(client,data.taobotnow);
    }
    if(!!data.taobot)
    {
        taobot(client,data.taobot);
    }
    if(!!data.settingbot)
    {
        settingbot(client,data.settingbot);
    }
    if(!!data.sendsms)
    {
        sendsms(client,data.sendsms)
    }
    if(!!data.input)
    {
        input(client,data.input);
    }
    if(!!data.chon)
    {
        chon(client,data.chon)
    }
    if(!!data.notice)
    {
        notice(client,data.notice);
    }
    if(!!data.configchuyentien)
    {
        configchuyentien(client,data.configchuyentien);
    }
    if(!!data.thecaox)
    {
        thecaox(client,data.thecaox);
    }
    if(!!data.atm)
    {
        atm(client,data.atm);
    }
    if(!!data.edit)
    {
        edit(client,data.edit);
    }
    if(!!data.configrut)
    {
        configrut(client,data.configrut);
    }
    if(!!data.cauhinhnap)
    {
        cauhinhnap(client,data.cauhinhnap);
    }
    if(!!data.configbot)
    {
        configbot(client,data.configbot);
    }
    if(!!data.chuyentien)
    {
        chuyentien(client,data.chuyentien)
    }
    if(!!data.lsgd)
    {
        lsgd(client,data.lsgd);
    }
    if(!!data.cuoc)
    {
        where_cuoc(client,data.cuoc);
    }
    if(!!data.phien) 
    {
        wherephien(client,data.phien);
    }
    if(!!data.log_giftcode)
    {
        log_giftcode(client,data.log_giftcode);
    }
    if(!!data.DELTEGIFT)
    {
        DELTEGIFT(client,data.DELTEGIFT);
    }
    if(!!data.taogfit)
    {
        taogfit(client,data.taogfit);
    }
    if(!!data.giftcode)
    {
        giftcode(client,data.giftcode)
    }
    if(!!data.thecao)
    {
        thecao(client,data.thecao);
    }
    if(!!data.thesieure)
    {
        thesieure(client,data.thesieure);
    }
    if(!!data.momo)
    {
        momo(client,data.momo);
    }
    if(!!data.napvang)
    {
        napvang(client,data.napvang);
    }
    if(!!data.rutvang)
    {
        rutvang(client,data.rutvang);
    }
    if(!!data.huyrutvang)
    {
        huydonrutvang(client,data.huyrutvang)
    }
}