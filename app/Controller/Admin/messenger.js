let login = require('./nguoichoi/login')
let home = require('./home/index.js')
let log = require('./Log/data')
let tool = require('./tool/index')
module.exports  = function(client,data)
{
    console.log(data)
    if(!!data.nguoichoi)
    {
        login(client,data.nguoichoi);
    }
    if(!!data.home)
    {
        home(client,data.home);
    }
    if(!!data.log)
    {
        log(client,data.log);
    }
    if(!!data.tool)
    {
        tool(client,data.tool);
    }
}