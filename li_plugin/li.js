window.li = {
	isMobile:function(){
		var sUserAgent = window.nagivator.userAgent.toLowerCase();
		var isIpad = sUserAgent.match(/ipad/i) == "ipad"; //或者利用indexOf方法来匹配
	    var isIphoneOs = sUserAgent.match(/iphone os/i) == "iphone";
	    var isMidp = sUserAgent.match(/midp/i) == "midp"; //移动信息设备描述MIDP是一套Java应用编程接口，多适用于塞班系统
	    var isUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"; //CVS标签
	    var isUc = sUserAgent.match(/ucweb/i) == "ucweb";
	    var isAndroid = sUserAgent.match(/android/i) == "android";
	    var isCe = sUserAgent.match(/windows ce/i) == "windows ce";
	    var isWM = sUserAgent.match(/windows mobil/i) == "windows mobil";
	    if (isIpad || isIphoneOs || isMidp || isUc7 || isUc || isAndroid ||isCe ||isWM){
	    	return true;
	    }else return false;
	},
	isWeixin:function(){
		var us = nagivator.userAgent.toLowerCase();
		if(us.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else return false;
	}
}
