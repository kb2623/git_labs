define(["lodash"], function(_) {
    "use strict";
    
    return {
        extend: function(protoProps, staticProps) {
            var parent = this;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function(){ return parent.apply(this, arguments); };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function(){ this.constructor = child; };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        },
        extendOnlyExisting: function(objectToExtend, defaultsParameters, parameters) {
            _.extend(objectToExtend, defaultsParameters, _(parameters).pick(_(defaultsParameters).keys()));
        },
        extendToPrivate: function(objectToExtend, parameters) {
            for (var parameter in parameters) {
                var underscore = "";

                if (!parameter.indexOf("_") == 0) {
                    underscore = "_";
                }

                objectToExtend[underscore+parameter] = parameters[parameter];
            }

            return objectToExtend;
        },
        fillArray: function(number, length) {
            return _.map(Array.apply(null, new Array(length)), function() {
                return number;
            });
        },
        initializeMatrix: function (size, empty) {
            var matrix = [],
                i = 0;

            if (!empty) {
                for (; i < size.height; i++) {
                    matrix.push(this.fillArray(0, size.width));
                }
            }
            else {
                for (; i < size.height; i++) {
                    matrix.push(new Array(size.width));
                }
            }

            return matrix;
        },
        getBaseUrl: function() {
            return location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/";
        },
        generateGuid: function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        createBlobUrl: function(functionForBlob) {
            return URL.createObjectURL(new Blob(["(", functionForBlob.toString(), ")()"], { type: "application/javascript" }));
        },
        revokeBlobUrl: function(blobUrl) {
            URL.revokeObjectURL(blobUrl);
        }
    };
});
