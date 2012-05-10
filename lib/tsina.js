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
	users_show: function(req,res,uid,callback){
		var parma = this.parma;
		parma.data.uid = uid;
		urllib.request(this.baseurl+'users/show.json',parma,function(err,data,res){
			delete parma.data.uid;
			callback(JSON.parse(data));
		});
	},
	/*
	 *获取互粉列表
	 */
	bilateral: function(req,res,uid,callback){
		var parma = this.parma;
		parma.data.uid = uid;
		urllib.request(this.baseurl+'friendships/friends/bilateral.json',parma,function(err,data,res){
			delete parma.data.uid;
			callback(JSON.parse(data));
		});
	},
	/*
	 * 获取用户发布的微博id
	 */
	statuses_ids:function(req,res,uid,callback){
		var parma = this.parma;
		parma.data.uid = uid;
		parma.data.count = 100;
		urllib.request(this.baseurl+'statuses/user_timeline/ids.json',parma,function(err,data,res){
			delete parma.data.uid;
			delete parma.data.count;
			callback(JSON.parse(data));
		});
	},
	/*
	 *获取当前登录用户所接收到的评论列表
	 */
	to_me:function(req,res,callback){
		var parma = this.parma;
		parma.data.count = 100;
		urllib.request(this.baseurl+'comments/to_me.json',parma,function(err,data,res){
			delete parma.data.count;
			callback(JSON.parse(data));
		});
	},
	/*
	 *获取当前登录用户发出的评论列表
	 */
	by_me:function(req,res,callback){
		var parma = this.parma;
		parma.data.count = 100;
		urllib.request(this.baseurl+'comments/by_me.json',parma,function(err,data,res){
			delete parma.data.count;
			callback(JSON.parse(data));
		});
	},
	/*
	 *获取当前用户的收藏列表的ID
	 */
	fav_ids:function(req,res,uid,callback){
		var parma = this.parma;
		parma.data.uid = uid;
		urllib.request(this.baseurl+'favorites/ids.json',parma,function(err,data,res){
			delete parma.data.uid;
			callback(JSON.parse(data));
		});
	},
	/*
	 * 根据收藏id删除收藏
	 */
	fav_destroy:function(req,res,id,callback){
		var parma = this.parma;
		parma.data.id = id;
		parma.type = 'POST';
		urllib.request(this.baseurl+'favorites/destroy.json',parma,function(err,data,res){
			delete parma.data.id;
			callback(JSON.parse(data));
		});
	},
	/*
	 *删除一条评论
	 */
	comments_destroy:function(req,res,id,callback){
		var parma = this.parma;
		parma.data.cid = id;
		parma.type = 'POST';
		urllib.request(this.baseurl+'comments/destroy.json',parma,function(err,data,res){
			delete parma.data.cid;
			callback(JSON.parse(data));
		});
	},
	/*
	 * 根据id删除微博
	 */
	statuses_destroy:function(req,res,id,callback){
		var parma = this.parma;
		parma.data.id = parseFloat(id);
		parma.type = 'POST';
		urllib.request(this.baseurl+'statuses/destroy.json',parma,function(err,data,res){
			delete parma.data.id;
			callback(JSON.parse(data));
		});
	},
	/*
	 * 获取用户发布的微博
	 */
	user_timeline:function(req,res,callback){
		var parma = this.parma;
		urllib.request(this.baseurl+'statuses/user_timeline.json',parma,function(err,data,res){
			callback(JSON.parse(data));
		});
	},
	/*
	 *根据微博id获取单条微博信息
	 */
	statuses_show:function(req,res,id,callback){
		var parma = this.parma;
		parma.data.id = parseFloat(id);
		parma.type = 'GET';
		urllib.request(this.baseurl+'statuses/show.json',parma,function(err,data,res){
			delete parma.data.id;
			callback(JSON.parse(data));
		});
	},
	/*
	 *发布一条微博
	 */
	update:function(req,res,status,callback){
		var parma = this.parma;
		parma.data.status = status;
		parma.type = 'POST';
		urllib.request(this.baseurl+'statuses/update.json',parma,function(err,data,res){
			delete parma.data.status;
			callback(JSON.parse(data));
		});
	}
};
