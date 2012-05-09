(function(){
	var arr = gameArray.getArr();
	var ctx = null;
	var animation = {
		/*
		 *初始化，传入canvas上下文，开始游戏
		 */
		init:function(c){
			ctx = c;
			this.startgame();
		},
		/*
		 * 用于两个图片交换的滑动动画
		 *@parma selected第一次点击的坐标
		 *@parma now 第二次点击的坐标
		 *@parma dirx横坐标滑动方向
		 *@parma diry纵坐标滑动方向
		 */
		slide:function(selected,now,dirx,diry,callback){
			var temp = 0 ;
			temp = arr[selected.x][selected.y] ;
			arr[selected.x][selected.y] = arr[now.x][now.y];
			arr[now.x][now.y] = temp;
			temp = 0;
			mouseEvent.removeMouseEvent();
			var timeID = setInterval(function(){
				if(temp< 60){
					ctx.clearRect(now.y*60+dirx*temp,50+now.x*60+diry*temp,60,60);
					ctx.clearRect(selected.y*60-dirx*temp,50+selected.x*60-diry*temp,60,60);
					temp += 10;
					sprite.switchimg(55+now.x*60+diry*temp,5+60*now.y+dirx*temp,arr[selected.x][selected.y]);
					sprite.switchimg(55+selected.x*60-diry*temp,5+60*selected.y-dirx*temp,arr[now.x][now.y]);
				}else{
					clearInterval(timeID);
					mouseEvent.addMouseEvent();
					if(typeof callback === 'function')
						callback();
				}
			},40);
		},
		/*
		 *开始游戏动画
		 */
		startgame:function(){
			mouseEvent.removeMouseEvent();
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
								sprite.switchimg(count+60*i-5,5+60*j,arr[i][j]);
							}
						}
					},50);
				}(j);
			}
			mouseEvent.addMouseEvent();
		},
		/*
		 *放大缩小效果
		 *temp 要处理的图片位置
		 *callback 处理之后的回调函数
		 */
		scaleeffect:function(temp,callback){
			var dir = 1.2;
			var id = setInterval(function(){
				if(dir <=  0){
					clearInterval(id);
					callback(temp);
				}else{
					ctx.save();
					ctx.clearRect(temp.y*60,50+60*temp.x,60,60);
					ctx.translate(30+60*temp.y,80+60*temp.x);
					ctx.scale(dir,dir);
					dir -= 0.1;
					ctx.translate(-(30+60*temp.y),-(80+60*temp.x));
					sprite.switchimg(55+60*temp.x,5+60*temp.y,arr[temp.x][temp.y]);
					ctx.restore();
				}
			},30);
		},
		/*
		 *下落效果
		 *timecount 计时器的总量
		 *temp 被处理的图片位置
		 *callback 回调函数
		 */
		downeffect:function(timecount,temp,callback){
			var count = 0;
			mouseEvent.removeMouseEvent();
			var timeID = setInterval(function(){
				if(count<60){
					for(var i=temp.x-1;i>=0;i--){
						ctx.clearRect(temp.y*60,50+60*i+count,60,60);
					}
					ctx.clearRect(5+temp.y*60,count-5,60,60);
					count += 10;
					for(i=1;i<=temp.x;i++){
						sprite.switchimg(60*i+count-5,5+temp.y*60,arr[i][temp.y]);
					}
					sprite.switchimg(count-5,5+temp.y*60,arr[0][temp.y]);
				}else{
					clearInterval(timeID);
					timecount.pop();
					if(timecount.length === 0){
						mouseEvent.addMouseEvent();
						callback();
					}
				}
			},40);
			timecount.push(timeID);
		}
	};
	/*
	 *导出函数
	 */
	window.animation = animation;
})();
