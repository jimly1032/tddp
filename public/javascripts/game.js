var canvas = null; 
var ctx = null;
var score = 0;
var game = {
	init: function(){
		canvas = document.getElementById('can');
		ctx = canvas.getContext('2d');
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
	preLoadImg:function(images,callback){
		var total = images.length;
		var loaded = 0;
		var image = new Image();
		animation.loading();
		setTimeout(function(){
		for(var i=0;i<total;i++){
			image.onload = function(){
				if(++loaded >= total)
					callback();
			};
			image.src = images[i];
		}
		},1000);
	},
	preLoadAudio:function(images,audios,callback){
		this.preLoadImg(images,function(){
			var total = audios.length;
			var loaded = 0;
			for(var audio in audios){
				audio.addEventListener('canplaythrough',function(){
					if(++loaded >= total){
						callback();
					}
				});
			}
		});
	},
	/*
	 *加载图片，根据数据将图片画到画布
	 */
	drawImg:function(){
		var that = this;
		var images = ['../images/game.png'];
		gameArray.getArray();
		var image = new Image();
		image.src = images[0];
		sprite.init(image,ctx);
		mouseEvent.init(canvas);
		animation.init(ctx);
		this.preLoadImg(images,function(){
			animation.clearLoading();
			ctx.clearRect(0,0,canvas.width,canvas.height);
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
};
//$(function(){
//	game.init();
//	game.drawLine();
//	game.drawImg();
//});
