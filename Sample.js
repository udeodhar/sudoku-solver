var http = require('http');

//
//	Global varibles.
//
var digits = [[]];//Final digits.
var array_list = [];
var no_of_digits_found;
var possibilities = [];
var false_count = [[]];
var invalid_digits = "";
var isValid;

var init = function() {
	isValid = true;
	invalid_digits = "9,";
	no_of_digits_found = 0;
	for (var i = 0; i < 9; i++) {
		digits[i] = new Array();
		possibilities[i] = new Array();
		false_count[i] = new Array();
		for (var j = 0; j < 9; j++) {
			digits[i][j] = -1;
			false_count[i][j] = 0;
			possibilities[i][j] = new Array();
			for (var k = 0; k < 10; k++) {
				possibilities[i][j][k] = true;
			}
		}
	}
	console.log("Init completed successfully.");
}

function mask_digit(x, y, val) {
	//console.log(x,y,val);
	
	if (possibilities[x][y][val-1] === true) {
		possibilities[x][y][val-1] = false;
		false_count[x][y]++;
		if(false_count[x][y] == 8) {
			
			if (digits[x][y] == -1) {
				for (var l = 0; l < 9; l++) {
					if (possibilities[x][y][l]) {
						digits[x][y] = l+1;
						no_of_digits_found++;
						array_list.push(x,y);
						break;
					}
				}
			}
			else {
				console.log("*******************************************************");
				console.log("X: " + x + " Y: "+y);
				console.log("Previous digit: "+digits[x][y] + " New  digit: " + val);
			}
			return true;
		}
	}
	return false;
}

var solve = function(data) {
	console.log("Printing data:\n" + data);
	
	//getElements()
	for (var m = 1; m < data.length; m += 6) {
		var xc = data.charAt(m);
		var yc = data.charAt(m+2);
		var dc = data.charAt(m+4);
		if (digits[xc][yc] == -1) {
			if(possibilities[xc][yc][dc - 1]) {
				digits[xc][yc] = dc;
				for(var r = 0; r < 9; r++) {
					if ((r-1) != dc)
						possibilities[xc][yc][r] = false;
				}
				for (var n = 0; n < 9; n++) {
					mask_digit(xc, n, dc);
					mask_digit(n, yc, dc);
				}
			
				var blk = (Math.floor(xc / 3)*3 ) + (Math.floor(yc/ 3)); 
			
				for (var o = 0; o < 3; o++) {
					mask_digit((Math.floor(blk/3)*3), ((blk%3)*3)+o, dig);
					mask_digit((Math.floor(blk/3)*3)+1, ((blk%3)*3)+o, dig)
					mask_digit((Math.floor(blk/3)*3)+2, ((blk%3)*3)+o, dig)
				}			
				no_of_digits_found++;
				array_list.push(xc, yc);
			}
			else {
				console.log("******************************************************");
				isValid = false;
				invalid_digits = invalid_digits + xc + "," + yc + ",";
			}
		}
	}
	print_grid();
	//solveSudoku()
	var count = 0;
	console.log("Count: " + count + "Length: " + array_list.length);
	console.log("no_of_digits_found: " + no_of_digits_found);
	
	while(((array_list.length) > count) && (no_of_digits_found < 81)) {
	//	console.log("Count: " + count + " Length: " + (array_list.length/2) + " No of digits found: "+ no_of_digits_found);
		
		//check get is acccessible. YES, it is accessibile.
		//console.log("X    : " + array_list[count] + " Y     : " + array_list[count+1] + " Digit: "+ digits[array_list[count]][array_list[count+1]]);
		
		var dig = digits[array_list[count]][array_list[count+1]];
		//Now execute mask digit:
		
		
		//Mask row
		for (var n = 0; n < 9; n++) {
			mask_digit(array_list[count], n, dig);
			mask_digit(n, array_list[count+1], dig);
		}
		
		block = (Math.floor(array_list[count] / 3)*3 ) + (Math.floor(array_list[count+1]/ 3)); 
		
		for (var o = 0; o < 3; o++) {
			mask_digit((Math.floor(block/3)*3), ((block%3)*3)+o, dig);
			mask_digit((Math.floor(block/3)*3)+1, ((block%3)*3)+o, dig)
			mask_digit((Math.floor(block/3)*3)+2, ((block%3)*3)+o, dig)
		}
		count+=2;
	}
	console.log("Done solving.");
	console.log(print_grid());
}

var print_grid = function() {
	var str = "";
	for(var p = 0; p < 9; p++) {
		for(var q = 0; q < 9; q++) {
			if (digits[p][q] != -1) {
				str = str + p + ',' + q + ',' + digits[p][q] + ',';
			}
		}
	}
	//str += possibilities[0][2][3];
	return str;
}
	
var server = http.createServer(function(req, res) {
	console.log(req.url);
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
	console.log("****************************");
	console.log("**** Server was created ****");
	console.log("****************************");
	init();
	
	var solution = solve(req.url);
	console.log("Sending data:");
	var final_str = print_grid() ;
	if(!isValid) {
		final_str += invalid_digits;
	}
	console.log(final_str);
    res.write(final_str);
    res.end();
	init();
});

server.listen(process.env.PORT || 8080);