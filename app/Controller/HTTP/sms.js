let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let info =  require('../../Model/users/info');
let sodu =  require('../../Model/users/sodu');

module.exports = function(req,res)
{
    let data = req.query;
    let code = data.code;
    let subCode = data.subCode;
    let mobile = data.mobile;
    let serviceNumber = data.serviceNumber;
    let info = data.info;
    let sms = info.split(" ");
    let ma = sms[2].toUpperCase();

    if(ma == "KH")
    {
        let taikhoan = checkstring.html(sms[3]);
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `taikhoan`  = '"+taikhoan+"' LIMIT 1", function(err,users){
            if(err) throw err;
            if(users.length <=0)
            {
                res.status(200).send("0|Tai khoan khong ton tai, vui long kiem tra lai")
            }
            else 
            {
                users = users[0];
                if(users.sdt.length >=4)
                {
                    res.status(200).send('0|Tai khoan da duoc kich hoat, khong the kich hoat nua')
                }
                else 
                {
                    mysqli.query("SELECT * FROM `phone` WHERE `phone` = '"+mobile+"'",function(err2,phone){
                        if(phone.length >=1)
                        {
                            res.status(200).send('0|So dien thoai da co nguoi khac dang ki, vui long chon so dien thoai khac');
                        }
                        else 
                        {
                            mysqli.query("INSERT INTO `phone` SET `uid` = '"+users.id+"', `phone` = '"+mobile+"', `thoigian` = '"+checkstring.time().thoigian+"'",function(err3,insertphone){
                                /* Update users */
                                mysqli.query("UPDATE `nguoichoi` SET `sdt` = '"+mobile+"' WHERE `id` = '"+users.id+"'",function(err4,updateusers){
                                    sodu(users.id,users.xu,20000,'Xác minh số điện thoại thoại');
                                    res.status(200).send('0| Xac minh thanh cong. Chuc ban choi game vui ve.')
                                })
                            })
                        }
                    })
                }
            }
        })
    }
    
    
}