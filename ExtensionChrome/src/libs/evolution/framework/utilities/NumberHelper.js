define(["lodash"], function(_) {
    "use strict";
    
    return {
    	maxIntValue: 2147483647,
    	maxUnsignedIntValue: 4294967296,
    	maxSafeInteger: 9007199254740991,
    	maxRandomValue: 18446744073709551615,
    	bitXor: function (number1, number2) {
    		/*
    		var bigNumber1 = math.bignumber(number1),
    			bigNumber2 = math.bignumber(number2);

    		return math.bitXor(bigNumber1, bigNumber2).toNumber();*/

    		return number1 ^ number2;
    	}
    };
});