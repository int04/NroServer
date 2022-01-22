let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');

let mail = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            loading  : -1,
            type : 'warn'
        })
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
                    mysqli.query("SELECT * FROM `sms` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT "+start+",25",function(er, sms){
                        let array = [];
                        if(er) throw er;
                        sms.forEach(e => {
                            array.push({
                                id : e.id,
                                thoigian : checkstring.thoigian(e.thoigian),
                                doc : e.doc, 
                                title : e.tieude,
                            })
                        });
                        res(array);
                    })
                }
            ),
            new Promise((res, fai) => {
                mysqli.query("SELECT `id` FROM `sms` WHERE `uid` = '"+client.id+"'",function(err,sms){
                    if(err) throw err;
                    res(sms.length);
                })
            })
        ]).then(e => {
            client.dn({
                loading : -1,
                hopthu : 
                {
                    dulieu : e[0],
                    TOTAL : e[1],
                    page : start,
                    admin : 'ducnghia'
                }
            })
        })
    }
}

let read = function(client,data)
{
    let id = data.id >> 0;
    if(client.id <=0)
    {
        client.dn({
            msg  : 'Chưa đăng nhập',
            type : 'warn',
            loading : -1,
        })
    }
    else 
    {
        Promise.all([
            new Promise (
                (res,faii) => 
                {
                    mysqli.query("SELECT * FROM `sms` WHERE `id` = '"+id+"' AND `uid` = '"+client.id+" LIMIT 1'",function(err,sms) {
                        if(err) throw err;
                        res(sms);
                    })
                }
            )
        ]).then(e => {
            let sms = e[0];
            if(sms.length <=0)
            {
                client.dn({
                    msg : 'Không thể đọc hộp thư này, hình như đã bị xóa hoặc không phải của bạn.',
                    type : 'info',
                    loading : -1,
                })
            }
            else 
            {
                sms = sms[0];
                if(sms.doc == 1)
                {
                    mysqli.query("UPDATE `sms` SET `doc` = '0' WHERE `id` = '"+id+"'",function(err, res){
                        if(err) throw err;
                    })
                }
                client.dn({
                    read : 
                    {
                        title : sms.tieude,
                        msg : sms.noidung,
                    },
                    loading : -1,
                })
            }
        })
    }
}

module.exports = function(client,data)
{
    if(data.index)
    {
        mail(client,data.index);
    }
    if(data.read)
    {
        read(client,data.read);
    }
}