
function isEmptyObject(obj){
	for(var p in obj){
		if (obj.hasOwnProperty(p)) return false;
	}
	return true;
}

function objectLength(obj){
	var length=0;
	for(var p in obj){
		if (obj.hasOwnProperty(p)) length++;
	}
	return length;
}

function cloneObject(obj){
	var newObj = new Object();
	for (var i in obj){
		if (typeof obj[i] == "object"){
			newObj[i] = cloneObject(obj[i]);
		}
		else newObj[i] = obj[i];
	}
	return newObj;
}
