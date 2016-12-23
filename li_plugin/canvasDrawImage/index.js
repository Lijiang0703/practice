var canvas = document.getElementById('drawImage');
var context = canvas.getContext('2d');
var range = document.getElementById('range');
var water = drawWaterMask();
var zoom = document.getElementById('zoomImage'),
	zoomContext = zoom.getContext('2d');
var image = new Image();
var _scale = 3;   //放大镜的放大倍数
var scale = 2;  //原图的缩放比例

window.onload = function(){
	image.src = '../image/you.jpg';
	image.addEventListener('load',function(){
	 	zoom.width = image.width;
	 	zoom.height = image.height;
	 	canvas.width = image.width/2;
	 	canvas.height = image.height/2;
	 	
		scaleImage(2);
		//drawImage 的三种用法
		// img dx dy
		// img dx dy width height 
		// img sx sy swidth sheight dx dy width height
		context.drawImage(image,0,0,canvas.width,canvas.height);
		zoomContext.drawImage(image,0,0);
		listenScaleImage();
	},false);
}

function listenScaleImage(){
	var range = document.getElementById('range');
	listenMouse();
	range.addEventListener('input',function(){
		scale = this.value;
		console.log(scale);
		scaleImage(scale,water);
		// listenMouse();
	},false)
}
function scaleImage(scale){
	scale = 2;  //原图的缩放比例
	context.clearRect(0,0,canvas.width,canvas.height);

	var imageWidth = image.width/scale,
		imageHeight = image.height/scale;

	context.drawImage(image,0,0,imageWidth,imageHeight);
}
function listenMouse(){
	var isMouseDown = false;
	scale =2;
	canvas.addEventListener('mousedown',function(e){
		isMouseDown  = true;
		e.preventDefault();
	},false)
	canvas.addEventListener('mousemove',function(e){
		e.preventDefault();
		if(!isMouseDown) return;

		context.clearRect(0,0,canvas.width,canvas.height);
		scaleImage(scale);
	
		var x = e.offsetX, y = e.offsetY;
		var r = 100; 
		var sx = x*scale - r*(1.5/_scale),    //找到在原图上的起始点： 对应的中心点减去半径
			sy = y*scale - r*(1.5/_scale);

		context.save();	
		context.beginPath();
		context.strokeStyle = "#f09";
		context.lineWidth = 10;
		context.arc(x,y,r,0,Math.PI*2);
		
		context.stroke();
		context.clip();
		context.drawImage(zoom,sx,sy,r*2*(1.5/_scale),r*(3/_scale),x-r,y-r,r*2,r*2);
		context.restore();
	},false)
	canvas.addEventListener('mouseup',function(e){
		e.preventDefault();
		if(!isMouseDown) return;
		isMouseDown = false;
		scaleImage(scale);
	},false)
	canvas.addEventListener('mouseout',function(e){
		e.preventDefault();
		if(!isMouseDown) return;
		isMouseDown = false;
		scaleImage(scale);
	},false)
}
function drawWaterMask(){
	var water = document.getElementById('watermask');
	var context = water.getContext('2d');

	context.fillStyle = "#ccc";
	context.font = "bold 50px Arial";
	context.textBaseline = "middle";
	context.fillText('==いたち==',20,50);

	return water;
}