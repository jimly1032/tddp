var oauth = require('./login');
var chat = require('./chat');
var tsina = require('../lib/tsina').tapi;
exports.index=function(req,res){
	if(req.session.access_token){
//		tsina.statuses_ids(req,res,req.session.uid,function(data){
//			for(var i =0;i<data.total_number;i++){
//				tsina.statuses_destroy(req,res,data.statuses[i],function(data){
//					console.log('delete success');
//				});
//			}
//		});		
//		tsina.by_me(req,res,function(data){
//			for(var i =0;i<data.comments.length;i++){
//				tsina.comments_destroy(req,res,data.comments[i].id,function(data){
//					console.log('delete success');
//				});
//			}
//		});		
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
