(function(){
	var canvas = null; 
	var ctx = null;
	var game = {
		init: function(callback){
			canvas = document.getElementById('can');
			ctx = canvas.getContext('2d');
			resource.preLoad(function(){
				callback();
			});
		},
		start:function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			gameArray.getArray();
			mouseEvent.init(canvas);
			sprite.init(resource.getImage('game'),ctx);
			animation.init(ctx);
			animation.startgame();
			mouseEvent.addMouseEvent();
			setTimeout(function(){
				var stack = gameArray.dataCheck();
				if(stack.length !== 0){
					mouseEvent.slidedown(stack);
				}
			},700);
		},
		over:function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			mouseEvent.MouseEvent();
		},
		drawBg: function (){
			var canvas = document.getElementById('backgroundCanvas');
			var ctx = canvas.getContext('2d');
			var x = 0,y = 10,i = 0,j = 0;;
			var flag = 1;
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.save();
			for(i=0;i<8;i++){
				for(j=0;j<8;j++){
					if(flag===1){
						ctx.fillStyle = 'rgba(69,79,87,0.6)';
						ctx.fillRect(x+60*i,y+j*60,60,60);
					}else{
						ctx.fillStyle = 'rgba(58,68,76,0.9)';
						ctx.fillRect(x+60*i,y+j*60,60,60);
					}
					if(j===7){
						y = 10;
					}else{
						flag = -flag;
					}
				}
			}
			ctx.restore();
		},
	};
	window.game = game;
})();
