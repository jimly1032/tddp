$(document).ready(function(){
	var messages = '';
//	var socket = io.connect('http://127.0.0.1:3000');
	var socket = io.connect('http://jimlyblog.cnodejs.net/');
	socket.on('error',function(err){
		console.log('error:',err);
	});
	socket.on('connect',function(){
		console.log('you hava connected');
	});
	socket.on('disconnect',function(){
		console.log('you hava disconnected');
	});
	$('#say').click(function(){
		socket.emit('say',{msg:$('#lab').text()+':'+$('#msg').val()});
	});
	socket.on('say',function(from,data){
		messages += data.msg+'\n';
		$('#text').val(messages);
	});
	socket.on('game',function(from,msg){
		console.log('from :'+from);
		socket.emit('say',from,{msg:'i konw game start'});
		game.init();
		game.drawLine();
		game.drawImg();
		game.addListener();
	});
	socket.on('online list',function(data){
		messages += data+'\n';
		$('#text').val(messages);
	});
});
