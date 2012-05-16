/*
 *图片 声音管理
 */
(function(){
	var audios = [];
	var images = [];
	var imageSrc = [{id:'game',src:'../images/game.png'}];
	var audioSrc = [{id:'bg',src:'../music/bg.wav'},
				{id:'continues',src:'../music/continues.wav'},
				{id:'3',src:'/music/3.wav'},
				{id:'2',src:'/music/2.wav'},
				{id:'1',src:'/music/1.wav'},
				{id:'fail',src:'/music/fail.wav'},
				{id:'success',src:'/music/success.wav'},
				{id:'winer',src:'/music/winer.wav'} ];
	var resTotal = imageSrc.length+audioSrc.length;
	var resource = {
		/*
		 *预加载图片
		 */
		preLoadImg:function(callback){
			var total = imageSrc.length;
			var loaded = 0;
			for(var i=0;i<total;i++){
				var image = new Image();
				image.onload = function(){
					loaded += 1;
					$('#progress-span').css('width',(loaded/resTotal)*100-2+'%');
					if(loaded >= total){
						callback();
					}
				};
				image.src = imageSrc[i].src;
				images.push({id:imageSrc[i].id,image:image});
			}
		},
		/*
		 *预加载声音
		 */
		preLoad:function(callback){
			this.preLoadImg(function(){
				var total = audioSrc.length;
				var loaded = 0;
				for(var i=0;i<audioSrc.length;i++){
					var audio = document.createElement('audio');
					audio.addEventListener('canplaythrough',function(){
					loaded += 1;
					var percent = ((imageSrc.length+loaded)/resTotal)*100-2;
					if(percent < 100)
						$('#progress-span').css('width',percent+'%');
						if(loaded === total){
							callback();
						}
					});
					audio.src = audioSrc[i].src;
					audios.push({id:audioSrc[i].id,audio:audio});
				}
			});
		},
		/*
		 *根据id取得图片元素
		 *@parma id
		 */
		getImage:function(id){
			for(var i=0;i<images.length;i++){
				var temp = images[i];
				if(temp.id === id){
					return temp.image;
				}
			}
		},
		/*
		 *根据id取得音频素
		 *@parma id
		 */
		getAudio:function(id){
			for(var i=0;i<audios.length;i++){
				var temp = audios[i];
				if(temp.id === id){
					return temp.audio;
				}
			}
		},
		/*
		 *根据id播放音频
		 *@parma id
		 *@parma loop 是否循环播放
		 */
		playAudio:function(id,loop){
			var audio = this.getAudio(id);
			audio.currentTime = 0;
			audio.pause();
			if(loop !== undefined)
				if(typeof audio.loop === 'boolean'){
					audio.loop =loop;
				}else{
					audio.addEventListener('ended',function(){
						this.currentTime = 0;
						this.play();
					});
				}
			audio.play();
		},
		/*
		 *静音
		 */
		mutedAll:function(){
			for(var i=0;i<audios.length;i++){
				console.log(audios[i].audio.muted);
				if(!audios[i].audio.muted){
					audios[i].audio.muted = true;
				}
			}
		},
		/*
		 *取消静音
		 */
		unMutedAll:function(){
			for(var i=0;i<audios.length;i++){
				console.log(audios[i].audio.muted);
				if(audios[i].audio.muted){
					audios[i].audio.muted = false;
				}
			}
		}
	};
	window.resource = resource;
})();
