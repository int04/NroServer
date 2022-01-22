let mysqli    =     require('../../../Model/mysqli');
let checkstring    =     require('../../../Model/string');
let validator   = require('validator');
let request = require('request');
let md5 = require('md5');
let info    =     require('../../../Model/users/info');
let sodu    =     require('../../../Model/users/sodu');

let expbang = [10000000000,50000000000,190000000000,390000000000,690000000000,990000000000,1590000000000];
let index = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        /* chưa vào bang */
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"' LIMIT 1",function(er,thanhvien){
            try 
            {
                if(thanhvien.length <=0)
                {
                    /* Chưa vào */
                    /* Ngẫu nhiên bang */
                    mysqli.query("SELECT * FROM `banghoi` ORDER BY RAND() LIMIT 10",function(err2,bang){
                        let array = [];
                        bang.forEach(e => {
                            array.push({
                                id : e.id,
                                name : e.name,
                                icon : e.icon,
                                MIN : e.MIN,
                                MAX : e.MAX,
                                khauhieu : e.khauhieu,
    
                            })
                        });
                        client.dn({
                            bang : {
                                index : {
                                    data : array
                                },
                                thamgia : -1,
                            },
                            loading : -1,
                            
                        })
                    })
                }
                else 
                {
                    thanhvien = thanhvien[0];
                    /* Vào bang */
                    mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+thanhvien.bang+"'",function(e3,bang){
                        if(bang.length >=1)
                        {
                            bang = bang[0];
                            if(bang.exp >= expbang[bang.level] && bang.level <=5)
                            {
                                mysqli.query("UPDATE `banghoi` SET `level` = `level` + '1', `MAX` = `MAX` + '2' WHERE `id` = '"+bang.id+"'")
                            }
                            if(client.id == bang.uid)
                            {
                                mysqli.query("SELECT count(`id`) as `men` FROM `banghoi_xin` WHERE `bang` = '"+bang.id+"'",function(xcv,tongxin){
                                    if(xcv) throw xcv;
                                    client.dn({
                                        bang : {
                                            tongxin : tongxin[0].men,
                                        }
                                    })
                                })
                            }
                            client.dn({
                                bang : {
                                    view : {
                                        id : bang.id,
                                        name : bang.name,
                                        khauhieu : bang.khauhieu,
                                        bangchu : client.id == bang.uid ? '1' : -1,
                                        xu : checkstring.tienti(bang.xu),
                                        level : ''+bang.level+' + '+Math.fround(bang.exp/expbang[bang.level]).toFixed(2)+'%',
                                    }
                                },
                                loading : -1,
                                thamgia : 1,
                            })
                            /* chat */
                            mysqli.query("SELECT * FROM `banghoi_chat` WHERE `bang` = '"+bang.id+"' ORDER BY `id` DESC LIMIT 15",function(e4,chat){
                                let array = 0;
                                let html = ``;
                                chat.forEach(e => {
                                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.uid+"'",function(e5,users){
                                        if(users.length >=1)
                                        {
                                            users = users[0]
                                            html+=`<div class="ptItem" onclick="info_u(`+users.id+`,`+bang.id+`)">
                                            <div class="row" style="margin: 0;">
                                              <div class="col-8" style="padding-left: 5px; padding-right: 0px;">
                                                <p class="ptScreenName" style="color: `+(users.id == bang.uid ? 'red' : 'green')+`;">`+users.name+` <small>(Số dư: `+checkstring.tienti(users.xu)+`)</small></p>
                                                <small class="ptScrenText">`+e.noidung+`</small>
                                              </div>
                                              <div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">
                                                `+checkstring.tinhgio(e.thoigian)+`
                                              </div>
                                            </div>
                                          </div>`;
                                        }
                                        array++;
                                        if(array == chat.length)
                                        {
                                            client.dn({
                                                bang : {
                                                    boxchat : html,
                                                }
                                            })
                                        }
                                    })
                                });
                            })
                        }
                    })
                }
            }
            catch(e) {
                console.log(e)
            }
        })
    }
}

let geticon = function(client)
{
    mysqli.query("SELECT * FROM `banghoi_icon` ORDER BY `xu` ASC", function(err,bang){
        try 
        {
            let array = [];
            bang.forEach(e => {
                array.push({
                    id : e.id,
                    icon : e.icon,
                    xu : e.xu, 
                })
            });
            client.dn({
                bang : {
                    icon : {
                        data : array,
                    }
                }
            })
        }
        catch(e)
        {
            console.log(e)
        }
    })
}


let tao = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        let name = checkstring.html(data.name);
        let id = data.id >> 0;
        if(name.length <=5 || name.length >50)
        {
            client.dn({
                loading : -1,
                bang  : {
                    msg : 'Tên bang tối thiểu từ 5-50 kí tự thôi.'
                }
            })
        }
        else 
        {
            mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(err,checktrue){
                try 
                {
                    if(checktrue.length >=1)
                    {
                        client.dn({
                            loading : -1,
                            bang : {
                                msg : 'Bạn đã tham gia bang rồi.'
                            }
                        })
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `banghoi_icon` WHERE `id` = '"+id+"'",function(er2,iconbang){
                            try 
                            {
                                if(iconbang.length <=0)
                                {
                                    client.dn({
                                        loading : -1,
                                        bang : {
                                            msg : 'Không tìm thấy icon bang này.'
                                        }
                                    })
                                }
                                else 
                                {
                                    mysqli.query("SELECT * FROM `banghoi` WHERE `name` = '"+name+"'",function(e3,bang){
                                        try 
                                        {
                                            if(bang.length >=1)
                                            {
                                                client.dn({
                                                    loading : -1,
                                                    bang : {
                                                        msg : 'Tên bang đã có người sử dụng rồi',
                                                    }
                                                })
                                            }
                                            else 
                                            {
                                                iconbang = iconbang[0];
                                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(e4,users){
                                                    try 
                                                    {
                                                        if(users.length >=1)
                                                        {
                                                            users = users[0];
                                                            if(users.xu < iconbang.xu)
                                                            {
                                                                client.dn({
                                                                    loading : -1,
                                                                    bang : {
                                                                        msg : 'Tài khoản của bạn không có đủ vàng để thực hiện'
                                                                    }
                                                                })
                                                            }
                                                            else 
                                                            {
                                                                mysqli.query("INSERT INTO `banghoi` SET `name` = '"+name+"', `icon` = '"+iconbang.icon+"', `MIN` = '1', `MAX` = '20', `time` = '"+checkstring.time().thoigian+"', `uid` = '"+client.id+"'",function(e5,newid){
                                                                    try 
                                                                    {
                                                                        let idbang = newid.insertId;
                                                                        mysqli.query("INSERT INTO `banghoi_thanhvien` SET `uid` = '"+client.id+"', `bang` = '"+idbang+"', `thoigian` = '"+checkstring.time().thoigian+"', `quyen` = '1'",function(e6,newiduid){
                                                                            try
                                                                            {
                                                                                sodu(users.id,users.xu,-iconbang.xu,'Tạo bang');
                                                                                mysqli.query("UPDATE `nguoichoi` SET `bang` = '"+iconbang.icon+"' WHERE `id` = '"+client.id+"'")
                                                                                client.dn({
                                                                                    loading : -1,
                                                                                    bang : {
                                                                                        msg : 'Tạo bang thành công.'
                                                                                    },
                                                                                    vang : users.xu - iconbang.xu,
                                                                                })
                                                                                index(client,{}); //callbackindex
                                                                            }
                                                                            catch(e)
                                                                            {
                                                                                console.log(e)
                                                                            }
                                                                        })
                                                                    }
                                                                    catch(e)
                                                                    {
                                                                        console.log(e)
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    }
                                                    catch(e)
                                                    {
                                                        console.log(e)
                                                    }
                                                })
                                            }
                                        }
                                        catch(e)
                                        {
                                            console.log(e)
                                        }
                                    })
                                }
                            }
                            catch(E)
                            {
                                console.log(E)
                            }
                        })
                    }
                }
                catch(e)
                {
                    console.log(e);
                }
            })
        }

    }
}

let infobang = function(client,data)
{
    let id = data.id >> 0;

    mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+id+"'",function(err,bang){
        try {
            if(err) throw err;
            if(bang.length <=0)
            {
                client.dn({
                    loading : -1,
                    bang : {
                        msg : 'Không tìm thấy bang hội này'
                    }
                })
            }
            else 
            {
                bang = bang[0];
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+bang.uid+"'",function(ss,users){
                    try 
                    {
                        if(users.length >=1)
                        {
                            users = users[0]
                            client.dn({
                                loading : -1,
                                bang : {
                                    source : {
                                        id : "#alertInfoPt",
                                        html : `<div class="alertInfoContent" style="padding-top: 5px;">
                                        <div class="" style="float: left;">
                                          <img src="/vendor/bang/`+bang.icon+`.png" alt="Nro.Club Bang hội" style="width:50px; height: 50px; display: inline-block">
                                        </div>
                                        <div style="text-align: center;">
                                          <p style="margin: 0px; font-weight: bold; color: #501c04">`+bang.name+`</p>
                                          <small style="color: blue">`+bang.khauhieu+`</small>
                                        </div>
                                        <hr class="mt-2 mb-2">
                                        <div>
                                          <p style="font-weight: bold; color: red; text-align: center; margin-bottom: 0px;">Bang chủ: `+users.name+`
                                          </p>
                                          <p style="font-weight: bold; color: green; text-align: center; margin-bottom: 0px;">Thành tích:
                                          `+checkstring.number_format(bang.xu)+` - Cấp độ bang : `+bang.level+` + `+Math.fround(bang.exp/expbang[bang.level]).toFixed(2)+`%</p>
                                          <p style="text-align: center; margin-bottom: 0px;">Thành viên: `+bang.MIN+`/`+bang.MAX+`</p>
                                          <p style="text-align: center;">
                                            Ngày thành lập: `+checkstring.thoigian(bang.time)+`
                                          </p>
                                        </div>
                                      </div>
                                      <div id="alertBtnThamGia" style="padding: 5px 5px;">
                                        <div style="float: left;">
                                          <button class="ptAlertBtn" style="padding-bottom: 3px" onclick="ptThamGia(`+bang.id+`)">Tham<br>gia</button>
                                        </div>
                                        <button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="ptMember(`+bang.id+`)">Thành<br>Viên</button>
                                        <button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng<br>Lại</button>
                                       
                                        </div>`,
                                    }
                                }
                            })
                        }
                    }
                    catch(e)
                    {
                        console.log(e)
                    }
                })
                
            }
        }
        catch(e)
        {
            console.log(e)
        }
    })
}

let xin = function(client,data)
{
    if(client.id <=0)
    {
        client.dn({
            bang : {
                msg : 'Chưa đăng nhập'
            }
        })
    }
    else 
    {
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+id+"'",function(err,bang){
            try 
            {
                if(err) throw err;
                if(bang.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Không tìm thấy bang hội này'
                        }
                    })
                }
                else 
                {
                    bang  = bang[0];
                    mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(err2,men){
                        try 
                        {
                            if(err2) throw err2;
                            if(men.length >=1)
                            {
                                client.dn({
                                    loading : -1,
                                    bang : {
                                        msg : 'Bạn đã tham gia bang hội rồi.'
                                    }
                                })
                            }
                            else 
                            {
                                mysqli.query("SELECT * FROM `banghoi_xin` WHERE `uid` = '"+client.id+"' AND `bang` = '"+id+"'",function(e3,xinvao){
                                    try 
                                    {
                                        if(xinvao.length >=1)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang : {
                                                    msg : 'Bạn đã xin vào bang này rồi. Vui lòng chờ bang chủ duyệt'
                                                }
                                            })
                                        }
                                        else 
                                        if(bang.MIN >= bang.MAX)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang  : {
                                                    msg : 'Số lượng thành viên của bang hội đã đạt tối đa, vui lòng liên hệ bang chủ để nâng cấp bang.'
                                                }
                                            })
                                        }
                                        else 
                                        {
                                            mysqli.query("INSERT INTO `banghoi_xin` SET `uid` = '"+client.id+"', `bang` = '"+id+"', `time` = '"+checkstring.time().thoigian+"'",function(dgfg,insert){
                                                client.dn({
                                                    loading : -1,
                                                    bang : {
                                                        msg : 'Xin gia nhập thành công, vui lòng chờ bang chủ duyệt'
                                                    }
                                                })
                                            })
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                            }
                        } 
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            } catch(e)
            {
                console.log(e)
            }
        })
    }
}

let menber = function(client,data)
{
    if(client.id <=0)
    {

    }
    else 
    {
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+id+"'",function(err,bang){
            try
            {
                if(err) throw err;
                if(bang.length >=1)
                {
                    bang = bang[0]
                    /* lấy thành viên */
                    mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `bang` = '"+bang.id+"' ORDER BY `quyen` DESC",function(e3,men){
                        try 
                        {
                            let array = 0;
                            let html  = ``;
                            if(e3) throw e3;
                            men.forEach(e => {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.uid+"'",function(e4,users){
                                    try {
                                        if(users.length >=1)
                                        {
                                            users = users[0];
                                            html+=`<div class="ptItem">
                                            <div class="row" style="margin: 0;">
                                              <div class="col-6" style="padding-left: 5px; padding-right: 0px;">
                                                <p class="ptScreenName" style="color: `+(e.quyen == 1 ? 'red' : 'black')+`">`+users.name+`</p>
                                                <small class="ptScrenText">Thành tích: `+checkstring.tienti(e.thanhtich)+`</small>
                                              </div>
                                              <div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px">
                                                <small style="color: red">Số dư: `+checkstring.number_format(users.xu)+`</small><br>
                                                <small class="ptScrenText">Tham gia: `+checkstring.thoigian(e.thoigian)+`</small>
                                              </div>
                                            </div>
                                          </div>`;
                                        }
                                        array++;
                                        if(array == men.length)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang : {
                                                    source : {
                                                        id : "#ptList",
                                                        html : html,
                                                    }
                                                }
                                            })
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                                
                        
                            });
                        }
                        catch(e) {
                            console.log(e)
                        }
                    })
                }
                else 
                {
                    client.dn({
                        msg : 'Bang không tồn tại',
                        loading : -1,
                    })
                }
            }
            catch(e) {
                console.log(e)
            }
        })
    }
}

let chatbox = function(client,data)
{
    if(client.id <=0)
    {

    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(err,men){
            try 
            {
                if(err) throw err;
                if(men.length >=1)
                {
                    let text = checkstring.html(data.text);
                    if(text.length <=0 || text.length >500)
                    {
                        client.dn({
                            loading  : -1,
                            bang : {
                                msg : 'Nội dung chát từ 1- 500 kí tự'
                            }
                        })
                    }
                    else 
                    {
                        men = men[0];
                        mysqli.query("INSERT INTO `banghoi_chat` SET `bang` = '"+men.bang+"', `uid` = '"+men.uid+"', `noidung` = '"+text+"', `thoigian` = '"+checkstring.time().thoigian+"'",function(e4,newchat){
                            try 
                            {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(cc,users){
                                    try 
                                    {
                                        if(users.length >=1)
                                        {
                                            users = users[0];
                                            client.dn({
                                                loading : -1,
                                            })
                                            mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `bang` = '"+men.bang+"'",function(e45,allmen){
                                                try 
                                                {
                                                    allmen.forEach(e => {
                                                        io.to({
                                                            bang : {
                                                                newchat : `<div class="ptItem" onclick="onclick="info_u(`+users.id+`,`+men.bang+`)"">
                                                                <div class="row" style="margin: 0;">
                                                                  <div class="col-8" style="padding-left: 5px; padding-right: 0px;">
                                                                    <p class="ptScreenName" style="color: `+(men.quyen == 1 ? 'red' : 'green')+`;">`+users.name+` <small>(Số dư: `+checkstring.tienti(users.xu)+`)</small></p>
                                                                    <small class="ptScrenText">`+text+`</small>
                                                                  </div>
                                                                  <div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">
                                                                    0p trước
                                                                  </div>
                                                                </div>
                                                              </div>`
                                                            }
                                                        },e.uid)
                                                    });
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                            })
                                           
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                            }
                            catch(e)
                            {
                                console.log(e)
                            }
                            
                        })
                    }
                }
                else 
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Bạn chưa vào bang hội'
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}


let menber2 = function(client,data)
{
    if(client.id <=0)
    {

    }
    else 
    {
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+id+"'",function(err,bang){
            try 
            {
                if(err) throw err;
                if(bang.length >=1)
                {
                    bang = bang[0]
                    /* lấy thành viên */
                    mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `bang` = '"+bang.id+"' ORDER BY `quyen` DESC",function(e3,men){
                        try 
                        {
                            let array = 0;
                            let html  = ``;
                            if(e3) throw e3;
                            men.forEach(e => {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.uid+"'",function(e4,users){
                                    try {
                                        if(users.length >=1)
                                        {
                                            users = users[0];
                                            html+=`<div class="ptItem" onclick="info_u(`+users.id+`,`+bang.id+`)">
                                            <div class="row" style="margin: 0;">
                                              <div class="col-6" style="padding-left: 5px; padding-right: 0px;">
                                                <p class="ptScreenName" style="color: `+(e.quyen == 1 ? 'red' : 'black')+`">[`+(users.time_online>0 ? '<font color="green">ON</font>' :'<font color="blue">OFF</font>')+`] `+users.name+` </p>
                                                <small class="ptScrenText">Thành tích: `+checkstring.tienti(e.thanhtich)+`</small>
                                              </div>
                                              <div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px">
                                                <small style="color: red">Số dư: `+checkstring.number_format(users.xu)+`</small><br>
                                                <small class="ptScrenText">Tham gia: `+checkstring.thoigian(e.thoigian)+`</small>
                                              </div>
                                            </div>
                                          </div>`;
                                        }
                                        array++;
                                        if(array == men.length)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang : {
                                                    source : {
                                                        id : "#ptList",
                                                        html : html,
                                                    }
                                                }
                                            })
                                        }
                                    }catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                                
                        
                            });
                        }
                        catch (e)
                        {
                            console.log(e)
                        }
                    })
                }
                else 
                {
                    client.dn({
                        msg : 'Bang không tồn tại',
                        loading : -1,
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}
let kick = function(client,data)
{
    let id = data.id >> 0;
    if(client.id <=0)
    {

    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+id+"'",function(err,men){
            try 
            {
                if(err) throw err;
                if(men.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang: {
                            msg : 'Người chơi chưa vào bang nào.'
                        }
                    })
                }
                else 
                {
                    men = men[0];
                    mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+men.bang+"'",function(err2,bang){
                        try 
                        {
                            if(bang.length <=0)
                            {
                                client.dn({
                                    bang : {
                                        msg : 'bang hội không tồn tại'
                                    },
                                    loading : -1,
                                })
                            }
                            else 
                            {
                                bang = bang[0];
                                if(bang.uid != client.id)
                                {
                                    client.dn({
                                        bang : {
                                            msg : 'Bạn không phải bang chủ',
        
                                        },
                                        loading : -1,
                                    })
                                }
                                else 
                                if(id == client.id)
                                {
                                    client.dn({
                                        loading : -1,
                                        bang : {
                                            msg : 'Bạn không thể kích chính bạn'
                                        }
                                    })
                                }
                                else 
                                {
                                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+id+"'",function(hfgh,users){
                                        try 
                                        {
                                            if(users.length <=0)
                                            {
            
                                            }
                                            else 
                                            { 
                                                users = users[0];
                                                mysqli.query("UPDATE `banghoi` SET `MIN` = `MIN` - '1', `xu` = `xu` - '"+men.thanhtich+"' WHERE `id` = '"+bang.id+"'",function(dfg,capnhat){
                                                    try 
                                                    {
                                                        mysqli.query("UPDATE `nguoichoi` SET `bang` = '0' WHERE `id` = '"+users.id+"'",function(ssd,duoiussrs){
                                                            try 
                                                            {
                                                                mysqli.query("DELETE FROM `banghoi_thanhvien` WHERE `uid` = '"+users.id+"'",function(ssd,delte){
                                                                    try 
                                                                    {
                                                                        chatbox(client,{text : ' '+users.name+' bị mời ra khỏi bang.'})
                                                                        menber2(client,{id : bang.id});
                                                                        client.dn({
                                                                            loading : -1,
                                                                            bang : {
                                                                                hide : {
                                                                                    id : "#ptAlertKickMember"
                                                                                }
                                                                            }
                                                                        })
                                                                        index(client)
                                                                    }
                                                                    catch(e)
                                                                    {
                                                                        console.log(e)
                                                                    }
                                                                })
                                                            }
                                                            catch(e)
                                                            {
                                                                console.log(e)
                                                            }
                                                        })
                                                    }
                                                    catch(e)
                                                    {
                                                        console.log(e)
                                                    }
                                                })
                                            }
                                        }
                                        catch(e)
                                        {
                                            console.log(e)
                                        }
                                    })
                                }
                            }
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}


let out = function(client)
{
    mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(err,men){
        try 
        {
            if(men.length <=0)
            {
                client.dn({
                    loading : -1,
                    bang : {
                        msg : 'Bạn chưa tham gia bang nào'
                    }
                })
            }
            else 
            {
                men = men[0];
                mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+men.bang+"'",function(e2,bang){
                    try 
                    {
                        if(bang.length >=1)
                        {
                            bang = bang[0];
                            if(client.id == bang.uid)
                            {
                                client.dn({
                                    loading : -1,
                                    bang : {
                                        msg : 'Bạn là bang chủ nên không thể thoát'
                                    }
                                })
                            }
                            else 
                            {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '" + client.id + "'", function (errsdfs, users) {
                                    try 
                                    {
                                        if (users.length >= 1) {
                                            users = users[0];
                                            chatbox(client, { text: ' ' + users.name + ' rời bang.' })
                                            mysqli.query("UPDATE `banghoi` SET `MIN` = `MIN` - '1' WHERE `id` = '" + bang.id + "'", function (sdg, updaebang) {
                                                try 
                                                {
                                                    mysqli.query("UPDATE `nguoichoi` SET `bang` = '0' WHERE `id` = '" + client.id + "'", function (dfg, updateusers) {
            
                                                        try 
                                                        {
                                                            mysqli.query("DELETE FROM `banghoi_thanhvien` WHERE `uid` = '" + client.id + "' ", function (asdfasdf, xoakhoidulieu) {
                                                                client.dn({
                                                                    loading: -1,
                                                                    bang: {
                                                                        hide: {
                                                                            id: "#ptAlertRoiBang"
                                                                        }
                                                                    }
                                                                })
                    
                                                            })
                                                        }
                                                        catch(e)
                                                        {
                                                            console.log(e)
                                                        }
                
                                                    }) 
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                            })
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                            }
                        }
                    }
                    catch(e)
                    {
                        console.log(e)
                    }
                })
            }
        }
        catch(e)
        {
            console.log(e)
        }
    })
}


let xinvao = function(client,data)
{
    if(client.id <=0)
    {

    }
    else 
    {
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+id+"'",function(err,bang){
            try 
            {
                if(err) throw err;
                if(bang.length >=1)
                {
                    bang = bang[0]
                    /* lấy thành viên */
                    mysqli.query("SELECT * FROM `banghoi_xin` WHERE `bang` = '"+bang.id+"' ORDER BY `time` DESC",function(e3,men){
                        try 
                        {
                            let array = 0;
                            let html  = ``;
                            if(e3) throw e3;
                            if(men.length <=0)
                            {
                                index(client)
                                client.dn({
                                    loading : -1,
                                    bang : {
                                        msg : 'Không có ai xin vào cả.'
                                    }
                                })
                            }
                            men.forEach(e => {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+e.uid+"'",function(e4,users){
                                    try 
                                    {
                                        if(users.length >=1)
                                        {
                                            users = users[0];
                                            html+=`<div class="ptItem">
                                            <div class="row" style="margin: 0;">
                                              <div class="col-6" style="padding-left: 5px; padding-right: 0px;">
                                                <p class="ptScreenName" style="color: `+(bang.uid == client.uid ? 'red' : 'black')+`">`+users.name+` `+(bang.uid == client.id ? '<b onclick="acp('+users.id+','+bang.id+')">[Đồng ý]</b> <b onclick="nacp('+users.id+','+bang.id+')">[Hủy]</b>' : '')+`</p>
                                                <small class="ptScrenText">Thành tích: 0</small>
                                              </div>
                                              <div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px">
                                                <small style="color: red">Số dư: `+checkstring.number_format(users.xu)+`</small><br>
                                                <small class="ptScrenText">Thời gian xin: `+checkstring.thoigian(e.time)+`</small>
                                              </div>
                                            </div>
                                          </div>`;
                                        }
                                        array++;
                                        if(array == men.length)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang : {
                                                    source : {
                                                        id : "#ptList",
                                                        html : html,
                                                    }
                                                }
                                            })
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                                
                        
                            });
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
                else 
                {
                    client.dn({
                        msg : 'Bang không tồn tại',
                        loading : -1,
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}

let un = function(client,data)
{
    let id = data.id >> 0;
    let idbang = data.bang >> 0;
    mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+idbang+"'",function(err,bang){
        try 
        {
            if(bang.length >=1)
            {
                bang = bang[0];
                if(bang.uid != client.id)
                {
                    client.dn({
                        loading : -1,
                        bang : {msg : 'Bạn không phải bagn chủ'}
                    })
                }
                else 
                {
                    mysqli.query("DELETE FROM `banghoi_xin` WHERE `uid` = '"+id+"' AND `bang` = '"+idbang+"'",function(xcv,delted){
                        try 
                        {
                            xinvao(client,{id : bang.id})
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                        
                    })
                }
            }
        }
        catch(e)
        {
            console.log(e)
        }
    });
}

let ok = function(client,data)
{
    let id = data.id >> 0;
    let idbang = data.bang >> 0;
    mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+idbang+"'",function(err,bang){
        try 
        {
            if(bang.length <=0)
            {
    
            }
            else 
            {
                bang = bang[0];
                if(bang.MIN >= bang.MAX)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg  :'Số lượng thành viên đã đạt tối đa, hãy cùng nhau nỗ lực để lên cấp bang nhé.'
                        }
                    })
                }
                else 
                if(bang.uid != client.id)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Bạn không phải bang chủ.'
                        }
                    })
                }
                else 
                {
                    mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+id+"'",function(e2,men){
                        try 
                        {
                            if(men.length >=1)
                            {
                                client.dn({
                                    loading : -1,
                                    bang : {
                                        msg : 'Người chơi này đã tham gia một bang hội khác.'
                                    }
                                })
                            }
                            else 
                            {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+id+"'",function(e3,users){
                                    try 
                                    {
                                        if(users.length >=1)
                                        {
                                            users = users[0];
                                            mysqli.query("DELETE FROM `banghoi_xin` WHERE `uid` = '"+id+"'",function(e4,deltexin){
                                                try 
                                                {
                                                    mysqli.query("UPDATE `banghoi` SET `MIN` = `MIN` + '1' WHERE `id` = '"+bang.id+"'",function(e5,updatebang){
                                                        try 
                                                        {
                                                            mysqli.query("UPDATE `nguoichoi` SET `bang` = '"+bang.icon+"' WHERE `id` = '"+id+"'",function(e7,updateuaer){
                                                                /**                 */
                                                                try 
                                                                {
                                                                    mysqli.query("INSERT INTO `banghoi_thanhvien` SET `uid` = '"+id+"', `bang` = '"+bang.id+"', `thoigian` = '"+checkstring.time().thoigian+"'",function(e77,insetvanghoi){
                                                                        chatbox(client,{text : ' '+users.name+' được duyệt vào bang hội.'})
                                                                        xinvao(client,{id : bang.id})
                                                                    })
                                                                }
                                                                catch(e)
                                                                {
                                                                    console.log(e)
                                                                }
                                                            })
                                                        }
                                                        catch(e)
                                                        {
                                                            console.log(e)
                                                        }
                                                    })
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                            })
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                            }
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            }
        }
        catch(e)
        {
            console.log(e)
        }
    })
}

let w = function(client,data)
{
    let text = checkstring.html(data.text);
    if(text.length >=200)
    {
        client.dn({
            loading : -1,
            bang : {
                msg : 'Dưới 200 kí tự'
            }
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(e,men){
            try 
            {
                if(men.length >=1)
                {
                    men = men[0];
                    if(men.quyen !=1)
                    {
                        client.dn({
                            loading : -1,
                            bang : {
                                msg : "Bạn không phải bang chủ"
                            }
                        })
                    }
                    else 
                    {
                        mysqli.query("UPDATE `banghoi` SET `khauhieu` = '"+text+"' WHERE `id` = '"+men.bang+"'",function(e2,datax){
                            index(client)
                        })
                    }
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}


let timbang = function(client,data)
{
    let name = checkstring.html(data.name);
    if(client.id <=0)
    {
        client.dn({
            msg : 'Bạn chưa đăng nhập',
            type : 'info',
            loading : -1,
        })
    }
    else 
    {
        /* chưa vào bang */
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"' LIMIT 1",function(er,thanhvien){
            try 
            {
                if(thanhvien.length <=0)
                {
                    /* Chưa vào */
                    /* Ngẫu nhiên bang */
                    mysqli.query("SELECT * FROM `banghoi` WHERE `name` LIKE '%"+name+"%' LIMIT 10",function(err2,bang){
                        try 
                        {
                            let array = [];
                            bang.forEach(e => {
                                array.push({
                                    id : e.id,
                                    name : e.name,
                                    icon : e.icon,
                                    MIN : e.MIN,
                                    MAX : e.MAX,
                                    khauhieu : e.khauhieu,
        
                                })
                            });
                            client.dn({
                                bang : {
                                    index : {
                                        data : array
                                    },
                                    thamgia : -1,
                                },
                                loading : -1,
                                
                            })
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
           
        })
    }
}


let info_u = function(client,data)
{
    let id = data.id >> 0;
    let bangid = data.idbang >> 0;
    mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+bangid+"'",function(err,bang){
        try 
        {
            if(err) throw err;
            if(bang.length <=0)
            {
                client.dn({
                    loading : -1,
                    bang : {
                        msg : 'Không tìm thấy bang hội này'
                    }
                })
            }
            else 
            {
                bang = bang[0];
                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+id+"'",function(ss,users){
                    try 
                    {
                        if(users.length >=1)
                        {
                            let viio = users[0].name;
                            users = info(users[0])
                            client.dn({
                                loading : -1,
                                bang : {
                                    source : {
                                        id : "#alertInfoPt",
                                        html : `<div class="alertInfoContent" style="padding-top: 5px;">
                                        <div class="" style="float: left;">
                                          <img src="`+users.thongtin.avatar+`" alt="Nro.Club Bang hội" style="width:50px; height: 50px; display: inline-block">
                                        </div>
                                        <div style="text-align: center;">
                                          <p style="margin: 0px; font-weight: bold; color: #501c04">`+bang.name+`</p>
                                          <small style="color: blue"></small>
                                        </div>
                                        <hr class="mt-2 mb-2">
                                        <div>
                                          <p style="font-weight: bold; color: red; text-align: center; margin-bottom: 0px;">Tên: `+users.name+`
                                          </p>
                                          <p style="font-weight: bold; color: green; text-align: center; margin-bottom: 0px;">Xu có:
                                          `+checkstring.number_format(users.xu)+`</p>
                                          <p style="text-align: center; margin-bottom: 0px;">Trạng thái: `+(users.time_online > 0 ? '<font color="green">Đang online</font>' : '<font color="blue">không hoạt động</font>')+`</p>
                                          
                                        </div>
                                      </div>
                                      <div id="alertBtnThamGia" style="padding: 5px 5px;">
                                       
                                        `+(bang.uid == client.id ? '<button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="kick('+users.id+',\''+viio+'\')">Trục <br>Suất</button> <button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="phongchu('+users.id+',\''+viio+'\')">Phong <br>Chủ</button> ' : '')+`
                                        <button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng<br>lại</button>
                                       
                                        </div>`,
                                    }
                                }
                            })
                        }
                    }
                    catch(e)
                    {
                        console.log(e)
                    }
                })
                
            }
        }
        catch(e)
        {
            console.log(e)
        }
    })
}

let phongchu = function(client,data)
{
    if(client.id <=0)
    {

    }
    else 
    {
        let id = data.id >> 0;
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+id+"' LIMIT 1",function(err,men){
            try 
            {
                if(men.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Người này chưa tham gia bang hội nào'
                        }
                    })
                }
                else 
                {
                    men = men[0];
                    if(men.quyen == 1)
                    {
                        client.dn({
                            loading : -1,
                            bang : {
                                msg : 'Người này hiện tại đang là chủ bang hội'
                            }
                        })
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `banghoi` WHERE `id` = '"+men.bang+"' LIMIT 1",function(err2,bang){
                            try 
                            {
                                if(bang.length >=1)
                                {
                                    bang = bang[0];
                                    if(bang.uid != client.id)
                                    {
                                        client.dn({
                                            loading : -1,
                                            bang : {
                                                msg : 'Bạn không phải là bang chủ'
                                            }
                                        })
                                    }
                                    else 
                                    {
                                        mysqli.query("UPDATE `banghoi` SET `uid` = '"+id+"' WHERE `id` = '"+bang.id+"'",function(e4,updateb){
                                            try 
                                            {
                                                mysqli.query("UPDATE `banghoi_thanhvien` SET `quyen` = '1' WHERE `uid` = '"+id+"'",function(e534,update2){
                                                    try{
                                                        mysqli.query("UPDATE `banghoi_thanhvien` SET `quyen` = '0' WHERE `uid` = '"+client.id+"'",function(e345,update3){
                                                            client.dn({
                                                                loading : -1,
                                                                bang : {
                                                                    msg : 'Chuyển nhượng bang thành công.'
                                                                }
                                                            })
                                                        })
                                                    }
                                                    catch(e){
                                                        console.log(e)
                                                    }
                                                })
                                            }
                                            catch(e)
                                            {
                                                console.log(e)
                                            }
                                        })
                                    }
                                }
                            }
                            catch(e)
                            {
                                console.log(e)
                            }
                        })
                    }
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}

let doiten = function(client,data)
{
    let name = checkstring.html(data.text);
    if(name.length <3 || name.length > 50)
    {

    }
    else 
    {
        if(client.id <=0)
        {

        }
        else 
        {
            mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(e1,men){
                try {
                    if(men.length <=0)
                    {
                        client.dn({
                            loading : -1,
                            bang : {
                                msg : 'Bạn chưa tham gia bang'
                            }
                        })
                    }
                    else 
                    {
                        men  = men[0];
                        if(men.quyen == 0)
                        {
                            client.dn({
                                loading : -1,
                                bang : {
                                    msg : 'Bạn không phải là bang chủ.'
                                }
                            })
                        }
                        else 
                        {
                            mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(e3,users){
                                try 
                                {
                                    if(users.length >=1)
                                    {
                                        users = users[0];
                                        if(users.xu < 1000000000)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang : {
                                                    msg : 'Tài khoản của bạn phải có 1.000.000.000 vàng để thực hiện'
                                                }
                                            })
                                        }
                                        else 
                                        {
                                            mysqli.query("UPDATE `banghoi` SET `name` = '"+name+"' WHERE `id` = '"+men.bang+"'",function(e4,updatebang){
                                                try 
                                                {
                                                    sodu(users.id,users.xu,-1000000000,'Thay đổi tên bagn hội');
                                                    client.dn({
                                                        loading : -1,
                                                        bang : {
                                                            msg  : 'Xác nhận thay đổi tên thành công',
                                                        },
                                                        vang : users.xu - 1000000000,
                                                    })
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                            })
                                        }
                                    }
                                }
                                catch(e)
                                {
                                    console.log(e)
                                }
                            })
                        }
                    }
                }
                catch(e)
                {
                    console.log(e)
                }
            })
        }
    }
}
let geticon2 = function(client)
{
    mysqli.query("SELECT * FROM `banghoi_icon` ORDER BY `xu` ASC", function(err,bang){
        try 
        {
            let array = [];
            bang.forEach(e => {
                array.push({
                    id : e.id,
                    icon : e.icon,
                    xu : e.xu, 
                })
            });
            client.dn({
                bang : {
                    icon2 : {
                        data : array,
                    }
                }
            })
        }
        catch(e)
        {
            console.log(e)
        }
    })
}


let newicon = function(client,data)
{
    let id = data.id >> 0;
    mysqli.query("SELECT * FROM `banghoi_icon` WHERE `id` = '"+id+"'",function(e,icon){
        try 
        {
            if(icon.length >=1)
            {
                icon = icon[0];
                mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(e2,men){
                    try 
                    {
                        if(men.length >=1)
                        {
                            men = men[0];
                            if(men.quyen !=1)
                            {
                                client.dn({
                                    loading : -1,
                                    bang : {
                                        msg : "Bạn không phải là bang chủ"
                                    }
                                })
                            }
                            else 
                            {
                                mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(e3,users){
                                    try 
                                    {
                                        if(users.length >=1)
                                        {
                                            users = users[0];
                                            if(users.xu < icon.xu)
                                            {
                                                client.dn({
                                                    loading : -1,
                                                    bang : {
                                                        msg : "Tài khoản của bạn không có đủ tiền để thực hiện"
                                                    }
                                                })
                                            }
                                            else 
                                            {
                                                mysqli.query("UPDATE `banghoi` SET `icon` = '"+icon.icon+"' WHERE `id` = '"+men.bang+"'",function(e4,updatbang){
                                                    try 
                                                    {
                                                        sodu(users.id,users.xu,-icon.xu,'Thay đổi biểu tượng bang hội');
                                                        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `bang` = '"+men.bang+"'",function(e4534,danhsach){
                                                            try 
                                                            {
                                                                danhsach.forEach(e => {
                                                                    mysqli.query("UPDATE `nguoichoi` SET `bang` = '"+icon.icon+"' WHERE `id` = '"+e.uid+"'");
                                                                });
                                                                client.dn({
                                                                    loading : -1,
                                                                    bang : {
                                                                        msg : "Thay đổi biểu tượng thành công"
                                                                    },
                                                                    vang : users.xu - icon.xu, 
                                                                })
                                                            }
                                                            catch(e)
                                                            {
                                                                console.log(e)
                                                            }
                                                        })
                                                    
                                                    }
                                                    catch(e)
                                                    {
                                                        console.log(e)
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                            }
                        }
                        else 
                        {
                            client.dn({
                                loading : -1,
                                bang : {
                                    msg : 'Bạn chưa tham gia bang hội nào cả.'
                                }
                            })
                        }
                    }
                    catch(e)
                    {
                        console.log(e)
                    }
                })
            }
        }
        catch(e)
        {
            console.log(e)
        }
    })
}

let index_nhiemvu = function(client)
{
    if(client.id <=0)
    {
        client.dn({
            loading : -1,
            msg : 'Chưa đăng nhập'
        })
    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+client.id+"'",function(ec,nhiemvu){
            try 
            {
                if(nhiemvu.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            source : {
                                id : "#nhiemvu",
                                html : `<div class="ptAlertTitle">
                                <p>Nhận nhiệm vụ bang</p>
                              </div>
                              <div id="">
                                Bạn chưa có nhiệm vụ nào, bạn có muốn nhận nhiệm vụ không ? 
                              </div>
                              <div class="ptAlertFooter">
                                <button class="ptAlertBtn" onclick="nhannhiemvu(1);">Dễ</button>
                                <button class="ptAlertBtn" onclick="nhannhiemvu(2);">Thường</button>
                                <button class="ptAlertBtn" onclick="nhannhiemvu(3);">Khó</button>
                                <button class="ptAlertBtn" onclick="nhannhiemvu(4);">S.Khó</button>
                                <button class="ptAlertBtn" onclick="$(this).parent().parent().hide();">Đóng</button>
                              </div>`,
                            }
                        }
                    })
                }
                else 
                {
                    nhiemvu = nhiemvu[0];
                    mysqli.query("SELECT * FROM `banghoi_nhiemvu` WHERE `id` = '"+nhiemvu.nhiemvu+"'",function(ecc,d){
                        try 
                        {
                            if(d.length >=1)
                            {
                                d = d[0];
                                client.dn({
                                    loading : -1,
                                    bang : {
                                        source : {
                                            id : "#nhiemvu",
                                            html : `<div class="ptAlertTitle">
                                            <p>[`+(nhiemvu.capdo == 1 ? 'Dễ' : (nhiemvu.capdo == 2 ? 'Thường' : (nhiemvu.capdo == 3 ? 'Khó' : 'Siêu')))+`] <font color="red">`+d.name+`</font></p>
                                          </div>
                                          <div id="">
                                            `+d.mota+` <br>
                                            Tiến trình : `+checkstring.number_format(nhiemvu.MIN)+`/`+checkstring.number_format(nhiemvu.MAX)+`<br>
                                            Thưởng : `+checkstring.number_format(nhiemvu.thuong)+` <br>
                                            
                                          </div>
                                          <div class="ptAlertFooter">
                                            
                                            `+(nhiemvu.MIN >= nhiemvu.MAX ? '<button class="ptAlertBtn" onclick="loading();dn.to({users : {bang : {tranhiemvu: true}}})">Trả</button>' : '<button class="ptAlertBtn" onclick="loading();dn.to({users : {bang : {huynhiemvu : true}}})">Hủy</button>')+`
                                            
                                            <button class="ptAlertBtn" onclick="$(this).parent().parent().hide();">Đóng</button>
                                          </div>`,
                                        }
                                    }
                                })
                            }
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}

let nhannhiemvu = function(client,data)
{
    let dokho = data.id;
    if(client.id <= 0)
    {

    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(e,men){
            try 
            {
                if(men.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Bạn chưa tham gia bang hội'
                        }
                    })
                }
                else 
                {
                    /* Lấy dữ liệu nhiệm vụ */
                    mysqli.query("SELECT * FROM `banghoi_nhiemvu` ORDER BY RAND() LIMIT 1",function(e2,nhiemvu){
                        try 
                        {
                            if(nhiemvu.length >=1)
                            {
                                nhiemvu = nhiemvu[0];
                                let MAX = 0;
                                if(nhiemvu.value == 5)
                                {
                                    if(dokho == 1)  nhiemvu.value+= checkstring.rand(1,3);
                                    else if(dokho == 2)  nhiemvu.value+= checkstring.rand(2,6);
                                    else if(dokho == 3)  nhiemvu.value+= checkstring.rand(4,9);
                                    else  nhiemvu.value+= checkstring.rand(6,15);
                                }
                                else
                                if(nhiemvu.value == 3)
                                {
                                    if(dokho == 1)  nhiemvu.value+= checkstring.rand(1,2);
                                    else if(dokho == 2)  nhiemvu.value+= checkstring.rand(2,5);
                                    else if(dokho == 3)  nhiemvu.value+= checkstring.rand(3,9);
                                    else  nhiemvu.value+= checkstring.rand(6,10);
                                }
                                else 
                                {
                                    if(dokho == 1)  nhiemvu.value+= checkstring.rand(nhiemvu.value/2,nhiemvu.value*checkstring.rand(1,2));
                                    else if(dokho == 2)  nhiemvu.value+= checkstring.rand(nhiemvu.value/2,nhiemvu.value*checkstring.rand(2,5));
                                    else if(dokho == 3)  nhiemvu.value+= checkstring.rand(nhiemvu.value/2,nhiemvu.value*checkstring.rand(4,9));
                                    else nhiemvu.value+= checkstring.rand(nhiemvu.value/2,nhiemvu.value*checkstring.rand(9,16));
                                }
                                MAX = nhiemvu.value;
                                let thuong = 0;
                                if(dokho == 1)  nhiemvu.thuong+= checkstring.rand(nhiemvu.thuong/2,nhiemvu.thuong);
                                else if(dokho == 2)  nhiemvu.thuong+= checkstring.rand(nhiemvu.thuong/2,nhiemvu.thuong*checkstring.rand(1,2));
                                else if(dokho == 3)  nhiemvu.thuong+= checkstring.rand(nhiemvu.thuong/2,nhiemvu.thuong*checkstring.rand(2,5));
                                else nhiemvu.thuong+= checkstring.rand(nhiemvu.thuong/2,nhiemvu.thuong*checkstring.rand(4,9));
                                thuong = nhiemvu.thuong;
                                mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+client.id+"'",function(cxv,xcvv){
                                    try 
                                    {
                                        if(xcvv.length >=1)
                                        {
                                            client.dn({
                                                loading : -1,
                                                bang : {
                                                    msg : "OH ! Bạn có nhiệm vụ chưa làm."
                                                }
                                            })
                                        }
                                        else 
                                        {
                                            mysqli.query("INSERT INTO `banghoi_data` SET `uid` = '"+client.id+"', `nhiemvu` = '"+nhiemvu.id+"', `MIN` = '0', `MAX` = '"+MAX+"', `type` = '"+nhiemvu.type+"', `thuong` = '"+thuong+"', `capdo` = '"+dokho+"'",function(xcv,inserdf){
                                                
                                                try 
                                                {
                                                    index_nhiemvu(client)
                                                }
                                                catch(e)
                                                {
                                                    console.log(e)
                                                }
                                                
                                            })
                                        }
                                    }
                                    catch(e)
                                    {
                                        console.log(e)
                                    }
                                })
                            }
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}

let huynhiemvu = function(client)
{
    if(client.id <=0)
    {

    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+client.id+"'",function(d,nhiemvu){
            try 
            {
                if(nhiemvu.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Bạn chưa có nhiệm vụ nào'
                        }
                    })
                }
                else 
                {
                    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = '"+client.id+"'",function(dd,users){
                        try 
                        {
                            if(users.length >=1)
                            {
                                users = users[0];
                                if(users.xu < 0)
                                {
                                    client.dn({
                                        loading : -1,
                                        bang : {
                                            msg : 'Tài khoản phải có 0tr vàng mới có thể hủy nhiệm vụ'
                                        }
                                    })
                                }
                                else 
                                {
                                    mysqli.query("DELETE FROM `banghoi_data` WHERE `uid` = '"+client.id+"'",function(sdsdf,delte){
                                        //sodu(users.id,users.xu,-1000000,'Hủy nhiệm vụ');
                                        client.dn({
                                            loading : -1,
                                           
                                        })
                                        index_nhiemvu(client)
                                    })
                                }
                            }
                        }
                        catch(e)
                        {
                            console.log(e)
                        }
                    })
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}


let tranhiemvu = function(client)
{
    if(client.id <=0)
    {

    }
    else 
    {
        mysqli.query("SELECT * FROM `banghoi_data` WHERE `uid` = '"+client.id+"'",function(d,nhiemvu){
            try 
            {
                if(nhiemvu.length <=0)
                {
                    client.dn({
                        loading : -1,
                        bang : {
                            msg : 'Bạn chưa có nhiệm vụ nào'
                        }
                    })
                }
                else 
                {
                    nhiemvu = nhiemvu[0];
                    if(nhiemvu.MIN < nhiemvu.MAX)
                    {
                        client.dn({
                            loading : -1,
                            bang : {
                                msg : 'OH, Nhiệm vụ chưa hoàn thành.'
                            }
                        })
                    }
                    else 
                    {
                        mysqli.query("SELECT * FROM `banghoi_thanhvien` WHERE `uid` = '"+client.id+"'",function(xcv,men){
                            try 
                            {
                                if(men.length >=1) 
                                {
                                    men = men[0];
                                    mysqli.query("UPDATE `banghoi` SET `xu` = `xu` + '"+nhiemvu.thuong+"' WHERE `id` = '"+men.bang+"'",function(xcvxcv,upadte){
                                       try 
                                       {
                                        mysqli.query("UPDATE `banghoi_thanhvien` SET `thanhtich` = `thanhtich` + '"+nhiemvu.thuong+"' WHERE `id` = '"+men.id+"'",function(cvxcv,sdf){
                                            mysqli.query("DELETE FROM `banghoi_data` WHERE `uid` = '"+client.id+"'",function(vcxv,sdf){
                                                index_nhiemvu(client)
                                            })
                                        })
                                       }
                                       catch(e)
                                       {
                                           console.log(e)
                                       }
                                    })
                                }
                            }
                            catch(e)
                            {
                                console.log(e)
                            }
                        })
                    }
                }
            }
            catch(e)
            {
                console.log(e)
            }
        })
    }
}


module.exports = function(client,data)
{
    console.log(data)
    if(!!data.tranhiemvu)
    {
        tranhiemvu(client)
    }
    if(!!data.huynhiemvu)
    {
        huynhiemvu(client);
    }
    if(!!data.nhannhiemvu)
    {
        nhannhiemvu(client,data.nhannhiemvu);
    }
    if(!!data.nhiemvu)
    {
        index_nhiemvu(client)
    }
    if(!!data.newicon)
    {
        newicon(client,data.newicon)
    }
    if(!!data.doiten)
    {
        doiten(client,data.doiten)
    }
    if(!!data.phongchu)
    {
        phongchu(client,data.phongchu);
    }
    if(!!data.users)
    {
        info_u(client,data.users);
    }
    if(!!data.find)
    {
        timbang(client,data.find);
    }
    if(!!data.w)
    {
        w(client,data.w);
    }
    if(!!data.un)
    {
        un(client,data.un);
    }
    if(!!data.ok)
    {
        ok(client,data.ok);
    }
    if(!!data.out)
    {
        out(client)
    }
    if(!!data.kick)
    {
        kick(client,data.kick)
    }
    if(!!data.chatbox)
    {
        chatbox(client,data.chatbox)
    }
    if(!!data.index)
    {
        index(client,data.index);
    }
    if(!!data.geticon)
    {
        geticon(client);
    }
    if(!!data.geticon2)
    {
        geticon2(client);
    }
    if(!!data.tao)
    {
        tao(client,data.tao);
    }
    if(!!data.info)
    {
        infobang(client,data.info);
    }
    if(!!data.xin)
    {
        xin(client,data.xin);
    }
    if(!!data.menber)
    {
        menber(client,data.menber);
    }
    if(!!data.menber2)
    {
        menber2(client,data.menber2);
    }

    if(!!data.xinvao)
    {
        xinvao(client,data.xinvao);
    }
}