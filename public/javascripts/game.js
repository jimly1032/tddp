var canvas; 
var ctx ;
var images;
var arr;
var finished;
var handle;
var score = 0;
var game = {
	socket:{},
	uid:'',
	init: function(socket,uid){
		this.socket = socket;
		this.uid = uid;
		canvas = document.getElementById('can');
		ctx = canvas.getContext('2d');
		images = {};
		arr = new Array(8);
	},
	//游戏边框
	drawLine: function (){
		var ctx = document.getElementById('line').getContext('2d');
		var x = 150,y = 50,i = 0;
		ctx.save();
		for(i;i<9;i++){
			ctx.moveTo(x,y);
			x += 400;
			ctx.lineTo(x,y);
			x -= 400;
			y += 50;
		}
		x = 150;
		y = 50;
		i = 0;
		for(i;i<9;i++){
			ctx.moveTo(x,y);
			y += 400;
			ctx.lineTo(x,y);
			x += 50;
			y -= 400;
		}
		ctx.stroke();
		ctx.restore();
	},
	/*游戏map*/
	getArray:function(){
		var count = [0,0,0,0,0];
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
		}
	},
	switchsprite:function(images,i,j,res){
		switch(res){
			case 0:
				sprite.redsprite(images,j,i);
				break;
			case 1:
				sprite.greensprite(images,j,i);
				break;
			case 2:
				sprite.bluesprite(images,j,i);
				break;
			case 3:
				sprite.purplesprite(images,j,i);
				break;
			case 4:
				sprite.yellowsprite(images,j,i);
				break;
			case 5:
				sprite.whitesprite(images,j,i);
				break;
			case 6:
				sprite.orangesprite(images,j,i);
				break;
			default:
				break;
		}
	},
	switchimg:function(images,i,j,res){
		switch(res){
			case 0:
				sprite.red(images,j,i);
				break;
			case 1:
				sprite.green(images,j,i);
				break;
			case 2:
				sprite.blue(images,j,i);
				break;
			case 3:
				sprite.purple(images,j,i);
				break;
			case 4:
				sprite.yellow(images,j,i);
				break;
			case 5:
				sprite.white(images,j,i);
				break;
			case 6:
				sprite.orange(images,j,i);
				break;
			default:
				break;
		}
	},
	drawImg:function(){
		var that = this;
		images = new Image();
		images.src = "../images/game.png";
		this.getArray();
		images.onload = function(){
			for(var j=0;j<8;j++){
				var callback = function(j){
					var count = 0;
					var id = setInterval(function(){
						if(count === 50){
							clearInterval(id);
							count = 0;
						}else{
							for(var i = 0;i<8;i++){
								ctx.clearRect(150+50*j,50*i+count,50,50);
							}
							count += 10;
							for(var i = 0;i<8;i++){
								that.switchimg(images,count+50*i,150+50*j,arr[i][j]);
							}
						}
					},50);
				}(j);
			}
		};
		var stack = new Array();
		stack = this.dataCheck();
		if(stack){
			this.slidedown(handle,stack);
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
				that.switchimg(images,50+now.x*50+diry*temp,150+50*now.y+dirx*temp,arr[selected.x][selected.y]);
				that.switchimg(images,50+selected.x*50-diry*temp,150+50*selected.y-dirx*temp,arr[now.x][now.y]);
			}else{
				finished = true;
				clearInterval(timeID);
				canvas.addEventListener('click',handle);
			}
		},30);
	},
	addListener:function(){
		var that = this;
		var x = 0,y=0;
		var selected = undefined; 
		var now = {};
		handle = function(e){
			if($.browser.mozilla){
				y = parseInt((e.layerX-150)/50,10);
				x = parseInt((e.layerY-50)/50,10);
			}else{
				y = parseInt((e.offsetX-150)/50,10);
				x = parseInt((e.offsetY-50)/50,10);
			}
			if(x>=0 && x<=7 && y>=0 && y<=7){
				if(typeof selected === 'undefined'){
					selected = {};
					selected.x = x;
					selected.y = y;
					that.switchsprite(images,50+50*x,150+50*y,arr[x][y]);
				}else{
					that.switchimg(images,selected.x*50+50,150+50*selected.y,arr[selected.x][selected.y]);
					sprite.clearTimer();
					now.x = x;
					now.y = y;
					if((selected.x-1===now.x&&selected.y===now.y)||
                            (selected.x+1===now.x&&selected.y===now.y)||
							(selected.x===now.x&&selected.y-1===now.y) ||
							(selected.x===now.x&&selected.y+1===now.y)){
						that.slide(handle,selected,now,selected.y-now.y,selected.x-now.x);
						var stack = new Array();
						stack = that.dataCheck();
						var timeID = setInterval(function(){
							if(stack.length ===0 && finished === true){
								clearInterval(timeID);
								that.slide(handle,selected,now,selected.y-now.y,selected.x-now.x);
								selected = undefined;
							}else if(finished === true){
								clearInterval(timeID);
								selected = undefined;
								that.slidedown(handle,stack);
							}
						},10);
					}else{
						selected.x = now.x;
						selected.y = now.y;
						that.switchsprite(images,50+50*selected.x,150+50*selected.y,arr[selected.x][selected.y]);
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
		console.log(stack);
		score += stack.length;
		console.log(score);
		if(stack.length>0){
			this.socket.emit('say',this.uid,{msg:$('#lab').text()+':哈哈，我得到了:'+score+'分'});
		}
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
		if(temp.length === 0 ){
			ctx.clearRect(0,0,800,800);
			this.drawImg();
		}
		for(i = 0;i<temp.length;i++)
			console.log('is over:'+temp[i].x+" "+temp[i].y);
	},
	slidedown:function(handle,stack){
		var that = this;
		if(stack.length === 0){
			return;
		}
		var temp = {};
		while(stack.length!==0){
			temp = stack.shift();
			ctx.clearRect(151+temp.y*50,51+50*temp.x,50,50);
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
				}else if(temp.y===0){
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
					canvas.removeEventListener('click',handle);
					if(count<50){
						for(var i=temp.x-1;i>=0;i--){
							ctx.clearRect(151+temp.y*50,51+50*i+count,50,50);
						}
						ctx.clearRect(151+temp.y*50,count,50,50);
						count += 10;
						for(i=1;i<=temp.x;i++){
							that.switchimg(images,50*i+count,150+temp.y*50,arr[i][temp.y]);
						}
						that.switchimg(images,count,150+temp.y*50,arr[0][temp.y]);
					}else{
						canvas.addEventListener('click',handle);
						clearInterval(timeID);
						count = 0;
					}
				},50);
			}(temp);
		}
		setTimeout(function(){
			stack = that.dataCheck();
			if(stack){
				that.slidedown(handle,stack);
			}
		},500);
	}
};
//$(function(){
//	game.init();
//	game.drawLine();
//	game.drawImg();
//	game.addListener();
//});
