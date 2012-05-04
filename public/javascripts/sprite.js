var sprite = {
	timeId:null	,
	purple:function(image,i,j){
		ctx.drawImage(image,334,1607,70,70,i,j,50,50);
	},
	red:function(image,i,j){
		ctx.drawImage(image,7,1607,70,70,i,j,50,50);
	},
	white:function(image,i,j){
		ctx.drawImage(image,89,1607,70,70,i,j,50,50);
	},
	green:function(image,i,j){
		ctx.drawImage(image,170,1607,70,70,i,j,50,50);
	},
	yellow:function(image,i,j){
		ctx.drawImage(image,252,1607,70,70,i,j,50,50);
	},
	orange:function(image,i,j){
		ctx.drawImage(image,417,1607,70,70,i,j,50,50);
	},
	blue:function(image,i,j){
		ctx.drawImage(image,497,1602,70,74,i,j,50,50);
	},
	purplesprite:function(image,i,j){
		var x = 0;
		var y = 990;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	},
	clearTimer:function(){
		clearInterval(timeId);
	},
	orangesprite:function(image,i,j){
		var x = 730;
		var y = 700;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	},
	bluesprite:function(image,i,j){
		var x = 340;
		var y = 990;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	},
	yellowsprite:function(image,i,j){
		var x = 680;
		var y = 1030;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	},
	greensprite:function(image,i,j){
		var x = 0;
		var y = 1280;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	},
	redsprite:function(image,i,j){
		var x = 340;
		var y = 1280;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	},
	whitesprite:function(image,i,j){
		var x = 662;
		var y = 1375;
		var count = 1;
		timeId = setInterval(function(){
			ctx.clearRect(i,j,50,50);
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
	}
};
