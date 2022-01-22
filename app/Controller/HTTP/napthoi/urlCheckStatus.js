let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let info =  require('../../../Model/users/info');
let sodu =  require('../../../Model/users/sodu');

let reset_napthoi = function(server)
{
    mysqli.query("SELECT * FROM `napthoi` WHERE `trangthai` = '0' AND `server` = '"+server+"'",function(err,nap){
        nap.forEach(e => {
            let time = e.thoigian + (60*1000)*5;
            if(time <= Date.now())
            {
                mysqli.query("DELETE FROM `napthoi` WHERE `id` = '"+e.id+"'")
            }
        });
    })
}

module.exports = function(req,res)
{
    let data = req.query;
    let server = data.server >> 0;
    server+=1;
    if(!!server)
    {
        reset_napthoi(server);   
        mysqli.query("SELECT * FROM `napthoi` WHERE `server` = '"+server+"' AND `trangthai` = '0' LIMIT 1",function(err,thoi){
            try 
            {
                if(thoi.length >=1)
                {
                    res.status(200).send('[Status]Online[/Status]');
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