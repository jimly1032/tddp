var allUsers = {};
var freeUsers = [];
exports.chat = function(io){
	io.sockets.on('connection',function(socket){
		console.log('new people join:'+(socket.handshake.sessionID));
		var session = socket.handshake.session;
		console.log(session);
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
//			socket.emit('say',{msg:data.msg});
		});
	});
};
