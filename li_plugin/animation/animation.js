/*
* 执行动画
*/
function Animation(duration,progress,easing){
	this.duration = duration;
	this.progress = progress;	//执行的动画
	this.easing = easing || function(p){return p};  //算子
	this.init();
}
Animation.prototype = {
	init:function(){
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame;
	},
	start:function(finished){
		var startTime = Date.now();
		var duration = this.duration,
			li = this;

		var requestId = requestAnimationFrame(frameAni);
		function frameAni(){
			var p = (Date.now()-startTime)/duration;
			var next = true;
			if(p<1.0){
				li.progress(li.easing(p),p);
				// if(next) requestAnimationFrame(frameAni);
			}else{
				if(typeof finished === 'function'){
					next = finished() === false;
				}else{
					next = finished === false;
				}

				if(!next){
					li.progress(li.easing(1.0),1.0);
					cancelAnimationFrame(requestId);
				}else{
					startTime += duration;  //为下一个动画设置起始时间，方便计算进度 p
					li.progress(li.easing(p),p);
				}
			}

			if(next) requestAnimationFrame(frameAni);  //循环的作用
		}

	}
}

/*
* 动画执行队列
*/
function AnimationQueen(animations){   
	this.animations = animations || [];
}
AnimationQueen.prototype = {
	append:function(){
		var args = [].slice.call(arguments);
		// var args = Array.prototype.slice.call(arguments);
		this.animations.push.apply(this.animations,args);
	},
	flush:function(){
		if(this.animations.length){
			var li = this;

			function play(){
				var animations = li.animations.shift();  //取第一个
				if(animations instanceof Animation){
					animations.start(function(){
						if(li.animations.length){   //继续执行接下来的动画队列
							play();
						}
					});
				}else{
					animations.apply(li);
					if(li.animations.length){
						play();
					}
				}
			}

			play();
		}
	}
}