var tsina = require('../lib/tsina').tapi;
exports.login=function(req,res){
	var option = {
		client_id:'4048601347',
		client_secret:'31075b7a8e87ff11d5ab1393623db2db',
		redirect_uri:'http://127.0.0.1:3000/login',
		response_type:'',
		display:''
	};
	tsina.oauth(req,res,option);
};
exports.logout = function(req,res){
	tsina.logout(req,res);
};
