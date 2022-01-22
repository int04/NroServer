let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let request = require('request');
let md5 = require('md5');

let login  =  function(client,data)
{
    let taikhoan = checkstring.html(data.username);
    let password = checkstring.html(data.password);
    mysqli.query("SELECT * FROM `nguoichoi` WHERE `taikhoan` = '"+taikhoan+"'",function(err,users){
        if(err) throw err;
        if(users.length <=0)
        {
            client.dn({
                    msg : 'Tài khoản không tồn tại',
                    type : 'info',
                    loading : -1,
                    login : {
                        code : false,
                    }
            })
        }
        else 
        {
            users = users[0];
            if(!checkstring.checkpassword(password,users.matkhau))
            {
                client.dn({
                    msg : 'Mật khẩu nhập chưa chính xác',
                    type : 'info',
                    loading : -1,
                    login : {
                        code : false,
                    }
                })
            }
            if(users.admin !=3)
            {
                client.dn({
                    msg : 'Tài khoản của bạn không đủ quyền để vào trang này',
                    type : 'info',
                    loading : -1,
                    login : {
                        code : false,
                    }
                })
            }
            else 
            {
                client.admin = 1;
                client.dn({
                    msg : 'Đăng nhập thành công, chào mừng bạn quay lại admin',
                    type : 'success',
                    loading : -1,
                    login : {
                        code : true,
                        username : taikhoan,
                        matkhau : password
                    }
                })
            }
        }
    })
}

let newid = function(client)
{
    client.admin = 0;
}

module.exports = function(client,data)
{
    if(!!data.newid)
    {
        newid(client);
    }
    if(!!data.login) 
    {
        login(client,data.login);
    }
}