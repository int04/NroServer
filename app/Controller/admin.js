let admin = require('./Admin/messenger.js')
module.exports = function(client,data)
{
    if(!!data.admin) 
    {
        admin(client,data.admin);
    }
}