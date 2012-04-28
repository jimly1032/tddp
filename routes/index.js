var oauth = require('./login');
var chat = require('./chat');
exports.index=function(req,res){
	if(req.session.access_token){
		res.render('index',{title:'chat',user:req.session.uid});
	}else{
		res.redirect('/login');
	}
};
exports.invite=function(req,res,room){
	if(req.session.access_token){
		res.render('index',{title:'chat',user:req.session.uid});
		console.log('after redirect many times:'+room);
	}else{
		res.redirect('/login?room='+room);
	}
};
exports.login = oauth.login;
exports.logout = oauth.logout;
exports.chat = chat.chat;
