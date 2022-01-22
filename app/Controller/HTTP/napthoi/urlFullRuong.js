let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');

module.exports = function(req,res)
{
    // thoivang,thoivangruong,map,khu,name,server
    let data = req.query;
    let server = data.server >> 0;
    let thoivang = data.thoivang >> 0;
    let thoivangruong = data.thoivangruong >> 0;
    let name = checkstring.html(data.name);
    server+=1;
    mysqli.query("SELECT * FROM `npcthoi` WHERE `server` = '"+server+"' AND `name` = '"+name+"' LIMIT 1",function(err,npcthoi){
        try 
        {
            if(npcthoi.length <=0)
            {
                mysqli.query("INSERT INTO `npcthoi` SET `name` = '"+name+"', `server` = '"+server+"', `thoivang` = '"+thoivang+"', `thoivangruong` = '"+thoivangruong+"'",function(err3,insetnew){
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
                mysqli.query("UPDATE `npcthoi` SET `name` = '"+name+"', `server` = '"+server+"', `thoivang` = '"+thoivang+"', `thoivangruong` = '"+thoivangruong+"' WHERE `id` = '"+npcthoi[0].id+"'",function(err3,insetnew){
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