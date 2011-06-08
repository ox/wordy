// Test
var vows = require('vows'),
		assert = require('assert'),
		wordy = require('../lib/wordy');
		
var api = {
	cipher: function(obj) { return wordy.cipher(obj); },
	decipher: function(obj) { return wordy.decipher(obj); }
}

function returns(status) {
	var context = {
		topic: function() {
			var req = this.context.name.split(/ +/), method = req[0].toLowerCase(),
					obj = req[1];
					return api[method](obj);
		}
	};
	
	context['should respond with '+ status] = function(topic) {
		assert.equal(topic, status);
	};
	
	return context;
}

vows.describe('wordy ciphering/deciphering').addBatch({
	'cipher 0': 							returns('Zero'),
	'cipher 9': 							returns('Nine'),
	'cipher 25': 							returns('TwentyFive'),
	'cipher 58': 							returns('FiftyEight'),
	'cipher 100': 						returns('OneHundred'),
	'cipher 155': 						returns('OneHundredFiftyFive'),
	'cipher 200': 						returns('TwoHundred'),
	'cipher 837': 						returns('EightHundredThirtySeven'),
	'cipher 1000': 						returns('OneThousand'),
	'cipher 55000': 					returns('FiftyFiveThousand'),
	'cipher 123456': 					returns('OneHundredTwentyThreeThousandFourHundredFiftySix'),
	'cipher 1000000': 				returns('OneMillion')
}).addBatch({
	'decipher Zero': 					returns(0),
	'decipher One': 					returns(1),
	'decipher Nine': 					returns(9),
	'decipher TwentyFive': 		returns(25),
	'decipher FiftyEight': 		returns(58),
	'decipher OneHundred': 		returns(100),
	'decipher OneMillionFiveHundredFiftyNineThousandFourHundredNinetySix': returns (1559496),
	'decipher TwelveTrillionNineBillionFourHundredFiftyNineMillionEightHundredSixteenThousandFiveHundredEleven': returns(12009459816511)
}).run();
