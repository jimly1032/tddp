var allUsers = {};
var freeUsers = [];
exports.chat = function(io){
	io.sockets.on('connection',function(socket){
		var session = socket.handshake.session;
		/*
		 *当前在线人数
		 */
		var refresh_online = function(){
			var temp = [];
			for(var i in allUsers){
				temp.push(i);
			}
			io.sockets.emit('online list',temp);
		};
		if(session === undefined){
			return;
		}else{
			allUsers[session.uid] = socket;
			refresh_online();
			socket.on('reconnect',function(room,data){
				socket.join(room);
			});
		}
		/*
		 * 邀请模式
		 */
		socket.on('invate',function(from,data){
			if(data === undefined){
				data = from;
				socket.join(data);
			}else{
				if(io.rooms['/'+data] !== undefined){
					socket.join(data);
					if(io.rooms['/'+data].length === 2){
						var msg = 'game start';
						io.sockets.in(data).emit('game',data,msg);
					}
				}else
					console.log('当前房间不存在');
			}
		});
		/*
		 *随机模式
		 */
		socket.on('random',function(data){
			if(freeUsers.length>=1){
				var to = freeUsers.pop();
				socket.join(session.uid);
				var target = allUsers[to];
				target.join(session.uid);
				var msg = 'game start';
				console.log(to+'  send game start msg to '+session.uid);
				io.sockets.in(session.uid).emit('game',session.uid,msg);
			}else{
				freeUsers.push(session.uid);
				console.log(freeUsers);
			}
		});
		socket.on('disconnect',function(){
			delete allUsers[session.uid];
			if(freeUsers.indexOf(session.uid) >= 0)
				freeUsers.splice(freeUsers.indexOf(session.uid));
			session = null;
			refresh_online();
			console.log('disconnectl................');
		});
		socket.on('say',function(from,data){
			io.sockets.in(from).emit('say',from,{msg:data.msg});
		});
	});
};
