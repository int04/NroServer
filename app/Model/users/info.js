let mysqli      =     require('../../Model/mysqli');
let time        =     require('../../Model/string');
module.exports = function(data)
{
    let u = data;
    let r = '';
    if(u.admin == 4) r =  '9C00FA';
    else if(u.admin ==3) r = 'ff9800';
    else if(u.admin == 2) r = 'FA0000';
    else if(u.admin == 1) r = '0B614B';
    else r = '000000';
    u.ten = u.name;
    u.thongtin = JSON.parse(data.thongtin)
    let vip = '';
    let font = ["","text-shadow: 0 0 0.2em #666666, 0 0 0.2em #666666,  0 0 0.2em #666666","text-shadow: 0 0 0.2em #ff33ff, 0 0 0.2em #ff33ff, 0 0 0.2em #ff33ff","text-shadow: 0 0 0.2em #ff6633, 0 0 0.2em #ff6633,  0 0 0.2em #ff6633","text-shadow: 0 0 0.2em #3399ff, 0 0 0.2em #3399ff,  0 0 0.2em #3399ff","text-shadow: 0 0 0.2em #ff0000, 0 0 0.2em #ff0000,  0 0 0.2em #ff0000","text-shadow: 0 0 0.2em #ff3399, 0 0 0.2em #ff3399,  0 0 0.2em #ff3399","text-shadow: 0 0 0.2em #009900, 0 0 0.2em #009900,  0 0 0.2em #009900","text-shadow: 0 0 0.2em #0000ff, 0 0 0.2em #0000ff,  0 0 0.2em #0000ff","text-shadow: 0 0 0.2em #0000ff, 0 0 0.2em #0000ff,  0 0 0.2em #0000ff","text-shadow: 0 0 0.2em #9932CC, 0 0 0.2em #9932CC,  0 0 0.2em #9932CC","text-shadow: 0 0 0.2em #F08080, 0 0 0.2em #F08080,  0 0 0.2em #F08080"];
    if(u.vip >= 1) vip = ' - <font color="white" style="'+font[u.vip]+'; font-size: 14px;"><b>VIP '+u.vip+'</b></font>';
    
    u.danhhieu = JSON.parse(u.danhhieu);
    u.danhhieu.thang_taixiu = +u.danhhieu.thang_taixiu >= u.danhhieu.thang_taixiu ? 1 : 0;
    let danhhieu = '';
    if(u.danhhieu.thang_taixiu >= 1) danhhieu = '<i style="-webkit-animation: hue 1s linear infinite;"><b><font color="ff9900" style="text-shadow: 3px 3px 11px #ff9900;"><img src="/vendor/vip/vip10.gif" style="width: 16px;float: none;">[T</font><font color="red" style="text-shadow: 3px 3px 11px #ff0000;">o</font><font color="green" style="text-shadow: 3px 3px 11px #009900;">p.</font><font color="0099ff" style="text-shadow: 3px 3px 11px #red;">'+u.danhhieu.thang_taixiu+'</font> <font color="0099ff" style="text-shadow: 3px 3px 11px #0099ff;"> T</font><font color="9932CC" style="text-shadow: 3px 3px 11px #9932CC;">X] </font></b></i>';
    else if(u.danhhieu.thua_taixiu >= 1) danhhieu = '<i style="-webkit-animation: hue 1s linear infinite;"><b><font color="ff9900" style="text-shadow: 3px 3px 11px #ff9900;"><img src="/vendor/vip/vip4.gif" style="width: 16px;float: none;">[T</font><font color="red" style="text-shadow: 3px 3px 11px #ff0000;">o</font><font color="green" style="text-shadow: 3px 3px 11px #009900;">p.</font><font color="0099ff" style="text-shadow: 3px 3px 11px #red;">'+u.danhhieu.thua_taixiu+'</font> <font color="0099ff" style="text-shadow: 3px 3px 11px #0099ff;"> T</font><font color="9932CC" style="text-shadow: 3px 3px 11px #9932CC;">X] </font></b></i>';
    else 
    if(u.danhhieu.thang_chanle >= 1) danhhieu = '<i style="-webkit-animation: hue 1s linear infinite;"><b><font color="ff9900" style="text-shadow: 3px 3px 11px #ff9900;"><img src="/vendor/vip/vip10.gif" style="width: 16px;float: none;">[T</font><font color="red" style="text-shadow: 3px 3px 11px #ff0000;">o</font><font color="green" style="text-shadow: 3px 3px 11px #009900;">p.</font><font color="0099ff" style="text-shadow: 3px 3px 11px #red;">'+u.danhhieu.thang_chanle+'</font> <font color="0099ff" style="text-shadow: 3px 3px 11px #0099ff;"> C</font><font color="9932CC" style="text-shadow: 3px 3px 11px #9932CC;">L] </font></b></i>'; 
    else if(u.danhhieu.thua_chanle >= 1) danhhieu = '<i style="-webkit-animation: hue 1s linear infinite;"><b><font color="ff9900" style="text-shadow: 3px 3px 11px #ff9900;"><img src="/vendor/vip/vip4.gif" style="width: 16px;float: none;">[T</font><font color="red" style="text-shadow: 3px 3px 11px #ff0000;">o</font><font color="green" style="text-shadow: 3px 3px 11px #009900;">p.</font><font color="0099ff" style="text-shadow: 3px 3px 11px #red;">'+u.danhhieu.thua_chanle+'</font> <font color="0099ff" style="text-shadow: 3px 3px 11px #0099ff;"> C</font><font color="9932CC" style="text-shadow: 3px 3px 11px #9932CC;">L] </font></b></i>';

    u.name = ` <b href="#`+u.id+`">[`+u.server+`]<font color="green"></font><font color="#`+r+`">`+danhhieu+` `+(u.admin == 1 ? '<i class="fas fa-hamburger"></i>' : '')+``+u.ten+` </font> `+vip+` `+(u.bang >=1 ? '<img src="/vendor/bang/'+u.bang+'.png" style=" max-width: auto; height: 30px" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt="">' : '')+` </b>`;
    let update = 0;
    let XUVIP = [3000000000,19000000000,39000000000,57500000000,99654530000,120563215000,190563215000,269898321000,390456123000,590654987000,650654987000];
	u.vipnext_game = XUVIP[u.vip];
	u.thongtin.napxu = +u.thongtin.napxu > 0 ? +u.thongtin.napxu : 0;
	if(u.vip < 9)
	{
		if(u.thongtin.napxu >= u.vipnext_game)
		{
			mysqli.query("UPDATE `nguoichoi` SET `vip` = `vip` + '1' WHERE `id` = '"+u.id+"'");
		}
	}
    return u;
}