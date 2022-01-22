let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let request = require('request');
let md5 = require('md5');
let info_acc    =     require('../../../Model/users/info');
let captcha = require('../captcha/code');

let info = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"' LIMIT 1",function(err,users)
        {
            try 
            {
                if(err) throw err;
                if(users.length <=0)
                {
                    client.dn({
                        msg  : 'Không thể tìm thấy tài khoản',
                        type : 'info',
                        loading : -1,
                    });
                }
                else 
                {
                    users = users[0];
                    users.thongtin = JSON.parse(users.thongtin)
                    client.dn({
                        profile : 
                        {
                            id : users.id,
                            name : users.name,
                            username : users.taikhoan,
                            vang : users.xu,
                            avatar : users.avatar,
                            time : '2021'
                        },
                        loading : -1,
                    });
                }
            }
            catch(E)
            {
                client.dn({
                    loading : -1,
                    msg : 'Đã xẩy ra lỗi dữ liệu',
                    type : 'info'
                })
            }
        });
    }
}

let checkname = function(client,data)
{
    
        let value = checkstring.html(data.value);
        mysqli.query("SELECT `id` FROM `nguoichoi` WHERE `taikhoan`  = '"+value+"' OR `name` = '"+value+"' OR `id` = '"+value+"' LIMIT 1", function(err,users){
           try {
            if(users.length <=0)
            {
                client.dn({
                    checkname : 'success',
                });
            }
            else 
            {
                client.dn({
                    checkname : 'error'
                });
            }
           }catch(e)
           {
            client.dn({
                checkname : 'error'
            });
           }
        });
            

     
        
   
    
}
let nutlogin = function(client,data)
{
    let username = checkstring.html(data.username);
    let password = checkstring.html(data.password);
    let ip = checkstring.html(data.resource);
    
    if(username && password)
    {
        
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `taikhoan` = '"+username+"' LIMIT 1",function(err,users){
            try 
            {
                if(err) throw err;
                if(users.length <=0)
                {
                    client.dn({
                        msg : 'Không tìm thấy tài khoản này',
                        type :  'info',
                        loading : -1,
                        login : {
                            status : false
                        }
                    });
                }
                else
                {
                    users = users[0];
                    if(!checkstring.checkpassword(password,users.matkhau))
                    {
                        client.dn({
                            msg : 'Mật khẩu bạn nhập chưa chính xác',
                            type : 'info',
                            loading : -1,
                            login : 
                            {
                                status : false
                            }
                        });
                    }
                    else
                    if(users.ban == 1)
                    {
                        client.dn({
                            msg : 'Tài khoản của bạn đã bị khoá bởi admin.',
                            type : 'warning', 
                            loading : -1,
                            login : {
                                status : false
                            }
                        })
                    }
                    else 
                    {
                        //users.thongtin = JSON.parse(users.thongtin)
                        users = info_acc(users);
                        
                        client.dn({
                            login : 
                            {
                                id : users.id,
                                status : true,
                                username : users.taikhoan,
                                admin : users.admin,
                                password : password,
                                vang : users.xu,
                                name : users.name,
                                avatar : users.thongtin.avatar,
                                vip_pre : users.thongtin.napxu,
                                vip_next : users.vipnext_game,
                                vip : users.vip,
                            },
                            loading : -1
                        });
                        client.id = users.id;
                        global['TOTALONLINE']-=1;
                        mysqli.query("UPDATE `nguoichoi` SET `time_online` = '"+checkstring.time().thoigian*2+"' WHERE `id` = '" + client.id + "'", function (err, users) {
                        })
                        mysqli.query("SELECT * FROM `ip` WHERE `ip` = '"+client.ip+"' AND `uid` = '"+client.id+"'",function(dgfdgf,dhggh) {
                            try 
                            {
                                if(dhggh.length <=0)
                                {
                                    if(client.ip !== undefined)
                                    {
                                        mysqli.query("INSERT INTO `ip` SET  `ip` = '"+client.ip+"', `uid` = '"+client.id+"'");
                                    }
                                }
                            }
                            catch(e)
                            {

                            }
                        });
                    }
                }
            }
            catch(e)
            {
                client.dn({
                    msg : 'Đã xẩy ra lỗi dữ liệu, vui lòng liên hệ admin.',
                    type : 'warning', 
                    loading : -1,
                    login : {
                        status : false
                    }
                })
                console.log(e)
            }
        });
    }
}

let taotaikhoan = function(client,data)
{
    console.log(data)
    let username = checkstring.html(data.username);
    let name = checkstring.html(data.name);
    let password = checkstring.html(data.password);    
    let server = data.server >> 0;
    let code = checkstring.html(data.code);
    if(code != client.code)
    {
        client.dn({
            msg : 'Mã captcha không chính xác.',
            type : 'danger',
            loading : -1,
        })
        captcha(client,{})
    }
    else
    if(server <=0 || server >9)
    {
        client.dn({
            msg : 'Vũ trụ chọn không hợp lệ',
            type : 'info',
            loading : -1,
        })
        captcha(client,{})
    }
    else
    if(!validator.isLength(username, {min: 3, max: 15}))
    {
        client.dn({
            msg : 'Tài khoản phải từ 3-15 kí tự',
            type : 'info',
            loading : -1
        });
        captcha(client,{})
    }
	else 
	if(!validator.isLength(name, {min: 3, max: 20}))
    {
        client.dn({
            msg : 'Tên nhân vật từ 3-20 ksi tự',
            type : 'info',
            loading : -1
        });
        captcha(client,{})
    }
    else 
    {
        captcha(client,{})
        mysqli.query("SELECT * FROM `ip` WHERE `ip` = '"+client.ip+"'",function(sdgd,checkip){
            try 
            {
                if(checkip.length >=5)
                {
                    client.dn({
                        msg : 'Bạn không thể đăng kí nhiều nick như thế ! Hãy liên hệ Fanpage nếu đây là lỗi !',
                        type : 'info',
                        loading : -1,
                    })
                }
                else 
                {
                    mysqli.query("SELECT `id` FROM `nguoichoi` WHERE `taikhoan` = '"+username+"' or `name` = '"+username+"' or `id` = '"+username+"'", function(err1, taikhoan){
                        try 
                        {
                            if(taikhoan.length >=1)
                            {
                                client.dn({
                                    msg : 'Tạo tài khoản thất bại, tên tài khoản đã có người sử dụng',
                                    type : 'info',
                                    loading : -1
                                });
                            }
                            else 
                            {
                                mysqli.query("SELECT `id` FROM `nguoichoi` WHERE `taikhoan` = '"+name+"' or `name` = '"+name+"' or `id` = '"+name+"'",function(err2,tennhanvat){
                                    try 
                                    {
                                        if(err2) throw err2;
                                        if(tennhanvat.length >=1)
                                        {
                                            client.dn({
                                                msg : 'Tạo tài khoản thất bại, tên nhân vật đã có người sử dụng',
                                                type : 'info',
                                                loading : -1
                                            });
                                        }
                                        else 
                                        {
                                            mysqli.query("INSERT INTO `nguoichoi` SET `thongtin` = '"+JSON.stringify({avatar : '/vendor/avatar/avatar.png'})+"', `name` = '"+name+"', `taikhoan` = '"+username+"', `matkhau` = '"+checkstring.password(password)+"', `sdt` = 'KHFREELUON', `server` = '"+server+"', `xu` = '5000000'",function(err3, reg){
                                                if(err3) throw err3;
                                                client.dn({
                                                    msg : 'Tạo tài khoản thành công ! Chúc bạn chơi game vui vẻ.',
                                                    type : 'success',
                                                    loading : -1,
                                                    reg : {
                                                        taikhoan : username,
                                                        matkhau : password
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e);
                                        client.dn({
                                            msg : 'Đã xẩy ra lỗi dữ liệu. Vui lòng liên hệ admin',
                                            type : 'danger',
                                            loading : -1,
                                        })
                                    }
                                })
                            }
                        }
                        catch(e)
                        {
                            console.log(e);
                            client.dn({
                                msg : 'Đã xẩy ra lỗi dữ liệu. Vui lòng liên hệ admin',
                                type : 'danger',
                                loading : -1,
                            })
                        }
                    });
                }
            }
            catch(e)
            {
                console.log(e);
                client.dn({
                    msg : 'Đã xẩy ra lỗi dữ liệu. Vui lòng liên hệ admin',
                    type : 'danger',
                    loading : -1,
                })
            }
        })
        
    }
}






let encode = function(x)
{
    return encodeURIComponent(x.substring(x.indexOf(",") + 1));
}

let ChangeAvatar = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Vui lòng đăng nhập để tiếp tục',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        data.img = data.img.replace('data:image/png;base64,', '');
        data.img = data.img.replace(' ', '+');
        data.img = data.img.replace('data:image/jpeg;base64,', '');
        data.img = data.img.replace('data:image/gif;base64,', '');
        request.post(
            {
                headers:
                {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Client-ID f22b79927014872'
                },
                url: 'https://api.imgur.com/3/image',
                body: "image="+encode(data.img)+"",
            },  (err, res, body) =>  {
                try {
                    let a = JSON.parse(body);
                    a = a.data;
                    if(!!a.link)
                    {
                        client.dn({
                            msg : 'Cập nhật ảnh thành công',
                            type : 'success'
                        });
                        
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(vbcvb,users){
                            if(users.length >=1)
                            {
                                users = users[0];
                                users.thongtin = JSON.parse(users.thongtin)
                                users.thongtin.avatar = a.link;
                                mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"' WHERE `id` ='"+client.id+"'",function(err,datxxa){
                                    client.dn({
                                        loading : -1,
                                    })
                                    info(client)
                                })
                            } 
                        })
                       
                    }
                    else 
                    {
                        client.dn({
                            msg : 'Cập nhật ảnh thất bại, vui lòng thử lại',
                            type : 'info',
                            loading : -1,
                        });
                    }
                } catch(e) {
                    client.dn({
                        msg : 'Không thể cập nhật ảnh, vui lòng thử lại',
                        type : 'info',
                        loading : -1,
                    });
                }
        }
        );
    }
}





let changepassword = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Chưa đăng nhập',
            type : 'info',
            loading : -1,
        });
    }
    else 
    {
        let password = checkstring.html(data.password);
        let p1 = checkstring.html(data.p2);
        let p2 = checkstring.html(data.p1);
        if(p2.length <=3)
        {
            client.dn({
                msg : 'Mật khẩu mới phải lớn hơn 3 kí tự',
                type : 'info',
                loading : -1
            });
        }
        else
        if(p2 != p1)
        {
            client.dn({
                msg : 'Mật khẩu xác nhận chưa chính xác',
                type : 'info',
                loading : -1,
            });
        }
        else 
        {
            mysqli.query("UPDATE `nguoichoi` SET `matkhau` = '"+checkstring.password(p1)+"' WHERE `id` = '"+client.id+"'",function(err,users){
                try 
                {
                    if(err) throw err;
                    client.dn({
                        msg : 'Thay đổi mật khẩu thành công',
                        type : 'success',
                        loading : -1,
                    });
                }
                catch(e)
                {
                    console.log(e);
                    client.dn({
                        msg : 'Thay đổi mật khẩu thất bại',
                        type : 'danger',
                        loading : -1,
                    });
                }
            });
        }
    }
}
let newid = function(client,data) 
{
    if(+client.id >=1)
    {
        mysqli.query("UPDATE `nguoichoi` SET `time_online` = '0' WHERE `id` = '" + client.id + "'", function (err, users) {
        });
    }
    let ip = data.resource;
    client.napthoi = 0;
    client.huycsmm = 0;
    client.nhanquavip = 0;
    client.everday = 0;
    client.ip = ip;
    client.taixiu = 0;
    client.ott = 0;
    client.csmm = 0;
    client.chuyentien = 0;
    client.id = 0;
    client.timeupdate = 0;
    client.thecao = 0;
    client.giftcode = 0;
    client.napvang = 0;
    client.thesieure = 0;
    client.vxmm = 0;
    client.acpott = 0;
    client.rutvang = 0;
    client.momo = 0;
    client.taolx = 0;
    client.nhanlx = 0;
    global['TOTALONLINE']+=1;
    
    mysqli.query("SELECT `data` FROM `config` WHERE `value` = 'thongbao'",function(err,thongbao){
        if(err) throw err;
        client.dn({
            loading : -1,
            notice : {
                text : thongbao[0].data,
            }
        })
    })
}
let update = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            vang : 0,
        });
    }
    else 
    {
        mysqli.query("SELECT `xu` FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users){
            if(err) throw err;
            if(users.length >=1)
            {
                users= users[0];
                client.dn({
                    vang : users.xu,
                });
            }
        })
    }
}

let chonserver = function(client,data) 
{
	let server = data >> 0;
	if(server >=1 && server <=9)
	{
		if(client.id <=0)
		{
			client.dn({
				msg  : 'Chưa đăng nhập',
				loading : -1,
			});
		}
		else 
		{
			mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(err,users) {
				if(users.length <=0)
				{
					client.dn({
						loading : -1,
						msg : 'Người chơi không tồn tại',
					});
				}
				else 
				{
					users = users[0];
					if(users.server != -1)
					{
						client.dn({
							loading : -1,
							msg : 'Bạn đã giới hạn số lần chọn server',
						});
					}
					else 
					{
						mysqli.query("UPDATE `nguoichoi` SET `server` = '"+server+"' WHERE `id` = '"+users.id+"'",function(err2,fff) {
							client.dn({
								loading : -1,
								msg : 'Cập nhật server thành công.'
							})
						});
					}
				}
			});
		}
	}
	else 
	{
		client.dn({
			msg : 'Máy chủ không hợp lệ',
			loading : -1,
		});
	}
}

module.exports =  function(client,data)
{
	if(!!data.chonserver)
	{
		chonserver(client,data.chonserver);
	}
    if(!!data.avatar)
    {
        ChangeAvatar(client,data.avatar)
    }
    if(!!data.update)
    {
        update(client)
    }
    if(!!data.newid)
    {
        newid(client,data);
    }
    if(!!data.checkname)
    {
        checkname(client,data.checkname);
    }
    if(!!data.reg)
    {
        taotaikhoan(client,data.reg);
    }
    if(!!data.login)
    {
        nutlogin(client,data.login);
    }
    if(!!data.info)
    {
        info(client);
    }
    if(!!data.changepass)
    {
        changepassword(client,data.changepass);
    }
}