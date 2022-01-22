let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');

module.exports = function(req,res)
{
    
    // thoivang,thoivangruong,map,khu,name,server
    let data = req.query;
    console.log(data)
    let server = data.server >> 0;
    let thoivang = data.thoivang >> 0;
    let thoivangruong = data.thoivangruong >> 0;
    let name = checkstring.html(data.name);
    let khu = data.khu >> 0;
    let map = checkstring.html(data.map);
    server+=1;
    mysqli.query("SELECT * FROM `npcthoi` WHERE `server` = '"+server+"' AND `name` = '"+name+"' LIMIT 1",function(err,npcthoi){
        try 
        {
            if(err) throw err;
            if(npcthoi.length <=0)
            {
                mysqli.query("INSERT INTO `npcthoi` SET `name` = '"+name+"', `server` = '"+server+"', `thoivang` = '"+thoivang+"', `thoivangruong` = '"+thoivangruong+"', `khu` = '"+khu+"', `map` = '"+map+"', `thoigian` = '"+Date.now()+"'",function(err3,insetnew){
                    try 
                    {

                    }
                    catch(e)
                    {

                    }
                })
            }
            else 
            {
                mysqli.query("UPDATE `npcthoi` SET `name` = '"+name+"', `server` = '"+server+"', `thoivang` = '"+thoivang+"', `thoivangruong` = '"+thoivangruong+"', `khu` = '"+khu+"', `map` = '"+map+"', `thoigian` = '"+Date.now()+"' WHERE `id` = '"+npcthoi[0].id+"'",function(err3,insetnew){
                    try 
                    {

                    }
                    catch(e)
                    {

                    }
                })
                
            }
            res.status(200).send('ducnghia');
        }
        catch(e)
        {
            console.log(e);
        }
    })
    
    
}