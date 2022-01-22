let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');

module.exports = function(req,res)
{
    let data = req.query;
    console.log(data)
    let server =data.server >> 0;
    let name = checkstring.html(data.name);
    let thoivang = data.thoivang >> 0;
    server+=1;
    if(!!server)
    {
        mysqli.query("SELECT * FROM `napthoi` WHERE `server` = '"+server+"' AND `trangthai` = '0' AND `name`  = '"+name+"' AND `thoivang` = '"+thoivang+"' LIMIT 1",function(err,thoi){
            try 
            {
                if(thoi.length >=1)
                {
                    thoi = thoi[0]
                    let xunhan = thoivang * 36500000;
                    mysqli.query("UPDATE `napthoi` SET `trangthai` = '1' WHERE `id` = '"+thoi.id+"'",function(xcv,updatethoi){
                        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+thoi.uid+"'",function(xcv,users){
                            if(users.length >=1)
                            {
                                users = users[0];
                                sodu(users.id,users.xu,xunhan,'Nạp x'+thoivang+' thỏi vàng tự động','napthoi',thoi.id)
                            }
                            res.status(200).send('Nap thanh cong');
                        })
                    })
                }
                else 
                {
                    res.status(200).send('[no][/no]')
                }
            }
            catch(e)
            {
                console.log(e)
                res.status(200).send('Đã xẩy ra lỗi dữ liệu')
            }
        })
    }    
    
    
}