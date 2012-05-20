(function(){
	var canvas = null; 
	var ctx = null;
	var backCanvas = null;
	var backctx = null;
	var game = {
		init: function(callback){
			canvas = document.getElementById('can');
			ctx = canvas.getContext('2d');
			resource.preLoad(function(){
				callback();
			});
		},
		start:function(){
			var self = this;
			var count = 3;
			var id = setInterval(function(){
				if(count > 0){
					resource.playAudio(''+count);
					count -= 1;
				} else{
					clearInterval(id);
					ctx.clearRect(0,0,canvas.width,canvas.height);
					gameArray.getArray();
					mouseEvent.init(canvas);
					sprite.init(resource.getImage('game'),ctx);
					animation.init(ctx);
					animation.startgame();
					self.drawBg();
					mouseEvent.addMouseEvent();
					setTimeout(function(){
						var stack = gameArray.dataCheck();
						if(stack.length !== 0){
							mouseEvent.slidedown(stack);
						}
					},700);
				}
			},1000);
		},
		over:function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			backctx.clearRect(0,0,backCanvas.width,backCanvas.height);
			mouseEvent.removeMouseEvent();
		},
		drawBg: function (){
			backCanvas = document.getElementById('backgroundCanvas');
			backctx = backCanvas.getContext('2d');
			var x = 0,y = 10,i = 0,j = 0;
			var flag = 1;
			backctx.clearRect(0,0,canvas.width,canvas.height);
			backctx.save();
			for(i=0;i<8;i++){
				for(j=0;j<8;j++){
					if(flag===1){
						backctx.fillStyle = 'rgba(69,79,87,0.6)';
						backctx.fillRect(x+60*i,y+j*60,60,60);
					}else{
						backctx.fillStyle = 'rgba(58,68,76,0.9)';
						backctx.fillRect(x+60*i,y+j*60,60,60);
					}
					if(j===7){
						y = 10;
					}else{
						flag = -flag;
					}
				}
			}
			backctx.restore();
		}
	};
	window.game = game;
})();
