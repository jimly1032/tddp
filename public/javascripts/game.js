var canvas = null; 
var ctx = null;
var score = 0;
var game = {
	init: function(){
		canvas = document.getElementById('can');
		ctx = canvas.getContext('2d');
		resource.preLoad(function(){
//			$('div.popup').css({'visibility': 'visible','opacity':1});
//			$('div.overlay').css({'visibility': 'visible','opacity':1});
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
		});
	},
	drawLine: function (){
		var ctx = document.getElementById('line').getContext('2d');
		var x = 0,y = 50,i = 0;
		ctx.save();
		for(i;i<9;i++){
			ctx.moveTo(x,y);
			x += 480;
			ctx.lineTo(x,y);
			x -= 480;
			y += 60;
		}
		x = 0;
		y = 50;
		i = 0;
		for(i;i<9;i++){
			ctx.moveTo(x,y);
			y += 480;
			ctx.lineTo(x,y);
			x += 60;
			y -= 480;
		}
		ctx.stroke();
		ctx.restore();
	},
};
$(function(){
	game.init();
});
