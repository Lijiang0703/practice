// 有一个乱序数组，例如：[ 3,1,4,8,2,10,6 ]，您能不能删除最少的数字，让剩下的数字是升序的？请输出删除最少的数字的数组
function disorder_array(){
	// 删除最少的数字得到升序的数组,也就是得到连贯数字最多的一组数组,长度大于等于2
	// 删除元素可能有相同的
	// 思路: 先升序排序排序，去重，取出最小的两个数，如果连续，则再取一个比第二个数大的元素；
	// 如果不连续，去掉最小的那个元素，同时取比第二个大的元素
	// 如果都不连续，则无解，如果有两个以上连续的，但是第三个不连续，判断剩余的长度，如果小于等于连续数组，则无需继续判断；
	// 若大于连续数组，则保留连续长度，继续递归
	// 判断保留的数组中长度最大的数组
	var arr = [ 3,1,4,8,2,9,6 ];
	var arr_copy = arr.slice(0);
	var keep, // 最长数组的长度
		order;   //保留长度
 	var index =0; //遍历的顺序,从第二个开始
	var isContinue = false;
		
	// sort();
	arr.sort();
	var max = arr.length;

	order();
	// 获取连续数组
	function order(){
		if(index >max-2) { //确保可以判断后元素 
			console.log(arr_copy.length - Math.max(keep,order));
			return;
		}
		var	next = arr[index+1];

		//是否继续连续
		if(!isContinue){
			if(max-1 - index <= keep){
				console.log(arr_copy.length - keep);
				return;
			}else{
				order? (order < keep ? order = keep: order = order) :order = keep;
				keep = 1;
			}	
		} 

		if(next - arr[index] === 1){
			keep ++;
			isContinue = true;

		}else {
			isContinue = false;
		}
		index++;
		order();
	}
	function sort(arr){
		// 包括去重
		// for()
	}

}