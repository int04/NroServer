let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let info =  require('../../Model/users/info');
let sodu =  require('../../Model/users/sodu');

module.exports = function(req,res)
{
    let data = req.query;
    let id = data.id;
    if(id != undefined)
    {
        mysqli.query("UPDATE `rutvang` SET `trangthai` = '0' WHERE `id` = '"+id+"'",function(err,c){
            if(err) throw err;
            res.send(`success`).status(200);
        })
    }
    else 
    {
        let name = data.name;
        let server = data.server;
        mysqli.query("SELECT * FROM `rutvang` WHERE `name` = '"+name+"' AND `server` = '"+server+"' AND `trangthai` = '1' LIMIT 1",function(err,d){
            if(err) throw err;
            if(d.length <=0)
            {
                res.send(`0|0`).status(200);
            }
            else 
            {
                res.send(``+d[0].id+`|`+d[0].vangnhan+``).status(200);
            }
        })
    }
    
}