let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');
const sodu = require('../../../Model/users/sodu');
let captcha = require('../captcha/code');


let index = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        let trang = data.trang >> 0;
        let kmess = 25;
        let page = trang > 0 ? trang : 1;
        let start = data.trang ? page * kmess - kmess : 0;
        Promise.all([
            new Promise (
                (callback,res) => 
                {
                    mysqli.query("SELECT * FROM `log_giftcode` WHERE `uid` = '"+client.id+"' ORDER BY `id` DESC LIMIT "+start+", 25",function(err,giftcode){
                        if(err) throw err;
                        let array = [];
                        giftcode.forEach(e => {
                            array.push({
                                id : e.id,
                                text : e.ma,
                                vang : e.value,
                                thoigian : checkstring.thoigian(e.thoigian),

                            })
                        });
                        callback(array);
                    })
                }
            ),
            new Promise((call,res) => {
                mysqli.query("SELECT * FROM `log_giftcode` WHERE `uid` = '"+client.id+"'",function(err, giftcode){
                    if(err) throw err;
                    call(giftcode.length);
                })
            })
        ]).then(e => {
            client.dn({
                loading : -1,
                giftcode : 
                {
                    list : e[0],
                    TOTAL : e[1],
                    page : start,
                    result : 'true'
                }
            })
            captcha(client,{})
        })
    }
}

let submit = function(client,data)
{
    let text = checkstring.html(data.value);
    let code = checkstring.html(data.code)
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    } 
    else 
    if(client.code != code)
    {
        client.dn({
            msg : 'Bạn chưa nhập chính xác mã xác nhận',
            type : 'info',
            loading : -1,
        })
        captcha(client,{})
    }
    else 
    if(client.giftcode ==1)
    {
        client.dn({
            msg : 'Đang có yêu cầu đang chạy, vui lòng chờ...',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        captcha(client,{})
        client.giftcode = 1;
        mysqli.query("SELECT * FROM `giftcode` WHERE `text` = '"+text+"' LIMIT 1",function(err,giftcode){
            try 
            {
                if(err) throw err;
                if(giftcode.length <=0)
                {
                    client.dn({
                        msg : 'Mã quà tặng không tồn tại, xin vui lòng thử lại.',
                        type : 'warn',
                        loading : -1,
                    })
                    client.giftcode = 0;
                }
                else 
                {
                    giftcode = giftcode[0];
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err2,users){
                        if(err2) throw err2;
                        if(users.length <=0)
                        {
                            client.dn({
                                msg : 'Tài khoản không tồn tại',
                                type : 'warn',
                                loading : -1,
                            })
                            client.giftcode = 0;
                        }
                        else 
                        {
                            users = users[0];
                            let vangnhan = +giftcode.value;
                            /* insert */
                            mysqli.query("INSERT INTO `log_giftcode` SET `uid` = '"+client.id+"', `ma` = '"+text+"', `value` = '"+vangnhan+"', `thoigian` = '"+checkstring.time().thoigian+"'",function(er3,insert){
                                if(er3) throw er3;
                                sodu(client.id,users.xu,vangnhan,'Mã quà tặng','log_giftcode',insert.insertId);
                                mysqli.query("DELETE FROM `giftcode` WHERE `text`  = '"+text+"'",function(err4,del) {
                                    if(err4) throw err4;
                                    client.dn({
                                        msg : 'Xac nhan ma qua tang thanh cong. Ban nhan duoc '+checkstring.number_format(vangnhan)+' xu.',
                                        type : 'success',
                                        loading : -1,
                                        vang : users.xu + vangnhan,
                                    })
                                    client.giftcode = 0;
                                })
                            })
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
                client.dn({
                    msg : 'Có lỗi xẩy ra, vui lòng thử lại',
                    type : 'info',
                    loading : -1,
                })
                client.giftcode = 0;
            }
        })
    }
}

module.exports = function(client,data)
{

    if(!!data.index)
    {
        index(client,data.index);
    }
    if(!!data.submit)
    {
        submit(client,data.submit);
    }
}