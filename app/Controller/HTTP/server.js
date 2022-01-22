let mysqli = require('../../Model/mysqli');
let checkstring = require('../../Model/string');
let info = require('../../Model/users/info');
let sodu = require('../../Model/users/sodu');

module.exports = function (req, res) {
    let data = req.query;
    console.log(data);
    res.status(200);
    res.set({
        'Content-Type': 'text/html',
        'Content-Length': '123',
        'X-Powered-By': 'Nodejs From Since04',
    })
    let time = +data.time;
    if (time <= 0) {
        res.send(`ducnghia`);
        return false;
    }
    let server = data.server;
    let kq = data.kq;
    /*  */
    mysqli.query("SELECT * FROM `phien` WHERE `server` = '" + server + "' AND `status` = '0' ORDER BY `id` DESC LIMIT 1", function (err, phien) {
        if (err) throw err;
        if (phien.length <= 0) {
            mysqli.query("INSERT INTO `phien` SET `server` = '" + server + "', `time` = '" + time + "', `status` = '0', `thoigian` = '" + checkstring.time().thoigian + "'", function (err2, insert) {
                if (err2) throw err2;
                res.send(`Phien ` + insert.insertId + ` : sv : ` + server + ` : time : ` + time + ` `);
            })
        }
        else {
            phien = phien[0];
            /* DucNghia */
            if (time > phien.time && time >= 250) {

                mysqli.query("UPDATE `phien` SET `ketqua` = '" + kq + "' WHERE `id` = '" + phien.id + "'", function (err, show) {
                    if (err) throw err;
                    res.send(`update ke`);
                })


            }
            else {

                mysqli.query("UPDATE `phien` SET `time` = '" + time + "' WHERE `id` = '" + phien.id + "'", function (err, teamobi) {
                    if (err) throw err;
                    res.send(`update time`);
                })


            }

        }
    })
}