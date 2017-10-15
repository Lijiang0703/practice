var Game = function(opt){
	this.init(opt);
}
Game.prototype = {
	init : function(opt){
		var canvas = document.getElementById(opt.target);
		
		this.cxt = canvas.getContext('2d');
		this.w = canvas.width;
		this.h = canvas.height;

		this.step = opt.step;  //跑车移动的单位距离
		this.fireDur = opt.fireDur;
		this.dropDur = opt.dropDur;
	},
	start : function(opt){
		var connon = new Connon(this.cxt,this.fireDur);
		
		this.connon = connon;
		this.createUfo();
		this.initMove();
		connon.init();
	},
	createUfo : function(){
		var ufo = new UFO(this.cxt);
		this.ufo = ufo.init();  //游戏区只会同时出现一个，在削减掉之后才会出现新的
	},
	initMove : function(){
	// 监听方向键的左右移动，控制炮弹的射出方向，主要控制y轴
		var $this = this;

		window.addEventListener('keydown',function(e){
			if(e.keyCode == 37){ //left
				$this.connon.moveLeft($this.step);
			}else if(e.keyCode == 39){  //right
				$this.connon.moveRight($this.step);
			}else if(e.keyCode == 32){
				var ball = $this.connon.fire();
				$this.judge(ball,$this.ufo);
			}
		},false);
	},
	judge: function(ball,u){
		var $this = this;
		if(this.isCollision(ball.x,u)){
			var t = this.collisionTime(ball,u);
			if(t)
				var time = setTimeout(function(){
					ball.stop(true);
					u.stop(true);
					$this.createUfo();
				},t*1000)
		}
	},
	isCollision : function(x,target){
		//判断是否会碰撞，在x的位置出现的时候就可以判断
		// target.x - width <= x <= target.x + width
		if(!target) target = {};
		var min = target.x - target.width;
		var max = target.x + target.width;

		if(min < 0) min = 0;
		if(max > this.w) max = this.w;
		if(x!= undefined){
			if(x >= min && x <= max+2) return true;
		}
		return false;
	},
	collisionTime : function(obj,target){
		var obj_y = obj.y,
			obj_step = obj.step,
			obj_dur = 1000/obj.dur,
			obj_hei = obj.height;

		var t_y = target.y,
			t_step = target.step,
			t_dur = 1000/target.dur;

		var time ;
		
		// 当obj.y － obj.height = target.y 时碰撞
		// obj_hei这个高度不应该算在target物体运动的长度，一开始就应该减掉			
		// obj_y - obj_dur*obj_step * time - obj_hei = t_y + t_dur*t_step *time ;  
		time =  (obj_y - obj_hei - t_y)/(obj_dur * obj_step + t_dur * t_step) ;
		if(time && time >0)
			return time;
	}
	// initBinaryTree : function(){
	// 	//放置炮弹数据和下落ufo数据，用于检测碰撞
		
	// },
	// addToTree : function(node){
	// 	if(this.rootNode == null) this.rootNode = node;
	// 	else {
	// 		//根据x和y的值判断大小，先x后y

	// 	}
	// },
	// searchTree : function(node){ // node是数据对象

	// },
	// deleteNode : function(node){

	// }
}
//炮台cannon
var Connon = function(cxt,dur){
	this.cxt = cxt;
	this.dur = dur;
	this.connonColor = '#945629';
	this.x = 95;
	this.y = 190;
	this.w = this.h = 10;
	this.speed = 10;
}
Connon.prototype = {
	init : function(){
		var $this = this;
		
		this.drawConnon();
		// this.time = setInterval(function(){
			// var ball = new Ball($this.cxt,$this.x);
			// ball.init();
		// },$this.dur);
		// return ball;
	},
	fire : function(){
		//发射
		var ball = new Ball(this.cxt,this.x);
			ball.init();
		return ball;
	},
	drawConnon : function(x){
		if(x == undefined) x = this.x;

		if(x<0) x = 0;  //控制范围
		if(x>190) x= 190;
		if(this.x != x) {
			this.clear();
			this.x = x;
		}
		this.cxt.fillStyle = this.connonColor; 
		this.cxt.fillRect(this.x,this.y,this.w,this.h);
	},
	clear : function(){
		this.cxt.clearRect(this.x,this.y,this.w,this.h);
	},
	moveLeft : function(step){
		var x = Number(this.x - step);
		this.drawConnon(x);
	},
	moveRight : function(step){
		var x = Number(this.x + step);
		this.drawConnon(x);
	}
}
//炮弹(本来要做圆形的，有些问题)
var Ball = function(cxt,opt){
	this.cxt = cxt;
	this.r = 5;
	this.ballColor = '#d60f3f';
	this.x = opt+ this.r;
	this.y = 185;
	this.height = this.r*2;
	this.step = 5;
	this.dur = 200;
}
Ball.prototype = {
	init : function(){
		var time = null,
			$this = this;
		
		this.id = _uuid(2);
		this.drawball($this.y);
		this.time = setInterval(function(){
			$this.clear();
			$this.y -= $this.step;
			if($this.y <0) clearInterval($this.time);
			else $this.drawball();
		},$this.dur);
		return this;
	},
	drawball : function (){
		this.cxt.fillStyle = this.ballColor;
		// this.cxt.arc(this.x,this.y,this.r,0,2*Math.PI);
		this.cxt.fillRect(this.x - this.r,this.y - this.r,this.r*2,this.r*2);
		this.cxt.fill();
	},
	clear : function(){
		var x = this.x - this.r,
			y = this.y - this.r,
			width = this.r * 2,
			height = this.r *2;

		this.cxt.clearRect(x,y,width,height);
	},
	stop : function(isClear){
		clearInterval(this.time);
		if(isClear) this.clear();
	}
}

//飞行物
var UFO = function(cxt){
	this.cxt = cxt;
	this.color = '#cccccc';
	this.width = 15;
	this.height = 15;
	this.r = 10;
	this.x = 95;
	this.y = 0;
	this.step = 3;
	this.dur = 250;
}
UFO.prototype = {
	init : function (){
		var time = null,
			$this = this;
		var pos = this.fallPosition();
		
		this.x = pos.x;
		this.y = pos.y;
		this.id = _uuid(2);
		
		this.drawUfo();
		this.time = setInterval(function(){
			$this.clear();
			$this.y += $this.step;
			if($this.y >=215) {
				$this.stop(true);
				alert('失败');
				window.location.reload();
			}
			else $this.drawUfo();
		},$this.dur);

		return this;
	},
	drawUfo : function(){
		this.cxt.fillStyle = this.color;
		this.cxt.fillRect(this.x ,this.y,this.width,this.height);
		this.cxt.fill();
	},
	stop:function(isClear){
		clearInterval(this.time);
		if(isClear) this.clear();
	},
	clear : function(){
		var x = this.x,
			y = this.y,
			width = this.r * 2,
			height = this.r *2;

		this.cxt.clearRect(x,y,width,height);
	},
	//随机飞行物下落路径,主要是横坐标
	fallPosition : function (){
		var x = parseInt(Math.random()*180,10);
		// var x = 95;
		var y = 20;
		return {
			x:x,
			y:y
		}
	}	
}
function _uuid(count){//用来生成unique字符串,平时工作中使用常用的方法
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	if(!count)
		return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
	else{
		var r='';
		while(count--){
			r=r+s4();
		}
		return r;
	}
}
