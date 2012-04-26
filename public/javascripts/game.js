var canvas; 
var ctx ;
var images;
var arr;
var finished;
var game = {
	init: function(){
		canvas = document.getElementById('can');
		ctx = canvas.getContext('2d');
		images = {};
		arr = new Array(10);
	},
	//游戏边框
	drawLine: function (){
		var ctx = document.getElementById('line').getContext('2d');
		var x = 150,y = 50,i = 0;
		ctx.save();
		for(i;i<11;i++){
			ctx.moveTo(x,y);
			x += 500;
			ctx.lineTo(x,y);
			x -= 500;
			y += 50;
		}
		x = 150;
		y = 50;
		i = 0;
		for(i;i<11;i++){
			ctx.moveTo(x,y);
			y += 500;
			ctx.lineTo(x,y);
			x += 50;
			y -= 500;
		}
		ctx.stroke();
		ctx.restore();
	},
	/*游戏map*/
	getArray:function(){
		var count = [0,0,0,0,0];
		var i = 0,j = 0;
		var temp = 0;
		for(i=0;i<10;i++){
			arr[i] = new Array(10);
			for(j=0;j<10;j++){
				arr[i][j]= Math.floor(Math.random()*6);
			}
		}
		//避免过于简单,相邻过多的相同,检查行
		for(var k =0;k<6;k++){
			for(i=0;i<10;i++){
				for(j=1;j<10;j++){
					if(arr[i][j] === arr[i][j-1]){
						temp += 1;
						if(temp >= 2){
							arr[i][j]= Math.floor(Math.random()*6);
							temp = 0;
						}
					}
				}
			}
			//检查列
			for(j=0;j<10;j++){
				for(i=1;i<10;i++){
					if(arr[i][j] === arr[i-1][j]){
						temp += 1;
						if(temp >= 2){
							arr[i][j]= Math.floor(Math.random()*6);
							temp = 0;
						}
					}
				}
			}
		}
	},
	/*加载图片,加载成功后调用回调函数进行绘制
	 *@parma sources图片源
	 *@parma callback图片成功加载后的回调函数
	 */
	preLoadImg:function(sources,callback){
		var Img = 6;
		var loadedImg = 0;
		for(var src in sources){
			images[src] = new Image();
			images[src].onload = function(){
				if(++loadedImg >=Img){
					callback();
				}
			};
			images[src].src = sources[src];
		}
	},
	drawImg:function(){
		var that = this;
		var sources = {
			0:"./images/0",
			1:"./images/1",
			2:"./images/2",
			3:"./images/3",
			4:"./images/4",
			5:"./images/5"
		};
		this.getArray();
		this.preLoadImg(sources,function(){
			for(var i = 0;i<10;i++){
				for(var j=0;j<10;j++){
					ctx.drawImage(images[arr[i][j]],151+50*j,51+50*i,45,45);
				}
			}

		});
		var stack = this.dataCheck();
		if(stack){
			this.slidedown(stack);
		}
	},
	/*
	 *@parma handle监听器
	 *@parma selected第一次点击的坐标
	 *@parma now 第二次点击的坐标
	 *@parma dirx横坐标滑动方向
	 *@parma diry纵坐标滑动方向
	 */
	slide:function(handle,selected,now,dirx,diry){
		var that = this;
		finished = false;
		canvas.removeEventListener('click',handle);
		var temp = 0 ;
		temp = arr[selected.x][selected.y] ;
		arr[selected.x][selected.y] = arr[now.x][now.y];
		arr[now.x][now.y] = temp;
		temp = 0;
		var timeID = setInterval(function(){
			if(temp< 50){
				ctx.clearRect(151+now.y*50+dirx*temp,51+now.x*50+diry*temp,48,48);
				ctx.clearRect(150+selected.y*50-dirx*temp,51+selected.x*50-diry*temp,48,48);
				temp += 10;
				ctx.drawImage(images[arr[selected.x][selected.y]],151+now.y*50+dirx*temp,50+50*now.x+diry*temp,48,48);
				ctx.drawImage(images[arr[now.x][now.y]],150+selected.y*50-dirx*temp,50+50*selected.x-diry*temp,48,48);
			}else{
				finished = true;
				clearInterval(timeID);
				canvas.addEventListener('click',handle);
			}
		},60);
	},
	addListener:function(){
		var that = this;
		var x = 0,y=0;
		var selected = undefined; 
		var now = {};
		var handle = function(e){
			if($.browser.mozilla){
				y = parseInt((e.layerX-150)/50,10);
				x = parseInt((e.layerY-50)/50,10);
			}else{
				y = parseInt((e.offsetX-150)/50,10);
				x = parseInt((e.offsetY-50)/50,10);
			}
			if(x>=0 && x<=9 && y>=0 && y<=9){
				if(typeof selected === 'undefined'){
					selected = {};
					selected.x = x;
					selected.y = y;
				}else{
					now.x = x;
					now.y = y;
					if((selected.x-1===now.x&&selected.y===now.y)||
                            (selected.x+1===now.x&&selected.y===now.y)||
							(selected.x===now.x&&selected.y-1===now.y) ||
							(selected.x===now.x&&selected.y+1===now.y)){
						that.slide(handle,selected,now,selected.y-now.y,selected.x-now.x);
						var stack = that.dataCheck();
						var timeID = setInterval(function(){
							if(stack.length ===0 && finished === true){
								clearInterval(timeID);
								that.slide(handle,selected,now,selected.y-now.y,selected.x-now.x);
								selected = undefined;
							}else if(finished === true){
								clearInterval(timeID);
								that.slidedown(stack);
							}
						},10);
					}else{
						selected.x = now.x;
						selected.y = now.y;
					}
				}
			}
		};
		canvas.addEventListener('click',handle);
	},
	//检查有没有三个连在一起
	dataCheck:function(){
		var i=0,j=0,temp = 0;
		var stack = new Array(); 
		for(i=0;i<10;i++){
			for(j=0;j<10;j++){
				if(arr[i][j] === arr[i][j+1]){
					stack.push({'x':i,'y':j});
					temp += 1;
				}else{
					if(temp === 0){
						continue;
					}else if(temp < 2 && temp >0){
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
		}
		temp = 0;
		for(j=0;j<10;j++){
			for(i=0;i<9;i++){
				if(arr[i][j] === arr[i+1][j]){
					stack.push({'x':i,'y':j});
					temp += 1;
				}else{
					if(temp === 0){
						continue;
					}else if(temp < 2 && temp >0){
						for(k=0;k<temp;k++){
							stack.pop();
						}
						temp = 0;
					}else if(temp >= 2){
						if(i===0){
							stack.push({'x':9,'y':j-1});
						}else{
							stack.push({'x':i,'y':j});
						}
						temp = 0;
					}
				}
			}
		}
		console.log(stack);
		return stack;
	},
	slidedown:function(stack){
		var that = this;
		if(stack.length === 0){
			return;
		}
		var temp = {};
		while(stack.length!==0){
			temp = stack.shift();
			ctx.clearRect(151+temp.y*50,51+50*temp.x,48,48);
			var callback = function(temp){
				for(var i=temp.x-1;i>=0;i--){
					arr[i+1][temp.y] = arr[i][temp.y];
				}
				arr[0][temp.y]= Math.floor(Math.random()*6);
				var count = 0;
				var timeID = setInterval(function(){
					if(count<50){
						for(var i=temp.x-1;i>=0;i--){
							ctx.clearRect(151+temp.y*50,51+50*i+count,48,48);
						}
						ctx.clearRect(151+temp.y*50,count,48,48);
						count += 10;
						for(i=1;i<=temp.x;i++){
							ctx.drawImage(images[arr[i][temp.y]],151+temp.y*50,50*i+count,48,48);
						}
						ctx.drawImage(images[arr[0][temp.y]],151+temp.y*50,count,48,48);
					}else{
						clearInterval(timeID);
						count = 0;
					}
				},50);
			}(temp);
		}
		setTimeout(function(){
			stack = that.dataCheck();
			if(stack){
				that.slidedown(stack);
			}
		},1000);
	}
};
//$(function(){
//	game.init();
//	game.drawLine();
//	game.drawImg();
//	game.addListener();
//});
