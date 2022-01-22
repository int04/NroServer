
let view = require('./Users/messenger.js');
module.exports = function(client, p){
	if (!!p) {
		//console.log(p);
	}

	if(!!p.users)
	{
		view(client,p.users);
	}

	/* rowload */

}



       