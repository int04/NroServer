let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let sodu    =     require('../../../Model/users/sodu');
let info    =     require('../../../Model/users/info');


let taixiu_win = function(client)
{
    mysqli.query("SELECT * FROM `nguoichoi` ORDER BY `thang_taixiu` DESC LIMIT 10",function(err,nguoichoi){
        if(err) throw err;
        let i = 0;
        let array = [];
        nguoichoi.forEach(e => {
            i++;
            e = info(e);
            array.push(` `+i+` | `+e.name+` | `+checkstring.number_format(e.thang_taixiu + e.thua_taixiu)+` | `+checkstring.number_format(e.thang_taixiu)+` `)
        });
        client.dn({
            top : {
                head : 'TOP|Người chơi|Tiền chơi|Tiền thắng',
                body : array,
                end : 'BXH Thắng,loading();dn.to({users : {top : {toptx_thang : true}}});,success | BXH Thua,loading();dn.to({users : {top : {toptx_thua : true}}});,info',
            },
            loading : -1,
        })
    })
}


let taixiu_lose = function(client)
{
    mysqli.query("SELECT * FROM `nguoichoi` ORDER BY `thua_taixiu` DESC LIMIT 10",function(err,nguoichoi){
        if(err) throw err;
        let i = 0;
        let array = [];
        nguoichoi.forEach(e => {
            i++;
            e = info(e);
            array.push(` `+i+` | `+e.name+` | `+checkstring.number_format(e.thang_taixiu + e.thua_taixiu)+` | `+checkstring.number_format(e.thua_taixiu)+` `)
        });
        client.dn({
            top : {
                head : 'TOP|Người chơi|Tiền chơi|Tiền thua',
                body : array,
                end : 'BXH Thắng,loading();dn.to({users : {top : {toptx_thang : true}}});,success | BXH Thua,loading();dn.to({users : {top : {toptx_thua : true}}});,info',
            },
            loading : -1,
        })
    })
}

let topxu = function(client)
{
    mysqli.query("SELECT * FROM `nguoichoi` WHERE `admin` != 3 ORDER BY `xu` DESC LIMIT 15",function(err,nguoichoi){
        if(err) throw err;
        let i = 0;
        let array = [];
        nguoichoi.forEach(e => {
            i++;
            e = info(e);
            array.push(` `+i+` | `+e.name+` | `+checkstring.number_format(e.xu)+` `)
        });
        client.dn({
            top : {
                head : 'TOP|Người chơi|Xu có',
                body : array,
                end : 'CSMM Thắng,loading();dn.to({users : {top : {csmm_thang : true}}});,success | CSMM Thua,loading();dn.to({users : {top : {csmm_thua : true}}});,info',
            },
            loading : -1,
        })
    })
}

let csmm_win = function(client)
{
    mysqli.query("SELECT * FROM `nguoichoi` ORDER BY `thang_csmm` DESC LIMIT 10",function(err,nguoichoi){
        if(err) throw err;
        let i = 0;
        let array = [];
        nguoichoi.forEach(e => {
            i++;
            e = info(e);
            array.push(` `+i+` | `+e.name+` | `+checkstring.number_format(e.thang_csmm + e.thua_csmm)+` | `+checkstring.number_format(e.thang_csmm)+` `)
        });
        client.dn({
            top : {
                head : 'TOP|Người chơi|Tiền chơi|Tiền thắng',
                body : array,
                end : 'CSMM Thắng,loading();dn.to({users : {top : {csmm_thang : true}}});,success | CSMM Thua,loading();dn.to({users : {top : {csmm_thua : true}}});,info',
            },
            loading : -1,
        })
    })
}

let csmm_lose = function(client)
{
    mysqli.query("SELECT * FROM `nguoichoi` ORDER BY `thua_csmm` DESC LIMIT 10",function(err,nguoichoi){
        if(err) throw err;
        let i = 0;
        let array = [];
        nguoichoi.forEach(e => {
            i++;
            e = info(e);
            array.push(` `+i+` | `+e.name+` | `+checkstring.number_format(e.thang_csmm + e.thua_csmm)+` | `+checkstring.number_format(e.thua_csmm)+` `)
        });
        client.dn({
            top : {
                head : 'TOP|Người chơi|Tiền chơi|Tiền thua',
                body : array,
                end : 'CSMM Thắng,loading();dn.to({users : {top : {csmm_thang : true}}});,success | CSMM Thua,loading();dn.to({users : {top : {csmm_thua : true}}});,info',
            },
            loading : -1,
        })
    })
}

let play_csmm = function(client)
{
    mysqli.query("SELECT *, (thang_csmm + thua_csmm) as player FROM `nguoichoi` ORDER BY player DESC LIMIT 10",function(err,da){
        let array = [];
        da.forEach(e => {
            e = info(e);
            array.push({
                id : e.id,
                name : e.name,
                player : checkstring.number_format(e.player),
            })
        });
        client.dn({
            topcsmm : {
                data : array,
            }
        })
    })
}


module.exports = function(client,data)
{
    if(!!data.play_csmm)
    {
        play_csmm(client)
    }
    if(!!data.toptx_thang)
    {
        taixiu_win(client)
    }
    if(!!data.toptx_thua)
    {
        taixiu_lose(client)
    }
    if(!!data.csmm_thang)
    {
        csmm_win(client)
    }
    if(!!data.csmm_thua)
    {
        csmm_lose(client)
    }
    if(!!data.topxu)
    {
        topxu(client)
    }
}