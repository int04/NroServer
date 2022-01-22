module.exports = function(io){
	io.users  = []; // danh sách người dùng đăng nhập
	io.admins = []; // danh sách admin đăng nhập
	

	// Phát sóng tới tất cả người dùng và khách
	io.all = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (client.admin == false && noBroadcast !== client) {
				client.dn(data);
			}
		}); 
	};

	io.to = function(data,uid)
	{
		this.clients.forEach(function(client){
			if (+client.id == +uid) {
				client.dn(data);
			}
		});
	}

	io.admin = function(data,noBroadcast = null)
	{
		this.clients.forEach(function(client){
			if (client.admin == true && noBroadcast !== client) {
				client.dn(data);
			}
		});
	}

	io.chuyentien = function(data,uid)
	{
		this.clients.forEach(function(client)
		{
			if(+client.id == +uid)
			{
				client.dn(data);
			}
		});
	}
	
};
 