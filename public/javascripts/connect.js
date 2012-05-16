(function(){
	var room = undefined;
	var socket = undefined ;
	var connect = {
		sendScore:function(data){
			if(socket !== undefined){
				socket.emit('score',room,data);
			}
		},
		socketFun:function(){
			socket = io.connect('http://127.0.0.1:3000');
//			socket = io.connect('http://tddps.cloudfoundry.com');
			var message = '';
			var userName = $('aside > #person1 > a > p').text();
			var uid = $('aside > #person1 > img').attr('title');
			/*
			 *监听enter keypress事件，当还没有与其他玩家对战时，对话只有自己可以接收到，其他玩家加进来，发到房间。
			 */
			$('#chatMsg').focus(function(){
				$(window).keypress(function(e){
					if(e.keyCode === 13 ){
						var socketInput = $('#chatMsg').val();
						if(socketInput !== ''){
							if(room === undefined)
								socket.emit('message',socketInput);
							else
								socket.emit('message',room,socketInput);
							$('#chatMsg').val('');
						}
					}
				});
			});
			socket.on('connect',function(){
				message += userName+'进入游戏\n';
				$('#chatbox').val(message);
				$('#chatbox').scrollTop($('#chatbox').attr('scrollHeight'));
				if(room === undefined){
					room = location.pathname.substr(1);
					console.log(room);
					if(room !== ''){
						socket.emit('contact',room,room);
					}
				}
			});
			/*
			 *由于网络原因等，与服务器断开连接，文本框显示提示，同时遮盖整个页面，给予提示，停止玩家进行游戏。
			 */
			socket.on('disconnect',function(){
				message += '与服务器断开连接\n';
				$('#chatbox').val(message);
				$('#chatbox').scrollTop($('#chatbox').attr('scrollHeight'));
				popupVisible();
				$('.patten').hide();
				$('#popupMsg').text('与服务器断开连接...');
				$('#popupMsg').show();
			});
			/*
			 *聊天信息显示在文本框，同时将文本框自动拉到最后
			 */
			socket.on('message',function(from,data){
				message += from+': '+data+'\n';
				$('#chatbox').val(message);
				$('#chatbox').scrollTop($('#chatbox').attr('scrollHeight'));
			});

			/*
			 *玩家选择随机模式，在等待分配到玩家前遮盖整个页面,发送游戏模式到服务器
			 *
			 */
			$('#random').click(function(){
				$('.patten').hide();
				$('#popupMsg').text('正在随机分配,如果长时间没有人进来，请选择邀请好友...');
				$('#popupMsg').show();
				socket.emit('random','random');
			});
			/*
			 *玩家选择与好友对战，在等待分配到玩家前遮盖整个页面,发送游戏模式到服务器
			 *
			 */
			$('#contact').click(function(){
				var d = new Date();
				var room = d.getFullYear()+''+d.getMonth()+''+d.getDate()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+d.getMilliseconds();
				$('.patten').hide();
	//			$('#popupMsg').text('请复制该网址：http://tddps.cloudfoundry.com/'+room+'给好友.正在等待好友进入,如果长时间没有人进来，请选择随机分配...');
				$('#popupMsg').text('请复制该网址：http://127.0.0.1:3000/'+room+'给好友.正在等待好友进入,如果长时间没有人进来，请选择随机分配...');
				$('#popupMsg').show();
				socket.emit('contact',room);
			});
			/*
			 *重连，发送房间号到服务器，找回自己的房间所在
			 */
			socket.on('reconnect',function(){
				popupVisible();
				$('.patten').hide();
				$('#popupMsg').text('正在重新连接...');
				$('#popupMsg').show();
				socket.emit('reconnect',room,room);
			});
			/*
			 *重连成功，文本框中给予提示，同时将遮盖层去掉
			 */
			socket.on('reconnect_success',function(room,data){
				popupHidden();
				message += data+'\n';
				$('#chatbox').val(message);
				$('#chatbox').scrollTop($('#chatbox').attr('scrollHeight'));
			});
			/*
			 *对方玩家与服务器失去连接，遮盖页面
			 */
			socket.on('disconnected',function(from,data){
				popupVisible();
				$('.patten').hide();
				$('#popupMsg').text(from+data);
				$('#popupMsg').show();
			});
			/*
			 *找到玩家，将玩家的信息显示在下方，保存房间号，开始游戏
			 */
			socket.on('aim',function(from,data){
				popupHidden();
				data = data.user;
				$('#aimPic').attr('src',data.profile_image_url);
				$('#aimUrl').attr('href','http://weibo.com/'+data.profile_url);
				$('#aimName').text(data.name);
				$('#aimPic').attr('title',data.id);
				$('#aimFollowers').text($('#aimFollowers').text()+data.followers_count);
				$('#aimFriends').text($('#aimFriends').text()+data.friends_count);
				$('#aimstatues').text($('#aimStatues').text()+data.statues_count);
				message += '与'+data.name+'进行游戏\n';
				$('#chatbox').val(message);
				$('#chatbox').scrollTop($('#chatbox').attr('scrollHeight'));
				room = from;
				game.start();
				game.drawBg();
			});
			socket.on('score',function(room,data){
				if(userName === data.user){
					$('#score1').text(data.data);
				}else{
					$('#score2').text(data.data);
				}
			});
			/*
			 *开启与关闭音乐
			 */
			$('#sound').click(function(){
				if($('#sound').css('left') === '0px'){
					$('#sound').css('left','-30px');
					resource.mutedAll();
				}else{
					$('#sound').css('left','0px');
					resource.unMutedAll();
				}
			});
			/*
			 *选择模式
			 */
			$('#selectPatten').click(function(){
				popupVisible();
				$('.patten').show();
			});
		},
		/*
		 *游戏开始前，预加载图片，音频。显示加载动画
		 */
		start:function(){
			game.init(function(){
				setTimeout(function(){
					resource.playAudio('bg',true);
					if(room === undefined || room==='')
						popupVisible();
					$('.progress-bar').hide('slow');
					$('.patten').show();
					$('#popupMsg').hide();
					connect.socketFun();
				},500);
			});
		}
	};
	/*
	 *显示遮盖层
	 */
	function popupVisible(){
		$('.popup').css({'visibility': 'visible','opacity':1});
		$('.overlay').css({'visibility': 'visible','opacity':1});
		$('.close').click(function(){
			popupHidden();
		});
	}
	/*
	 *隐藏遮盖层
	 */
	function popupHidden(){
		$('.popup').css({'visibility': 'hidden','opacity':0});
		$('.overlay').css({'visibility': 'hidden','opacity':0});
		$('.patten').hide();
		$('#popupMsg').hide();
	}
	window.connect = connect;
})();
