var allUsers = {};
var freeUsers = [];
exports.chat = function(io){
	io.sockets.on('connection',function(socket){
		socket.join(socket.handshake.sessionID);
		console.log('new people join'+(socket.handshake.sessionID));
		console.log(socket.handshake.session.uid);
		var session = socket.handshake.session;
		allUsers[session.uid] = socket;
		if(freeUsers.length>=1){
			var to = freeUsers.pop();
			var target = allUsers[to];
			var msg = 'game start';
			console.log(to+'  send game start msg to '+session.uid);
			target.emit('game',session.uid,msg);
			socket.emit('game',to,msg);
		}else{
			freeUsers.push(session.uid);
			console.log(freeUsers);
		}
		var refresh_online = function(){
			var temp = [];
			for(var i in allUsers){
				temp.push(i);
			}
			io.sockets.emit('online list',temp);
		};
		refresh_online();
		socket.on('disconnect',function(){
			delete allUsers[session.uid];
			if(freeUsers.indexOf(session.uid) >= 0)
				freeUsers.splice(freeUsers.indexOf(session.uid));
			session = null;
			refresh_online();
			console.log('disconnectl................');
		});
		socket.on('say',function(from,data){
			console.log("server from:"+from);
			socket.emit('say',from,{msg:data.msg});
		});
	});
};
