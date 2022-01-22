let mysqli      =     require('../../Model/mysqli');
let time        =     require('../../Model/string');

let sodu =  function(id,xuhientai,xuthaydoi,noidung,nguon,keycode)
{
    if(!nguon) nguon = '';
    if(!keycode) keycode >> 0;
    xuthaydoi = +xuthaydoi;
    xuhientai = +xuhientai;
    mysqli.query("INSERT INTO `sodu` SET `nguon` = '"+nguon+"', `key` = '"+keycode+"', `uid` = '"+id+"', `truoc` = '"+xuhientai+"', `sau` = '"+(xuhientai+xuthaydoi)+"', `thoigian` = '"+time.time().thoigian+"', `xu` = '"+xuthaydoi+"', `noidung` = '"+noidung+"'",function(err,show){
        if(err) throw err;
        mysqli.query("UPDATE `nguoichoi` SET `xu` = `xu` + '"+xuthaydoi+"' WHERE `id` = '"+id+"'",function(err2,update){
            if(err2) throw err2;
            /* insert xóa lsgd */
            mysqli.query("SELECT `id` FROM `sodu` where `uid` = '"+id+"' ORDER BY `id` DESC LIMIT 100",function(loi2,teamv){
                if(loi2) throw loi2;
                if(teamv.length >= 99)
                {
                    let dulieu = teamv[teamv.length-1].id;
                    mysqli.query("SELECT * FROM `sodu` where `id` <= '"+dulieu+"' and `uid` = '"+id+"'",function(loi4,toanbo){
                        toanbo.forEach(e => {
                            mysqli.query("DELETE FROM `sodu` WHERE `id` = '"+e.id+"'",function(loi6,xoasodu){
                                if(e.key >=1 && e.nguon != 'thecao' && e.nguon != 'rutvang' && e.nguon != 'napvang' && e.nguon != 'momo' && e.nguon != 'thesieure')
                                {
                                    mysqli.query("DELETE FROM `"+e.nguon+"` WHERE `id` = '"+e.key+"'",function(loidd,xoatiep){

                                    })
                                }
                            })
                        });
                    })
                }
                else 
                {
                    /* xóa số dư 7 ngày */
                    
                }
            })
       });
    });
    
}
module.exports = sodu;       