var canvas = null; 
var ctx = null;
var images = null;
var score = 0;
var game = {
	init: function(){
		canvas = document.getElementById('can');
		ctx = canvas.getContext('2d');
		images = {};
	},
	//游戏边框
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
	/*
	 *加载图片，根据数据将图片画到画布
	 */
	drawImg:function(){
		var that = this;
		images = new Image();
		images.src = "./ddpimage/game.png";
		gameArray.getArray();
		images.onload = function(){
			mouseEvent.init(canvas);
			sprite.init(images,ctx);
			animation.init(ctx);
			mouseEvent.addMouseEvent();
		};
		setTimeout(function(){
			var stack = gameArray.dataCheck();
			if(stack.length !== 0){
				mouseEvent.slidedown(stack);
			}
		},700);
	},
};
$(function(){
	game.init();
	game.drawLine();
	game.drawImg();
});
