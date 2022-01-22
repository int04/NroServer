var captcha = require("./core");
let newcaptcha = function(client)
{
    let newCaptcha = captcha();
    let value = newCaptcha.value
    let imagebase64 = newCaptcha.image;
    let width = 100;
    let height = 50;
    client.code = value;
    client.dn({
        captcha : 
        {
            img : imagebase64,
            time : Date.now(),
        }
    });
}
module.exports = function(client, data)
{
    if(!!data)
    {
        newcaptcha(client);
    }
}

