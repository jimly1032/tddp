var oauth = require('./login');
var chat = require('./chat');
exports.index=function(req,res){
	if(req.session.access_token){
		res.render('index',{title:'chat',user:req.session.user});
	}else{
		res.redirect('/info');
	}
};
exports.invite=function(req,res,room){
	if(req.session.access_token){
		res.render('index',{title:'chat',user:req.session.user});
	}else{
		res.redirect('/info?room='+room);
	}
};
exports.login = oauth.login;
exports.logout = oauth.logout;
exports.chat = chat.socketManager;
