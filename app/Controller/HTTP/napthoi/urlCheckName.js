let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');

module.exports = function(req,res)
{
    let data = req.query;
    let server = data.server >> 0;
    let name = checkstring.html(data.name);
    server+=1;
    if(!!server)
    {
        mysqli.query("SELECT * FROM `napthoi` WHERE `server` = '"+server+"' AND `trangthai` = '0' AND `name`  = '"+name+"' LIMIT 1",function(err,thoi){
            try 
            {
                if(thoi.length >=1)
                {
                    thoi = thoi[0]
                    res.status(200).send(`[name]`+thoi.name+`[/name] [server]`+(thoi.server-1)+`[/server] [thoivang]`+thoi.thoivang+`[/thoivang]`);
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