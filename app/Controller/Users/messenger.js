
/* 
    @   => TRAN DO DUC NGHIA
    #   => LISTEN USERS
*/
const request = require('request');
let captcha = require('./captcha/code.js');
let nguoichoi = require('./nguoichoi/users.js');
let pay = require('./pay/NapVang.js');
let lichsu = require('./lichsu/lichsu');
let home = require('./Home/Home');
let VXMM = require('./VXMM/export');
let csmm = require('./csmm/game');
let mail = require('./nguoichoi/Mail.js');
let giftcode = require('./nguoichoi/giftcode');
let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let Taixiu = require('./Taixiu/game.js');
let QUATANG = require('./nguoichoi/QuaVip.js');
let Topgame = require('./Top/index.js');
var fs = require('fs');
let bang = require('./Banghoi/index.js');

module.exports = function(client,data)
{
   /*
    fs.appendFile('log/'+client.id+'.txt', ""+JSON.stringify(data)+"", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      */
     if(!!data.bang)
     {
         bang(client,data.bang);
     }
    if(!!data.top)
    {
        Topgame(client,data.top)
    }
    if(!!data.qua)
    { 
        QUATANG(client,data.qua);
    }
    if(!!data.taixiu)
    {
        Taixiu(client,data.taixiu);
    }
    if(!!data.VXMM)
    {
        VXMM(client,data.VXMM);
    }
    if(!!data.giftcode)
    {
        giftcode(client,data.giftcode);
    }
    if(!!data.csmm)
    {
        csmm(client,data.csmm);
    }
    if(!!data.captcha)
    {
        captcha(client,data.captcha);
    }
    if(!!data.nguoichoi)
    {
        nguoichoi(client,data.nguoichoi);
    }
    if(!!data.pay)
    {
        pay(client,data.pay);
    }
    if(!!data.lichsu)
    { 
        lichsu(client,data.lichsu);
    }
    if(!!data.home)
    {
        home(client,data.home);
    }
    if(!!data.mail)
    {
        mail(client,data.mail);
    }
    
}