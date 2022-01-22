let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let info =  require('../../Model/users/info');
let sodu =  require('../../Model/users/sodu');

module.exports = function(req,res)
{
    let data = req.query;
    let code = data.TrxID;
    mysqli.query("SELECT * FROM `thecao` WHERE `code` = '"+code+"' AND `stt` = '0' LIMIT 1",function(e,result){
        if(e) throw e;
        result.forEach(thecao => {
            let status = data.Code; // trạng thái thẻ
            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` =  '"+thecao.uid+"'",function(e2,dusers){
                if(e2) throw e2;
                dusers.forEach(users => {
                    /// lấy server
                    mysqli.query("SELECT * FROM `server` WHERE `server` = '"+users.server+"' LIMIT 1",function(e3,dserver){
                        if(e3) throw e3;
                        dserver.forEach(config => {
                            let tile = config.card;
                            let vangnhan = Math.round(tile * thecao.menhgia);
                            if(status !=1) vangnhan = 0;
                            /// update stt
                            mysqli.query("UPDATE `thecao` SET `stt` = '"+status+"', `vang` = '"+vangnhan+"' WHERE `id` = '"+thecao.id+"'",function(l,updatevang){
                                if(l) throw l;
                                if(vangnhan >=1)
                                {
                                    sodu(users.id,users.xu,vangnhan,'Nạp thẻ thành công','thecao',thecao.id);
                                    users.thongtin = JSON.parse(users.thongtin);
                                    users.thongtin.napxu = +users.thongtin.napxu > 0 ? +users.thongtin.napxu + vangnhan : vangnhan;
                                    mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"', `nap` = `nap` + '"+thecao.menhgia+"' WHERE `id` = '"+users.id+"'");
                                }
                                res.send('true').status(200)
                            });
                        });
                    })
                });
            })
        });
    })
    
    
}