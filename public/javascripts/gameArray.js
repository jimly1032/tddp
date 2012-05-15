(function(){
	var arr = new Array(8);
	var gameArray = {
		getArr:function(){
			return arr;
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
						if(temp===2&&i===6&&j===7){
							stack.push({'x':i+1,'y':j});
						}
					}else{
						if(temp === 0){
							continue;
						}else if(temp === 1){
							for(k=0;k<temp;k++){
								stack.pop();
							}
							temp = 0;
						}else if(temp >= 2){
							console.log(i+' '+j);
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
			return stack;
		},
		/*
		 *消除之后随机生成新的数值
		 *@parma temp消除的对象
		 */
		getNewArray:function(temp){
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
						if(arr[i+1] !== undefined &&arr[i+1][j-1] !== undefined &&arr[i][j] ===arr[i+1][j-1]){
							temp.push({'x':i+1,'y':j-1});
						}
						if(arr[i-1] !== undefined &&arr[i-1][j-1] !== undefined  &&arr[i][j] ===arr[i-1][j-1]){
							temp.push({'x':i-1,'y':j-1});
						}
						if(arr[i][j-2] !== undefined &&arr[i][j] ===arr[i][j-2]){
							temp.push({'x':i,'y':j-2});
						}
						if(arr[i][j+3] !== undefined &&arr[i][j] ===arr[i][j+3]){
							temp.push({'x':i,'y':j+3});
						}
					}
					if(arr[i][j+2] !== undefined &&arr[i][j] ===arr[i][j+2]){
						if(arr[i-1] !== undefined &&arr[i-1][j+1] !== undefined &&arr[i][j] ==arr[i-1][j+1]){
							temp.push({'x':i-1,'y':j+1});
						}
						if(arr[i+1] !== undefined &&arr[i+1][j+1] !== undefined &&arr[i][j] ==arr[i+1][j+1]){
							temp.push({'x':i+1,'y':j+1});
						}
					}
					if(arr[i+2] !== undefined &&arr[i+2][j] !== undefined &&arr[i][j] ===arr[i+2][j]){
						if(arr[i+1] !== undefined &&arr[i+1][j-1] !== undefined &&arr[i][j] ==arr[i+1][j-1]){
							temp.push({'x':i+1,'y':j-1});
						}
						if(arr[i+1] !== undefined &&arr[i+1][j+1] !== undefined &&arr[i][j] ==arr[i+1][j+1]){
							temp.push({'x':i+1,'y':j+1});
						}
					}
					if(arr[i+1] !== undefined &&arr[i][j] ===arr[i+1][j]){
						if(arr[i-1] !== undefined &&arr[i-1][j-1] !== undefined &&arr[i][j] ===arr[i-1][j-1]){
							temp.push({'x':i-1,'y':j-1});
						}
						if(arr[i-1] !== undefined &&arr[i-1][j+1] !== undefined &&arr[i][j] ===arr[i-1][j+1]){
							temp.push({'x':i-1,'y':j+1});
						}
						if(arr[i+2] !== undefined &&arr[i+2][j-1] !== undefined &&arr[i][j] ===arr[i+2][j-1]){
							temp.push({'x':i+2,'y':j-1});
						}
						if(arr[i+2] !== undefined &&arr[i+2][j+1] !== undefined &&arr[i][j] ===arr[i+2][j+1]){
							temp.push({'x':i+2,'y':j+1});
						}
						if(arr[i-2] !== undefined &&arr[i-2][j] !== undefined &&arr[i][j] ===arr[i-2][j]){
							temp.push({'x':i-2,'y':j});
						}
						if(arr[i+3] !== undefined &&arr[i+3][j] !== undefined &&arr[i][j] ===arr[i+3][j]){
							temp.push({'x':i+3,'y':j});
						}
					}
				}
			}
			return temp;
		},
		/*
		 * 初始化游戏数据
		 */
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
			for(var k =0;k<1;k++){
				for(i=0;i<8;i++){
					for(j=1;j<8;j++){
						if(arr[i][j] === arr[i][j-2]){
							arr[i][j] -= 1;
							if(arr[i][j] === -1)
								arr[i][j] = Math.floor(Math.random()*7);
						}
						if(arr[i][j] ===arr[i][j-1]){
								arr[i][j] += 1;
								if(arr[i][j] === 7)
									arr[i][j] = Math.floor(Math.random()*7);
							}
						}
					}
				}
				//检查列
				for(j=0;j<8;j++){
					for(i=1;i<8;i++){
						if(arr[i][j] ===arr[i-1][j]){
								temp += 1;
									arr[i][j] -= 1;
									if(arr[i][j] === -1)
										arr[i][j] = Math.floor(Math.random()*7);
									temp = 0;
						}
					}
				}
		}
	};
	window.gameArray = gameArray;
})();
