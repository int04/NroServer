let mysqli    =     require('../../Model/mysqli');
let checkstring    =     require('../../Model/string');
let info =  require('../../Model/users/info');
let sodu =  require('../../Model/users/sodu');

module.exports = function(req,res)
{
    mysqli.query("SELECT * FROM `nguoichoi` WHERE  `nap` >= '1'  ORDER BY `nap` DESC LIMIT 10",function(err,data) {
		if(err) throw err;
		let thuong = [0,5000000,2000000,1000000,500000,250000,100000,100000,100000,100000,100000,100000];
		let i = 0;
		data.forEach(users => {
      i++;
      sodu(users.id,users.xu,thuong[i],'Chúc mừng bạn đã đứng TOP '+i+'. Hãy cố gắng giữ phong độ cho tuần này nhé.');
      mysqli.query("UPDATE `nguoichoi` SET `nap` = '0'")
    });
	});		
}