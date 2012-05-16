(function() {
	var x = 0,y = 0;
	/*
	 *第一次选择的图片
	 */
	var selected = undefined;
	/*
	 *第二次选择的图片
	 */
	var now = {};
	/*
	 *鼠标是否按下
	 */
	var isdown = false;
	var arr = gameArray.getArr();
	var clickhandle;
	var canvas = null;
	var continusTime = 0;
	var score = 0;
	/*
	 *通过获取鼠标的偏移位置来确定点击的图片
	 */
	var getPosition=function(e){
		if($.browser.mozilla){
			y = parseInt((e.layerX)/60,10);
			x = parseInt((e.layerY-50)/60,10);
		}else{
			y = parseInt((e.offsetX)/60,10);
			x = parseInt((e.offsetY-50)/60,10);
		}
	};
	/*
	 *
	 */
	var slidedown=function(stack){
		var self= this;
		var timecount = [];
		var len = stack.pop();
		var maxLen = 0;
		if(len.length > 1){
			score += len.length+1;
		}else if(len.length === 1){
			score += 1;
		}
		for(var i =0;i<len.length;i++){
			if(len[i] > maxLen)
				maxLen = len[i];
		}
		if(stack.length === 0){
			continusTime = 0;
			return;
		}else{
			continusTime += 1;
		}
		var temp = {};
		removeAllListener();
		if(continusTime >= 3 || maxLen >= 4){
			score += 1;
			resource.playAudio('continues',false);
		}else{
			resource.playAudio('success',false);
		}
		connect.sendScore(score);
		while(stack.length!==0){
			temp = stack.shift();
			var back = function(temp){
				animation.scaleeffect(temp,function(){
					downcallback(timecount,temp);
				});
			}(temp);
		}
	};
	var downcallback=function(timecount,temp){
		var self = this; 
		gameArray.getNewArray(temp);
		animation.downeffect(timecount,temp,function(){
			setTimeout(function(){
				if(gameArray.isOver().length === 0){
					game.start();
				}else{
					slidedown(gameArray.dataCheck());
				}
			},100);
		});
	};
	/*
	 *取消所有监听鼠标事件
	 */
	var removeAllListener=function(){
		canvas.removeEventListener('click',clickhandle);
		canvas.removeEventListener('mousedown',mousedownFun);
		canvas.removeEventListener('mousemove',mousemoveFun);
		canvas.removeEventListener('mouseup',mouseupFun);
	};
	/*
	 *增加所有监听鼠标事件
	 */
	var addAllListener=function(){
		canvas.addEventListener('mouseup',mouseupFun);
		canvas.addEventListener('click',clickhandle);
		canvas.addEventListener('mousedown',mousedownFun);
		canvas.addEventListener('mousemove',mousemoveFun);
	};
	/*
	 *鼠标按下事件的处理
	 */
	var mousedownFun=function(e){
		sprite.clearTimer();
		getPosition(e);
		if(x>=0 && x<=7 && y>=0 && y<=7){
			selected = {};
			selected.x = x;
			selected.y = y;
			sprite.switchsprite(55+60*x,5+60*y,arr[x][y]);
		}
		isdown = true;
	};
	/*
	 *鼠标按起事件的处理
	 */
	var mouseupFun=function(e){
		isdown = false;
		getPosition(e);
		now.x = x;
		now.y = y;
		if(selected !== undefined){
			if(!((selected.x-1===now.x&&selected.y===now.y)||
					(selected.x+1===now.x&&selected.y===now.y)||
					(selected.x===now.x&&selected.y-1===now.y) ||
					(selected.x===now.x&&selected.y+1===now.y))){
				sprite.clearTimer();
				sprite.switchimg(selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
			}
		}
	};
	/*
	 *鼠标移动事件的处理,先判断鼠标是否已经按下
	 */
	var mousemoveFun=function(e){
		if(isdown){
			getPosition(e);
			now.x = x;
			now.y = y;
			if(selected !== undefined){
				if((selected.x-1===now.x&&selected.y===now.y)||
						(selected.x+1===now.x&&selected.y===now.y)||
						(selected.x===now.x&&selected.y-1===now.y) ||
						(selected.x===now.x&&selected.y+1===now.y)){
					sprite.switchimg(selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
					sprite.clearTimer();
					animation.slide(selected,now,selected.y-now.y,selected.x-now.x,function(){
						var stack = gameArray.dataCheck();
						if(stack.length === 1){
							resource.playAudio('fail',false);
							animation.slide(selected,now,selected.y-now.y,selected.x-now.x,function(){
							});
							selected = undefined;
						}else{
							selected = undefined;
							slidedown(stack);
						}
					});
				}else{
					sprite.clearTimer();
					sprite.switchimg(selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
				}
			}
		}
	};
	/*
	 *鼠标点击事件的处理，单独一个函数处理，否则跟mousedown mouseup有冲突
	 */
	var clickfun = function(){
		var selected = undefined;
		var x ,y;
		var now = {};
		clickhandle = function(e){
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
					sprite.switchsprite(55+60*x,5+60*y,arr[x][y]);
				}else{
					now.x = x;
					now.y = y;
					if(selected !== undefined){
						if((selected.x-1===now.x&&selected.y===now.y)||
								(selected.x+1===now.x&&selected.y===now.y)||
								(selected.x===now.x&&selected.y-1===now.y) ||
								(selected.x===now.x&&selected.y+1===now.y)){
							sprite.switchimg(selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
							sprite.clearTimer();
							animation.slide(selected,now,selected.y-now.y,selected.x-now.x,function(){
								var stack = gameArray.dataCheck();
								if(stack.length === 1){
									animation.slide(selected,now,selected.y-now.y,selected.x-now.x,function(){
										resource.playAudio('fail',false);
									});
									selected = undefined;
								}else{
									selected = undefined;
									slidedown(stack);
								}
							});
					}else{
						sprite.clearTimer();
						sprite.switchimg(selected.x*60+55,5+60*selected.y,arr[selected.x][selected.y]);
						selected.x = now.x;
						selected.y = now.y;
						sprite.switchsprite(55+60*selected.x,5+60*selected.y,arr[selected.x][selected.y]);
						}
					}
				}
			}
		};
	}();
	/*
	 *要导出公用函数
	 */
	var mouseEvent = {
		init:function(can){
			canvas = can;
		},
		addMouseEvent:addAllListener,
		removeMouseEvent:removeAllListener,
		slidedown:slidedown
	};
	window.mouseEvent = mouseEvent;
})();
