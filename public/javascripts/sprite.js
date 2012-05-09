(function(){
	var image = {};
	var timeId = 0;
	var ctx = null;
	/*
	 *剪切图片，在指定位置将图片画上去
	 *i 横坐标
	 *j 纵坐标
	 */
	var purple=function(i,j){
		ctx.drawImage(image,334,1607,70,70,i,j,50,50);
	};
	var red=function(i,j){
		ctx.drawImage(image,7,1607,70,70,i,j,50,50);
	};
	var white=function(i,j){
		ctx.drawImage(image,89,1607,70,70,i,j,50,50);
	};
	var green=function(i,j){
		ctx.drawImage(image,170,1607,70,70,i,j,50,50);
	};
	var yellow=function(i,j){
		ctx.drawImage(image,252,1607,70,70,i,j,50,50);
	};
	var orange=function(i,j){
		ctx.drawImage(image,417,1607,70,70,i,j,50,50);
	};
	var blue=function(i,j){
		ctx.drawImage(image,497,1602,70,74,i,j,50,50);
	};
	var purplesprite=function(i,j){
		var x = 0;
		var y = 990;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,68,73,i,j,50,50);
			if(count === 4){
				x = 0;
				y += 73;
				count = 0;
				if(y >= 1280){
					y = 990;
				}
			}else{
				x += 68;
				count += 1;
			}
		},30);
	};
	var orangesprite=function(i,j){
		var x = 730;
		var y = 700;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,73,66,i,j,50,50);
			if(count === 3){
				x = 730;
				y += 66;
				count = 0;
				if(y >= 1030){
					y = 700;
				}
			}else{
				x += 73;
				count += 1;
			}
		},30);
	};
	var bluesprite=function(i,j){
		var x = 340;
		var y = 990;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,67,72.5,i,j,50,50);
			if(count === 4){
				x = 340;
				y += 72.5;
				count = 0;
				if(y >= 1280){
					y = 990;
				}
			}else{
				x += 67;
				count += 1;
			}
		},30);
	};
	var yellowsprite=function(i,j){
		var x = 680;
		var y = 1030;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,67,68,i,j,50,50);
			if(count === 3){
				x = 680;
				y += 68;
				count = 0;
				if(y >= 1370){
					y = 1030;
				}
			}else{
				x += 67;
				count += 1;
			}
		},30);
	};
	var greensprite=function(i,j){
		var x = 0;
		var y = 1280;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,68,64,i,j,50,50);
			if(count === 3){
				x = 0;
				y += 64;
				count = 0;
				if(y >= 1600){
					y = 1280;
				}
			}else{
				x += 68;
				count += 1;
			}
		},30);
	};
	var redsprite=function(i,j){
		var x = 340;
		var y = 1280;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,65,68,i,j,50,50);
			if(count === 4){
				x = 340;
				y += 68;
				count = 0;
				if(y >= 1552){
					y = 1280;
				}
			}else{
				x += 65;
				count += 1;
			}
		},30);
	};
	var whitesprite=function(i,j){
		var x = 662;
		var y = 1375;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,60,60);
			ctx.drawImage(image,x,y,65,64,i,j,50,50);
			if(count === 4){
				x = 662;
				y += 64;
				count = 0;
				if(y >= 1631){
					y = 1375;
				}
			}else{
				x += 65;
				count += 1;
			}
		},30);
	};
	var sprite = {
		timeId:null	,
		init:function(img,c){
			image = img;
			ctx = c;
		},
		/*
		 *清除定时器
		 */
		clearTimer:function(){
			clearInterval(timeId);
		},
		/*
		 *图片精灵
		 */
		switchsprite:function(i,j,r){
			switch(r){
				case 0:
					redsprite(j,i);
					break;
				case 1:
					greensprite(j,i);
					break;
				case 2:
					bluesprite(j,i);
					break;
				case 3:
					purplesprite(j,i);
					break;
				case 4:
					yellowsprite(j,i);
					break;
				case 5:
					whitesprite(j,i);
					break;
				case 6:
					orangesprite(j,i);
					break;
				default:
					break;
			}
		},
		/*
		 *静态图片
		 */
		switchimg:function(i,j,res){
			switch(res){
				case 0:
					red(j,i);
					break;
				case 1:
					green(j,i);
					break;
				case 2:
					blue(j,i);
					break;
				case 3:
					purple(j,i);
					break;
				case 4:
					yellow(j,i);
					break;
				case 5:
					white(j,i);
					break;
				case 6:
					orange(j,i);
					break;
				default:
					break;
			}
		},
	};
	window.sprite = sprite;
})();
