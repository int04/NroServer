
let bcrypt = require('bcrypt');
let htmlspecialchars = require('htmlspecialchars');
let thoigianget = function()
{
	process.env.TZ = 'Asia/Ho_Chi_Minh';
    let time        =  {};
    time.ngay       = (new Date()).getDate();
    time.thang      = (new Date()).getMonth()+1;
    time.nam        = (new Date()).getFullYear();
    time.thoigian   = Date.now();
	time.ngaythangnam =``+time.nam+`-`+time.thang+`-`+time.ngay+``;
	time.start =``+time.nam+`-`+time.thang+`-01`;
	time.end =``+time.nam+`-`+time.thang+`-31`;
    return time;
}
let thoigiantinh = function(data)
{
   var result="";
   var d = new Date(+data);
   result = ``+ d.getHours()+`:`+d.getMinutes()+`:`+
   d.getSeconds()+` `+d.getDate() + `/`+(d.getMonth()+1)+`/`+d.getFullYear()+``;
   return result;
}

// mã hóa pass
let generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
}
let int = function(c)
{
	if(!parseInt(c))
	{
		return 0;
	}
	else 
	{
		return parseInt(c);
	}
}
let html = function(stringtext)
{
	let a = htmlspecialchars(stringtext)
	a = a.replace(/\\/g,'/');  
	return a;
}

// so sánh pass
let validPassword = function(password, Hash) {
	Hash = Hash.replace('$2y$', '$2a$');

	return bcrypt.compareSync(password, Hash)
}

let cutEmail = function(email) {
	let data = email.split('@');
	let string = '';
	let start = '';
	if (data[0].length > 7) {
		start = data[0].slice(0, 6);
	}else{
		start = data[0].slice(0, data[0].length-3);
	}
	return string.concat(start, '***@', data[1]);
}

let cutPhone = function(phone) {
	let string = '';
	let start = phone.slice(0, 3);
	let end   = phone.slice(phone.length-2, phone.length);
	return string.concat(start, '*****', end);
}

let validateEmail = function(t) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)
}

let checkPhoneValid = function(phone) {
	return /^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))[0-9]{7,10}$/im.test(phone);
}

let phoneCrack = function(phone) {
	let data = phone.match(/^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))/im);
	if (data) {
		return {
			region: data[0],
			phone:  phone.slice(data[0].length, phone.length),
		};
	}
	return data;
}

let nFormatter = function(t, e) {
	for (var i = [{
		value: 1e18,
		symbol: 'E'
	}, {
		value: 1e15,
		symbol: 'P'
	}, {
		value: 1e12,
		symbol: 'T'
	}, {
		value: 1e9,
		symbol: 'G'
	}, {
		value: 1e6,
		symbol: 'M'
	}, {
		value: 1e3,
		symbol: 'k'
	}], o = /\.0+$|(\.[0-9]*[1-9])0+$/, n = 0; n < i.length; n++)
		if (t >= i[n].value)
			return (t / i[n].value).toFixed(e).replace(o, '$1') + i[n].symbol;
	return t.toFixed(e).replace(o, '$1');
}



let anPhanTram = function(bet, so_nhan, ti_le, type = false){
	// so_nhan: số nhân
	// ti_le: tỉ lệ thuế
	// type: Thuế tổng, thuế gốc
	let vV = bet*so_nhan;
	let vT = !!type ? vV : bet;
	return vV-Math.ceil(vT*ti_le/100);
}

// kiểm tra chuỗi chống
let isEmpty = function(str) {
	return (!str || 0 === str.length)
}

// đổi số thành tiền
let numberWithCommas = function(number) {
	if (number) {
		let result = (number = parseInt(number)).toString().split(',');
		return result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','),
		result.join(',')
	}
	return '0'
}

// Lấy số từ chuỗi
let getOnlyNumberInString = function(t) {
	let e = t.match(/\d+/g);
	return e ? e.join('') : ''
}

// thêm số 0 trước dãy số (lấp đầy bằng số 0)
let numberPad = function(number, length) {
	// number: số
	// length: độ dài dãy số
	let str = '' + number
	while(str.length < length)
		str = '0' + str

	return str
}

let shuffle = function(array) {
	let m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random()*m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

let ThongBaoNoHu = function(io, data){
	io.clients.forEach(function(client){
		if (void 0 === client.admin && (client.auth === false || client.scene === 'home')) {
			client.red({pushnohu:data});
		}
	});
}

let ThongBaoBigWin = function(io, data){
	io.clients.forEach(function(client){
		if (void 0 === client.admin && (client.auth === false || client.scene === 'home')) {
			client.red({news:{t:data}});
		}
	});
}
let _formatMoneyVND = (num, digits) => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ]
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
}
let rand = function(min, max)
{
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min) + min);
}
let  makeid = function(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

let tienti = function(value)
{
	let a = 1000000000;
	let b = value;
	if(Math.fround(b/a) >=1) return Math.fround(b/a).toFixed(2)+' Tỉ';
	else if(Math.fround(b/1000000) >=1) return Math.fround(b/1000000).toFixed(2)+' Tr';
	else if(Math.fround(b/1000) >=1) return Math.fround(b/1000).toFixed(2)+' K';
	else  return b+'';
}
let tinhgio = function(value)
{
	let a = Date.now();
	let b = value;
	let c = (a - b)/1000;
	/* 
		Thuật toán :
		nếu a - b < 60;
	*/
	let phut = c/60;
	if(phut <= 60) return ' '+phut.toFixed(0)+'ph trước.';
	let gio = phut/60;
	if(gio >=1) return ''+gio.toFixed(0)+'h trước.';

}

module.exports = {
	int : int,
	tinhgio : tinhgio,
	tienti : tienti,
	az : makeid,
	rand : rand,
	time : thoigianget,
	thoigian : thoigiantinh,
	html : html,
	password:  generateHash,
	checkpassword: validPassword,
	anPhanTram:    anPhanTram,
	isEmpty:       isEmpty,
	number_format: numberWithCommas,
	getOnlyNumberInString: getOnlyNumberInString,
	numberPad:       numberPad,
	shuffle:         shuffle,
	validateEmail:   validateEmail,
	checkPhoneValid: checkPhoneValid,
	phoneCrack:      phoneCrack,
	nFormatter:      nFormatter,
	ThongBaoNoHu:    ThongBaoNoHu,
	ThongBaoBigWin:  ThongBaoBigWin,
	cutEmail:        cutEmail,
	cutPhone:        cutPhone,
	_formatMoneyVND: _formatMoneyVND
}
