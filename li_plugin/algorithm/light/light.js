/**
**开关灯描述： 一共有2500盏灯，开始全部关闭，先把1的倍数序号的灯全按一遍，再把2的倍数序号的灯按一遍 ，以此类推，最后到2015的倍数的灯按一次，
**问最后有几盏灯亮着
**/

function light(){
	var lights = 2016;	
	var ison = [];
	for(var i=1;i<lights;i++){
		var light = i;  
		// ison.push(i);
		if(ison.indexOf(light)==-1){
			ison.push(light);
		}else{
			var index = ison.indexOf(light);
			ison.splice(index,1);
		}//本身加入

		for(var j=2;j<lights;j++){   //重点是否包括本身
			var value = light *j;
			if(value <lights){
				if(ison.indexOf(value)==-1){
					ison.push(value);
				}else{
					var index = ison.indexOf(value);
					ison.splice(index,1);
				}
			}
		}
	}	
	console.log(ison.length);
}