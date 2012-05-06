var canvas = null; 
var ctx = null;
var images = null;
var arr = [];
var handle = null;
var mousedown = null;
var mousemove = null;
var mouseup = null;
var score = 0;
var game = {
	init: function(){
		canvas = document.getElementById('can');
		ctx = canvas.getContext('2d');
		images = {};
		arr = new Array(8);
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
	/*游戏数据*/
	getArray:function(){
		var count = 0;
		var i = 0,j = 0;
		var temp = 0;
		for(i=0;i<8;i++){
			arr[i] = new Array(8);
			for(j=0;j<8;j++){
				arr[i][j]= Math.floor(Math.random()*7);
			}
		}
		//避免过于简单,相邻过多的相同,检查行
		for(var k =0;k<6;k++){
			for(i=0;i<8;i++){
				for(j=1;j<8;j++){
					if(arr[i][j] === arr[i][j-1]){
							temp += 1;
							if(temp >= 2){
								arr[i][j]= Math.floor(Math.random()*7);
								temp = 0;
							}
						}
					}
				}
			}
			//检查列
			for(j=0;j<8;j++){
				for(i=1;i<8;i++){
					if(arr[i][j] === arr[i-1][j]){
							temp += 1;
							if(temp >= 2){
								arr[i][j]= Math.floor(Math.random()*7);
								temp = 0;
							}
					}
				}
			}
	},
	/*
	 *加载图片，根据数据将图片画到画布
	 */
	drawImg:function(){
		var that = this;
		images = new Image();
		images.src = "./ddpimage/Gameplay_768_00.png";
		this.getArray();
		images.onload = function(){
			for(var j=0;j<8;j++){
				var callback = function(j){
					var count = 0;
					var id = setInterval(function(){
						if(count === 60){
							clearInterval(id);
							count = 0;
						}else{
							for(var i = 0;i<8;i++){
								ctx.clearRect(5+60*j,60*i+count-5,60,60);
							}
							count += 10;
							for(i = 0;i<8;i++){
								sprite.switchimg(images,count+60*i-5,5+60*j,arr[i][j]);
							}
						}
					},50);
				}(j);
			}
		};
		setTimeout(function(){
			var stack = new Array();
			stack = that.dataCheck();
			if(stack.length !== 0){
				that.slidedown(stack);
			}
		},700);
	},
	removeAllListener:function(){
		canvas.removeEventListener('click',handle);
		canvas.removeEventListener('mousedown',mousedown);
		canvas.removeEventListener('mousemove',mousemove);
		canvas.removeEventListener('mouseup',mouseup);
	},
	addAllListener:function(){
		canvas.addEventListener('mouseup',mouseup);
		canvas.addEventListener('click',handle);
		canvas.addEventListener('mousedown',mousedown);
		canvas.addEventListener('mousemove',mousemove);
	},
	/*
	 * @parma handle监听器
	 *@parma selected第一次点击的坐标
	 *@parma now 第二次点击的坐标
	 *@parma dirx横坐标滑动方向
	 *@parma diry纵坐标滑动方向
	 */
	slide:function(selected,now,dirx,diry,callback){
		var that = this;
		var temp = 0 ;
		temp = arr[selected.x][selected.y] ;
		arr[selected.x][selected.y] = arr[now.x][now.y];
		arr[now.x][now.y] = temp;
		this.removeAllListener();
		temp = 0;
		var timeID = setInterval(function(){
			if(temp< 60){
				ctx.clearRect(now.y*60+dirx*temp,50+now.x*60+diry*temp,60,60);
				ctx.clearRect(selected.y*60-dirx*temp,50+selected.x*60-diry*temp,60,60);
				temp += 10;
				sprite.switchimg(images,55+now.x*60+diry*temp,5+60*now.y+dirx*temp,arr[selected.x][selected.y]);
				sprite.switchimg(images,55+selected.x*60-diry*temp,5+60*selected.y-dirx*temp,arr[now.x][now.y]);
			}else{
				clearInterval(timeID);
				that.addAllListener();
				if(typeof callback === 'function')
					callback();
			}
		},40);
	},
	addDrapDrop:function(){
		var that = this;
		var x = 0,y = 0;
		var selected = undefined;
		var now = {};
		var isdown = false;
		mousedown = function(e){
			sprite.clearTimer();
			if($.browser.mozilla){
				y = parseInt((e.layerX)/60,10);
				x = parseInt((e.layerY-50)/60,10);
			}else{
				y = parseInt((e.offsetX)/60,10);
				x = parseInt((e.offsetY-50)/60,10);
			}
			if(x>=0 && x<=7 && y>=0 && y<=7){
					selected = {};
					selected.x = x;
					selected.y = y;
					sprite.switchsprite(images,55+60*x,5+60*y,arr[x][y]);
			}
			isdown = true;
		};
		mouseup = function(e){
			isdown = false;
			if($.browser.mozilla){
				y = parseInt((e.layerX)/60,10);
				x = parseInt((e.layerY-50)/60,10);
			}else{
				y = parseInt((e.offsetX)/60,10);
				x = parseInt((e.offsetY-50)/60,10);
			}
			now.x = x;
			now.y = y;
			if(selected !== undefined){
				if(!((selected.x-1===now.x&&selected.y===now.y)||
						(selected.x+1===now.x&&selected.y===now.y)||
						(selected.x===now.x&&selected.y-1===now.y) ||
						(selected.x===now.x&&selected.y+1===now.y))){
					sprite.clearTimer();
					sprite.switchimg(images,selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
				}
			}
		};
		mousemove = function(e){
			if(isdown){
				if($.browser.mozilla){
					y = parseInt((e.layerX)/60,10);
					x = parseInt((e.layerY-50)/60,10);
				}else{
					y = parseInt((e.offsetX)/60,10);
					x = parseInt((e.offsetY-50)/60,10);
				}
				now.x = x;
				now.y = y;
				if(selected !== undefined){
					if((selected.x-1===now.x&&selected.y===now.y)||
							(selected.x+1===now.x&&selected.y===now.y)||
							(selected.x===now.x&&selected.y-1===now.y) ||
							(selected.x===now.x&&selected.y+1===now.y)){
						that.removeAllListener();
						sprite.switchimg(images,selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
						sprite.clearTimer();
						that.slide(selected,now,selected.y-now.y,selected.x-now.x,function(){
							var stack = new Array();
							stack = that.dataCheck();
							if(stack.length === 0){
								that.slide(selected,now,selected.y-now.y,selected.x-now.x,null);
								selected = undefined;
							}else{
								selected = undefined;
								that.slidedown(stack);
							}
						});
					}else{
						sprite.clearTimer();
						sprite.switchimg(images,selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
					}
				}
			}
		};
		canvas.addEventListener('mousedown',mousedown);
		canvas.addEventListener('mouseup',mouseup);
		canvas.addEventListener('mousemove',mousemove);
	},
	/*
	 *鼠标点击事件
	 */
	addListener:function(){
		var that = this;
		var x = 0,y=0;
		var selected = undefined; 
		var now = {};
		handle = function(e){
			if($.browser.mozilla){
				y = parseInt((e.layerX)/60,10);
				x = parseInt((e.layerY-50)/60,10);
			}else{
				y = parseInt((e.offsetX)/60,10);
				x = parseInt((e.offsetY-50)/60,10);
			}
			if(x>=0 && x<=7 && y>=0 && y<=7){
				if(typeof selected === 'undefined'){
					selected = {};
					selected.x = x;
					selected.y = y;
					sprite.switchsprite(images,55+60*x,5+60*y,arr[x][y]);
				}else{
					sprite.clearTimer();
					sprite.switchimg(images,selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
					now.x = x;
					now.y = y;
					if((selected.x-1===now.x&&selected.y===now.y)||
                            (selected.x+1===now.x&&selected.y===now.y)||
							(selected.x===now.x&&selected.y-1===now.y) ||
							(selected.x===now.x&&selected.y+1===now.y)){
						that.slide(selected,now,selected.y-now.y,selected.x-now.x,function(){
							var stack = new Array();
							stack = that.dataCheck();
							if(stack.length === 0){
								that.slide(selected,now,selected.y-now.y,selected.x-now.x,null);
								selected = undefined;
							}else{
								selected = undefined;
								that.slidedown(stack);
							}
						});
					}else{
						selected.x = now.x;
						selected.y = now.y;
						sprite.switchsprite(images,55+60*selected.x,5+60*selected.y,arr[selected.x][selected.y]);
					}
				}
			}
		};
		canvas.addEventListener('click',handle);
	},
	/*	 
	 *检查有没有三个连在一起
	 */
	dataCheck:function(){
		var i=0,j=0,temp = 0;
		var stack = new Array(); 
		for(i=0;i<8;i++){
			for(j=0;j<8;j++){
				if(arr[i][j] === arr[i][j+1]){
					stack.push({'x':i,'y':j});
					temp += 1;
				}else{
					if(temp === 0){
						continue;
					}else if(temp === 1){
						for(var k=0;k<temp;k++){
							stack.pop();
						}
						temp = 0;
					}else if(temp >= 2){
						stack.push({'x':i,'y':j});
						temp = 0;
					}
				}
			}
			if(temp === 1){
				stack.pop();
				temp = 0;
			}
		}
		temp = 0;
		for(j=0;j<8;j++){
			for(i=0;i<7;i++){
				if(arr[i][j] === arr[i+1][j]){
					stack.push({'x':i,'y':j});
					temp += 1;
				}else{
					if(temp === 0){
						continue;
					}else if(temp === 1){
						for(k=0;k<temp;k++){
							stack.pop();
						}
						temp = 0;
					}else if(temp >= 2){
						if(i===0){
							stack.push({'x':7,'y':j-1});
						}else{
							stack.push({'x':i,'y':j});
						}
						temp = 0;
					}
				}
			}
			if(temp === 1){
				stack.pop();
				temp = 0;
			}
		}
		score += stack.length;
		console.log(score);
		return stack;
	},
	/*
	 *判断游戏中是否还有可以消去的，如果没有，开始新的
	 *
	 */
	isOver:function(){
		var i = 0,j = 0;
		var temp = [];
		for(i = 0;i < 8; i++){
			for(j = 0 ;j < 7; j++){
				if( arr[i][j+1] !== undefined && arr[i][j] === arr[i][j+1]){
					if(arr[i-1] !== undefined && arr[i-1][j+2] !== undefined && arr[i][j] === arr[i-1][j+2]){
						temp.push({'x':i-1,'y':j+2});
					}
					if(arr[i+1] !== undefined && arr[i+1][j+2] !== undefined &&  arr[i][j] === arr[i+1][j+2]){
						temp.push({'x':i+1,'y':j+2});
					}
					if(arr[i+1] !== undefined && arr[i+1][j-1] !== undefined && arr[i][j] === arr[i+1][j-1]){
						temp.push({'x':i+1,'y':j-1});
					}
					if(arr[i-1] !== undefined && arr[i-1][j-1] !== undefined  && arr[i][j] === arr[i-1][j-1]){
						temp.push({'x':i-1,'y':j-1});
					}
					if(arr[i][j-2] !== undefined && arr[i][j] === arr[i][j-2]){
						temp.push({'x':i,'y':j-2});
					}
					if(arr[i][j+3] !== undefined && arr[i][j] === arr[i][j+3]){
						temp.push({'x':i,'y':j+3});
					}
				}
				if(arr[i][j+2] !== undefined && arr[i][j] === arr[i][j+2]){
					if(arr[i-1] !== undefined && arr[i-1][j+1] !== undefined && arr[i][j] == arr[i-1][j+1]){
						temp.push({'x':i-1,'y':j+1});
					}
					if(arr[i+1] !== undefined && arr[i+1][j+1] !== undefined && arr[i][j] == arr[i+1][j+1]){
						temp.push({'x':i+1,'y':j+1});
					}
				}
				if(arr[i+2] !== undefined && arr[i+2][j] !== undefined && arr[i][j] === arr[i+2][j]){
					if(arr[i+1] !== undefined && arr[i+1][j-1] !== undefined && arr[i][j] == arr[i+1][j-1]){
						temp.push({'x':i+1,'y':j-1});
					}
					if(arr[i+1] !== undefined && arr[i+1][j+1] !== undefined && arr[i][j] == arr[i+1][j+1]){
						temp.push({'x':i+1,'y':j+1});
					}
				}
				if(arr[i+1] !== undefined && arr[i][j] === arr[i+1][j]){
					if(arr[i-1] !== undefined && arr[i-1][j-1] !== undefined && arr[i][j] === arr[i-1][j-1]){
						temp.push({'x':i-1,'y':j-1});
					}
					if(arr[i-1] !== undefined && arr[i-1][j+1] !== undefined && arr[i][j] === arr[i-1][j+1]){
						temp.push({'x':i-1,'y':j+1});
					}
					if(arr[i+2] !== undefined && arr[i+2][j-1] !== undefined && arr[i][j] === arr[i+2][j-1]){
						temp.push({'x':i+2,'y':j-1});
					}
					if(arr[i+2] !== undefined && arr[i+2][j+1] !== undefined && arr[i][j] === arr[i+2][j+1]){
						temp.push({'x':i+2,'y':j+1});
					}
					if(arr[i-2] !== undefined && arr[i-2][j] !== undefined && arr[i][j] === arr[i-2][j]){
						temp.push({'x':i-2,'y':j});
					}
					if(arr[i+3] !== undefined && arr[i+3][j] !== undefined && arr[i][j] === arr[i+3][j]){
						temp.push({'x':i+3,'y':j});
					}
				}
			}
		}
		for(i = 0;i<temp.length;i++)
			console.log('is over:'+temp[i].x+" "+temp[i].y);
		return temp;
	},
	slidedown:function(stack){
		var that = this;
		var timecount = [];
		if(stack.length === 0){
			return;
		}
		console.log(stack);
		var temp = {};
		while(stack.length!==0){
			temp = stack.shift();
			var back = function(temp){
				var dir = 1.2;
				var id = setInterval(function(){
					if(dir <=  0){
						that.addAllListener();
						clearInterval(id);
						dir = 0;
						callback(temp);
					}else{
						that.removeAllListener();
						ctx.save();
						ctx.clearRect(temp.y*60,50+60*temp.x,60,60);
						ctx.translate(30+60*temp.y,80+60*temp.x);
						ctx.scale(dir,dir);
						dir -= 0.1;
						ctx.translate(-(30+60*temp.y),-(80+60*temp.x));
						sprite.switchimg(images,55+60*temp.x,5+60*temp.y,arr[temp.x][temp.y]);
						ctx.restore();
					}
				},30);
			}(temp);
			var callback = function(temp){
				for(var i=temp.x-1;i>=0;i--){
					arr[i+1][temp.y] = arr[i][temp.y];
				}
				arr[0][temp.y]= Math.floor(Math.random()*7);
				if(temp.y > 0 && temp.y < 7)
				{
					for(i = 0;i<3;i++){
						if(arr[0][temp.y]===arr[0][temp.y-1] || arr[0][temp.y+1]===arr[0][temp.y] || arr[1][temp.y]===arr[0][temp.y]){
							arr[0][temp.y]= Math.floor(Math.random()*7);
						}else{
							break;
						}
					}
				}else if(temp.y === 0){
					for(i = 0;i<3;i++){
						if(arr[0][temp.y+1]===arr[0][temp.y] || arr[1][temp.y]===arr[0][temp.y]){
							arr[0][temp.y]= Math.floor(Math.random()*7);
						}else{
							break;
						}
					}
				}else if(temp.y === 7){
					for(i = 0;i<3;i++){
						if(arr[0][temp.y]===arr[0][temp.y-1] ||  arr[1][temp.y]===arr[0][temp.y]){
							arr[0][temp.y]= Math.floor(Math.random()*7);
						}else{
							break;
						}
					}
				}
				var count = 0;
				var timeID = setInterval(function(){
					that.removeAllListener();
					if(count<60){
						for(var i=temp.x-1;i>=0;i--){
							ctx.clearRect(temp.y*60,50+60*i+count,60,60);
						}
						ctx.clearRect(5+temp.y*60,count-5,60,60);
						count += 10;
						for(i=1;i<=temp.x;i++){
							sprite.switchimg(images,60*i+count-5,5+temp.y*60,arr[i][temp.y]);
						}
						sprite.switchimg(images,count-5,5+temp.y*60,arr[0][temp.y]);
					}else{
						timecount.pop();
						if(timecount.length === 0)
							setTimeout(function(){
								that.slidedown(that.dataCheck());
							},100);
						that.addAllListener();
						clearInterval(timeID);
						count = 0;
					}
				},40);
				timecount.push(timeID);
			};
		}
	}
};
$(function(){
	game.init();
	game.drawLine();
	game.drawImg();
	game.addListener();
	game.addDrapDrop();
});
