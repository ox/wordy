var numbers = [
	0, '', 1, 'One', 2, 'Two', 3, 'Three', 4, 'Four',
	5, 'Five', 6, 'Six', 7, 'Seven', 8, 'Eight',
	9, 'Nine', 10, 'Ten', 11, 'Eleven', 12, 'Twelve',
	13, 'Thirteen', 14, 'Fourteen', 15, 'Fifteen', 16,
	'Sixteen', 17, 'Seventeen', 18, 'Eighteen', 19,
	'Nineteen', 20, 'Twenty', 30, 'Thirty', 40, 'Fourty', 
	50, 'Fifty', 60, 'Sixty', 70, 'Seventy', 80, 'Eighty', 
	90, 'Ninety', 
	100, 'Hundred', 
	1000, 'Thousand', 
	1000000, 'Million', 
	1000000000, 'Billion', 
	1000000000000, 'Trillion', 
	1000000000000000, 'Quadrillion',
	1000000000000000000, 'Quintillion', 
	1000000000000000000000, 'Sextillion', 
	1000000000000000000000000, 'Septillion',
	1000000000000000000000000000, 'Octillion',
	1000000000000000000000000000000, 'Nonillion',
	1000000000000000000000000000000000, 'Undecillion',
	1000000000000000000000000000000000000000, 'Duodecillion',
	1000000000000000000000000000000000000000000, 'Tredecillion'
	// if you have a larger number than this, you have problems.
	// write the patch yourself.
];

var wordy = exports;

// From Javascript Garden (http://bonsaiden.github.com/JavaScript-Garden/#types.typeof)
function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

// Converts a number to it's english numberal, from numbers[]
// example: number_to_name(1) #=> 'One'
var number_to_name = function(number) {
	if(is('Number',number) && number >= 0)
		return numbers[numbers.indexOf(number) + 1]
	else 
		return ''
}

// Converts a numeral in numbers[] into a Number
// example: name_to_number('One') #=> 1
var name_to_number = function(number) {
	if(is('String',number))
		return numbers[numbers.indexOf(new String(number).toString()) - 1]
}

// Deals with converting Numbers < 1000 to their english numeral counterparts
// example: number_under_a_thousand(55) #=> 'FiftyFive'
function number_under_a_thousand(number) {
	str = '';
	if(number >= 100) {
		var hundred = Math.floor(number/100);
		str = number_to_name(hundred) + number_to_name(100);
		number -= hundred * 100;
	}
	
	if(number > 10 && number < 20) {
		str += number_to_name(number);
		number -= number;
	}
	
	var big = Math.floor(number/10) * 10;
	var small = number - big;
	str = str + number_to_name(big) + number_to_name(small);
	return str;
}

// Converts numerals < 1000 to their Number counterparts
// example: name_under_a_thousand('FiftyFive') #=> 55
function name_under_a_thousand(number) {
	var k = number, y = 0;
	
	var hundreds = k.match(/Hundred/);
	if(hundreds) {
		var e = k.match(/([A-Z][a-z]+)Hundred/);
		y += name_to_number(e[1]) * 100;
		k = k.slice(e[1].length + 7);
	}
	var tens = k.match(/([A-Z][a-z]+)[A-Z][a-z]+/);
	if(tens) {
		y += name_to_number(tens[1]);
		k = k.slice(tens[1].length);
	}
	y += name_to_number(k);	
	return y; //we get back a Number
}

// Translates from Number to English numeral
//
// This differs from #number_to_name because it breaks down large numbers
// into smaller chunks under 1000 and parses them, then adds the multiple
// afterwards. It breaks down the number 3 end-digets at a time.
//
// flow (12001055) -> 'FiftyFive' 
// flow (12001)		 -> 'OneThousand'
// flow (12)			 -> 'TwelveMillion'
// #=> TwelveMillionOneThousandFiftyFive
//
// example: var wordy = require('wordy');
//					wordy.cipher(1055); #=> 'OneThousandFiftyFive'
wordy.cipher = function(number) {
	if(!number && is('Number',number)) return;
	if(number == 0) return 'Zero'; // Edge case, numbers[0] = ''
	var str = ''; // The final output

	var k = number.toString(); // Always working with strings 
	var s = 0; // Base unit, eg: 0, 1000, 1000000, 1000000000
	while(k != '') {
		var section = k.slice(-3); // Take the last 3 digits
		
		// Parse the digits for numbers under a thousand
		if(section != '000')
		  // str is built by prepending multiplier + base unit + str
			str = number_under_a_thousand(Number(section)) + number_to_name(s) + str;
		else
			str = number_under_a_thousand(Number(section)) + str;
		
		k = k.slice(0,-3); // Remove the last 3 digits from the number
		
		// Increase the base unit. Ex: movement from 1,000 -> 1,000,000
		if(s==0)
			s += 1000
		else 
			s *= 1000;
	}

	return str; // The final outputted String
}

// Translates English numerals to Numbers
//
// This function takes in a long string created by wordy or any other
// text and translates it into a Number. It does this by breaking down
// the string into multipliers and the base unit and appends it to the
// running sum eg:
//
// flow('OneThousandFourHundredFiftyFive') -> 1000
// flow('FourHundredFiftyFive')						 -> 1400
// flow('FiftyFive')											 -> 1455
// #=> 1455
//
// example: var wordy = require('wordy');
//					wordy.decipher('TwelveThousandNineHundredEightySix'); #=> 12986
wordy.decipher = function(number) {
	if(!number && is('String', number)) return;
	if(number == 'Zero') return 0; //Edge case since numbers[0] = ''
	var num = 0, 				// running sum of parsed number
			k = number,			// a local copy of number
			construct = []; // the construct to hold our multipliers and base units
											// looks like [ 1, 1000, 456, 1] for 1456

	while( k != '') {
		// s is the regex that pulls out the multiplier and the base unit
		// ex k = 'OneThousand'
		// s[1]: 'One'; s[2]: 'Thousand';
		var s = k.match(/(?:Trillion|Billion|Million|Thousand|Quadrillion|Quintillion|Sextillion|Septillion|Octillion|Nonillion|Undecillion|Duodecillion|Tredecillion|^)(.*?)(Trillion|Billion|Million|Thousand|Quadrillion|Quintillion|Sextillion|Septillion|Octillion|Nonillion|Undecillion|Duodecillion|Tredecillion)/);
		if(s) {
			// we have things like millions and such which follow easy rules
			// so we take the multiplier and parse that into a number
			// then parse the base unit and put them both in the construct
			construct.push(name_under_a_thousand(s[1]));
			construct.push(name_to_number(s[2]));
			k = k.slice(s[1].length + s[2].length);
		} else {
			// We are down to just the last hundred
			// so we just parse the number and set it's base unit as 1, which it is
			construct.push(name_under_a_thousand(k));
			construct.push(1);
			k = ''; // Finish evaluating, since there is nothing left for us to parse
		}
	}
	
	// Here the construct take the multiplier, multiplies it by the base unit
	// and then adds it to the running sum 'num'
	for(var i = 0; i < construct.length; i+=2) {
		num += construct[i] * construct[i+1];
	}
	
	// The final output which is a Number
	return num;
}
