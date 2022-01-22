let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let game    =     require('../../../Model/TaiXiu/Game');
const sodu = require('../../../Model/users/sodu');
let cuoc = game.cuoc;
let VXMM = require('../../../Model/VXMM/game');

let chonxiu = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let kq = 12;
        while (kq >= 11) {
            game.x1 = checkstring.rand(1, 6);
            game.x2 = checkstring.rand(1, 6);
            game.x3 = checkstring.rand(1, 6);
            kq = game.x1 + game.x2 + game.x3;
        }
    }
}

let chontai = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        let kq = 0;
        while (kq < 11) {
            game.x1 = checkstring.rand(1, 6);
            game.x2 = checkstring.rand(1, 6);
            game.x3 = checkstring.rand(1, 6);
            kq = game.x1 + game.x2 + game.x3;
        }
    }
}

let chon = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else 
    {
        game[data.id] = data.value;
    }
}

let chonVXMM = function(client,data)
{
    if(client.admin <=0) {
        
    }
    else 
    {
        VXMM.win = data.id;
    }
}

let chose = function(client,data)
{
    let type = data.type;
    if(type == 'tai')
    {
        let kq = checkstring.rand(50,99);
        mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `server` = '999' AND `status` = '0' ORDER BY `id` DESC LIMIT 1");
    }
    if(type == 'xiu')
    {
        let kq = checkstring.rand(1,49);
        mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `server` = '999' AND `status` = '0' ORDER BY `id` DESC LIMIT 1");
    }
    if(type == 'chan')
    {
        let kq = 1;
        while(kq%2 !=0)
        {
            kq = checkstring.rand(1,99);
            if(kq%2 ==0)
            {
                mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `server` = '999' AND `status` = '0' ORDER BY `id` DESC LIMIT 1");
            }
        }
        
    }
    if(type == 'le')
    {
        let kq = 0;
        while(kq%2 ==0)
        {
            kq = checkstring.rand(1,99);
            if(kq%2 !=0)
            {
                mysqli.query("UPDATE `phien` SET `ketqua` = '"+kq+"' WHERE `server` = '999' AND `status` = '0' ORDER BY `id` DESC LIMIT 1");
            }
        }
        
    }
}

let nap = function(client,data)
{
    if(client.admin <=0)
    {

    }
    else {
        let xu = +data.xu;
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+id+"'",function(err,c){
            if(err) throw err;
            if(c.length <=0) client.dn({loading : -1, msg : "người chơi không tồn tại"})
            c.forEach(users => {
                users.thongtin = JSON.parse(users.thongtin);
                users.thongtin.napxu = users.thongtin.napxu >0 ? users.thongtin.napxu + xu : xu;
                sodu(users.id,users.xu,xu,'Mua xu từ admin');
                mysqli.query("UPDATE `nguoichoi` SET `thongtin` = '"+JSON.stringify(users.thongtin)+"', `nap` = `nap` + '"+xu+"' WHERE `id` = '"+id+"'",function(fff,dat){
                    client.dn({
                        loading : -1,
                        msg : 'Nạp thành công',
                        type : 'success'
                    })
                })
            });
        })
    }
}

module.exports = function(client,data)
{
    if(!!data.nap)
    {
        nap(client,data.nap)
    }
    if(!!data.chose)
    {
        chose(client,data.chose);
    }
    if(!!data.chontai)
    {
        chontai(client,data)
    }
    if(!!data.chonxiu)
    {
        chonxiu(client,data)
    }
    if(!!data.chon)
    {
        chon(client,data.chon);
    }
    if(!!data.VXMM)
    {
        chonVXMM(client,data.VXMM)
    }
}