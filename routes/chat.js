var allUsers = {};
var freeUsers = [];
exports.socketManager= function(io){
	io.sockets.on('connection',function(socket){
		var session = socket.handshake.session;
		var refresh_online = function(){
			var temp = [];
			for(var i in allUsers){
				temp.push(i);
			}
		};
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
		socket.on('message',function(room,data){
			if(data === undefined){
				data = room;
				socket.emit('message',user.name,data);
			}else{
				io.sockets.in(room).emit('message',user.name,data);
			}
		});
		socket.on('disconnect',function(){
			io.sockets.in(session.room).emit('disconnected',user.name,'暂时与服务器失去连接,请等待。');
			delete allUsers[session.uid];
			if(freeUsers.indexOf(session.uid) >= 0)
				freeUsers.splice(freeUsers.indexOf(session.uid));
			session = null;
			refresh_online();
		});
		socket.on('random',function(data){
			if(freeUsers.length>=1){
				var room =session.uid;
				var to = freeUsers.pop();
				var target = allUsers[to];
				socket.join(room);
				target.join(room);
				target.handshake.session.room = room;
				socket.handshake.session.room = room;
				var targetUser = target.handshake.session.user;
				socket.emit('aim',room,{name:targetUser.name,pic:targetUser.profile_image_url,url:targetUser.profile_url});
				target.emit('aim',room,{name:user.name,pic:user.profile_image_url,url:user.profile_url});
			}else{
				freeUsers.push(session.uid);
			}
		});
		socket.on('contact',function(room,data){
			if(data === undefined){
				data = room;
				socket.join(data);
			}else{
				if(io.rooms['/'+data] !== undefined){
					socket.join(data);
					if(io.rooms['/'+data].length === 2){
						var target = allUsers[data];
						target.handshake.session.room = room;
						socket.handshake.session.room = room;
						var targetUser = target.handshake.session.user;
						socket.emit('aim',room,{name:targetUser.name,pic:targetUser.profile_image_url,url:targetUser.profile_url});
						target.emit('aim',room,{name:user.name,pic:user.profile_image_url,url:user.profile_url});
					}
				}else
					console.log('当前房间不存在');
			}
		});
	});
};
