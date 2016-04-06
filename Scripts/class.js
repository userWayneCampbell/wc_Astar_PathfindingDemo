function getClassType(){
	if(arguments[0] == 0){
		return getClassBird();
	}
  if(arguments[0] == 1){
		return getClassCaravan();
	}
	if(arguments[0] == 2){
		return getClassRegular();
	}
}
/*
		R = Road,
		f = field,
		F = Forest,
		h = Hill,
		r = river,
		M = Mountain,
		W = Deep Water;
 */
function getClassRegular(){
	var obj = {
					Name: "Regular",
	        R: 1,
	        f: 2,
	        F: 4,
					h: 5,
					r: 7,
					M: 10,
					W: 999999
	    };
	    return obj;
}

function getClassBird(){
	var obj = {
					Name: "Bird",
	        R: 1,
	        f: 1,
	        F: 1,
					h: 1,
					r: 1,
					M: 50,
					W: 1
	    };
	    return obj;
}

function getClassCaravan(){
	var obj = {
					Name: "Caravan",
	        R: 1,
	        f: 2,
	        F: 20,
					h: 20,
					r: 7,
					M: 10,
					W: 999999
	    };
	    return obj;
}
