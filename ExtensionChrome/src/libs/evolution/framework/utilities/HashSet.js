define(function () {
	"use strict";

	var HashSet = function () {
		this._set = [];
	};

	_.extend(HashSet.prototype, {
		add: function (obj) {
	        if (!this.contains(obj)) {
	            this._set.push(obj);
	        }
	    },
	    remove: function (obj) {
	        var index = this._set.indexOf(obj);

	        if (index > -1) {
	        	this._set.splice(index, 1);
	        }
	    },
	    clear: function () {
	        this._set = [];
	    },
	    contains: function (obj) {
	    	for (var i = this._set.length - 1; i >= 0; i--) {
	    		if (this._set[i] === obj) {
	    			return true;
	    		}
	    	}

	    	return false;
	    },
	    count: function (key) {
	    	var count = 0,
	    		i = this._set.length - 1;

	    	for (; i >= 0; i--) {
	    		if (this._set[i] === key) {
	    			count ++;
	    		}
	    	}

	    	return count;
	    },
	    isEmpty: function () {
	        return this._set.length === 0;
	    }
	});

	return HashSet;
});