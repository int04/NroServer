let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let info    =     require('../../../Model/users/info');

let Chatbox = function(client,text,socket)
{
    text = checkstring.html(text);
	if(text.length >= 500) text = 'NỘi dung tối đa 500 kí tự';
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            loading : -1,
            type : 'info'
        });
    }
    else 
    {
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(err) throw err;
            if(users.length >=1)
            {
                users = info(users[0]);
                if(users.sdt.length <=3)
                {
                    client.dn({
                        loading : -1,
                        msg : 'Xác minh tài khoản mới có thể chát',
                        type : 'info'
                    })
                }
				else
				if(users.ban == 1)
				{
					client.dn({
						loading : -1,
						msg: 'Tài khoản của bạn đã bị khóa',
					})
					client.id = 0;
				}
                else 
                {
                    mysqli.query("INSERT INTO `chat` SET `thoigian` = '"+checkstring.time().thoigian+"', `noidung` = '"+text+"', `uid` = '"+client.id+"'",function(err2, chat){
                        try 
                        {
                            socket.all({
                                chatbox : 
                                {
                                    name : users.name,
                                    avatar : users.thongtin.avatar,
                                    msg : text,
                                    admin : users.admin == 0 ? - 1  : users.admin,
                                }
                            });
                            client.dn({
                                loading : -1,
                            });
                        }
                        catch(e)
                        {
                            client.dn({
                                loading  : -1,
                                msg : 'Chát thất bại, vui lòng thử lại',
                                type : 'info'
                            })
                        }
                    })
                }
            }
        })
    }
}

module.exports = function(client,data,socket)
{
    if(!!data.text)
    {
        Chatbox(client,data.text,socket);
    }
}