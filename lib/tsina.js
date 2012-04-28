var urllib = require('urllib'),
qs = require('querystring');
exports.tapi = {
	baseurl : 'https://api.weibo.com/2/',
	parma : {
		data:{access_token:''},
		type:'GET',
		data_type:'json'
	},
	/*
	 *用client_id获取code
	 *@parma option
	 */
	getCode: function(req,res,option){
		var host = 'http://api.weibo.com/oauth2/authorize';
		option.response_type = 'code' || option.response_type;
		option.display = 'default' || option.display;
		res.redirect(host+'?'+qs.stringify(option));
	},
	/*
	 *用client_id和client_secret code获得access_token
	 *
	 */
	getAccessToken: function(req,res,option,callback){
		var host = 'https://api.weibo.com/oauth2/access_token';
		if(req.query.code === undefined){
			this.getCode(req,res,option);
		}else{
			var parma = {
				data:{
					client_id:option.client_id,
					client_secret:option.client_secret,
					code:req.query.code,
					grant_type:'authorization_code',
					redirect_uri:option.redirect_uri
				},
				type:'POST',
				data_type:'json'
			};
			urllib.request(host,parma,function(err,data,res){
				var temp = JSON.parse(data);
				req.session.access_token = temp.access_token;
				req.session.uid = temp.uid;
				callback();
			});
		}
	},
	/*
	 *授权
	 */
	oauth: function(req,res,option){
		var that = this;
		this.getAccessToken(req,res,option,function(){
			that.parma.data.access_token = req.session.access_token;
			res.redirect('/'+option.room);
		});
	},
	//---------------------------weibo api-------------------------------//
	//退出登录
	logout: function(req,res){
		req.session.access_token = null;
		req.session.uid = null;
	},
	/*
	 *获取当前登录用户及其所关注用户的最新微博
	 */
	friends_timeline:function(req,res,callback){
		urllib.request(this.baseurl+'statuses/friends_timeline.json',this.parma,function(err,data,res){
			callback(JSON.parse(data));
		});
	},
	/*
	 *获取用户信息
	 */
	show: function(req,res,uid,callback){
		var parma = this.parma;
		parma.data.uid = uid;
		console.log(parma);
		urllib.request(this.baseurl+'users/show.json',parma,function(err,data,res){
			callback(JSON.parse(data));
		});
	},
	/*
	 *获取互粉列表
	 */
	bilateral: function(req,res,uid,callback){
		var parma = this.parma;
		parma.data.uid = uid;
		console.log(parma);
		urllib.request(this.baseurl+'friendships/friends/bilateral.json',parma,function(err,data,res){
			console.log(JSON.parse(data));
			callback(JSON.parse(data));
		});
	}
};
