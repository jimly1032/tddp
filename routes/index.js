var oauth = require('./login');
var chat = require('./chat');
exports.index=function(req,res){
	if(req.session.access_token){
		res.render('index',{title:'chat',user:req.session.uid});
	}else{
		res.redirect('/login');
	}
};
exports.login = oauth.login;
exports.logout = oauth.logout;
exports.chat = chat.chat;
