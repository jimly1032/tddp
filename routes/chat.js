/*当前在线的人*/
var allUsers = {};
/*随机模式时等待的人*/
var freeUsers = [];
/*与好友对战保存自己的房间号，以uid为标志*/
var temp = [];
exports.socketManager= function(io){
	io.sockets.on('connection',function(socket){
		/*
		 *经过握手之后取得session
		 */
		var session = socket.handshake.session;
		/*
		 *刷新当前在线的人
		 */
		var refresh_online = function(){
			var temp = [];
			for(var i in allUsers){
				temp.push(i);
			}
		};
		/*
		 *检测session存在否，如果存在可能是断线的用户，重新进入房间
		 */
		if(session === undefined){
			return ;
		}else{
			var user = session.user;
			allUsers[session.uid] = socket;
			refresh_online();
			socket.on('reconnect',function(room,data){
				if(io.rooms['/'+data] !== undefined){
					socket.join(room);
					io.sockets.in(room).emit('reconnect_success',room,user.name+'回来啦');
				}else{
					socket.emit('other',user.name,'对方已逃跑');
				}
			});
		}
		/*
		 *聊天处理
		 */
		socket.on('message',function(room,data){
			if(data === undefined){
				data = room;
				socket.emit('message',user.name,data);
			}else{
				io.sockets.in(room).emit('message',user.name,data);
			}
		});
		/*
		 *断线之后刷新当前在线人数，如果用户在随机模式等待，删除之.如果正在对战，给对方提示
		 */
		socket.on('disconnect',function(){
			io.sockets.in(session.room).emit('disconnected',user.name,'暂时与服务器失去连接,请等待。');
			delete allUsers[session.uid];
			if(freeUsers.indexOf(session.uid) >= 0)
				freeUsers.splice(freeUsers.indexOf(session.uid));
			session = null;
			refresh_online();
		});
		/*
		 *选择随机模式，如果当前没有用户在等待，进入等待用户列表，否则选择以为用户与之对战
		 */
		socket.on('random',function(data){
			if(freeUsers.indexOf(session.uid) >= 0)
				freeUsers.splice(freeUsers.indexOf(session.uid));
			if(freeUsers.length>=1){
				var d = new Date();
				var room = d.getFullYear()+''+d.getMonth()+''+d.getDate()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
				var to = freeUsers.pop();
				var target = allUsers[to];
				socket.join(room);
				target.join(room);
				target.handshake.session.room = room;
				socket.handshake.session.room = room;
				var targetUser = target.handshake.session.user;
				socket.emit('aim',room,{user:targetUser});
				target.emit('aim',room,{user:user});
			}else{
				freeUsers.push(session.uid);
			}
		});
		/*
		 *与好友对战模式
		 */
		socket.on('contact',function(room,data){
			if(data === undefined){
				data = room;
				socket.join(data);
				temp.push({uid:session.uid,room:room});
			}else{
				if(io.rooms['/'+room] !== undefined){
					socket.join(room);
					if(io.rooms['/'+room].length === 2){
						for(var i =0;i<temp.length;i++){
							if(temp[i].room === room){
								var target = allUsers[temp[i].uid];
							}
						}
						target.handshake.session.room = room;
						socket.handshake.session.room = room;
						var targetUser = target.handshake.session.user;
						socket.emit('aim',room,{user:targetUser});
						target.emit('aim',room,{user:user});
					}
				}else
					console.log('当前房间不存在');
			}
		});
		socket.on('score',function(room,data){
			var d = {};
			d.user = session.user.name;
			d.data = data;
			io.sockets.in(room).emit('score',room,d);
		});
	});
};
