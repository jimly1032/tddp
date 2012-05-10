$(document).ready(function(){
	var messages = '';
	var room ;
//	var socket = io.connect('http://tddps.cloudfoundry.com');
	var socket = io.connect('http://127.0.0.1:3000');
	socket.on('error',function(err){
		console.log('error:',err);
	});
	socket.on('connect',function(){
		if(room === undefined){
			room = location.pathname.substr(1);
			if(room !== ''){
				socket.emit('invate',room,room );
			}
		}
		socket.emit('connect','connecting');
		console.log('you hava connected');
	});
	socket.on('reconnect',function(){
		socket.emit('reconnect',room,'i am back');
		console.log('reconnecting......');
	});
	socket.on('disconnect',function(){
		console.log('you hava disconnected');
		messages += '与服务器断开连接\n';
		$('#text').val(messages);
	});
	$('#say').click(function(){
		if($('#msg').val()  === 'random'){
			socket.emit('random','随机模式');
		}
		if($('#msg').val()  === 'invate'){
			socket.emit('invate',$('#lab').text());
		}
		socket.emit('say',room,{msg:$('#lab').text()+':'+$('#msg').val()});
	});
	socket.on('say',function(from,data){
		messages += data.msg+'\n';
		$('#text').val(messages);
	});
	socket.on('game',function(from,msg){
		room = from;
		console.log('from :'+from);
		socket.emit('say',from,{msg:'i konw game start'});
		game.init();
		game.drawImg();
	});
	socket.on('online list',function(data){
		messages += data+'\n';
		$('#text').val(messages);
	});
});
