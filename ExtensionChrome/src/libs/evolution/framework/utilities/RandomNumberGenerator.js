define(["lodash", "moment", "random"], function(_, moment, Random) {
    "use strict";

    var engine = Random.engines.mt19937().seed(42),  //Random.engines.nativeMath,
        undef,
        RandomNumberGenerator = function (engineFromRandom) {
            if (engineFromRandom === undef) {
                engineFromRandom = engine;
            }

            this.engine = engineFromRandom;
        };

    _.extend(RandomNumberGenerator.prototype, {/*
        next: function (min, max) {
            max = max || min;
            min = (max == min) ? 0 : min;

            return Math.floor(Math.random() * (max - min)) + min;
        },
        nextDouble: function (min, max, numberOfDecimals) {
            if (_.isUndefined(min)) {
                return Math.random();
            }

            var randomDoubleNumber = Math.random() * (max - min) + min;

            if (numberOfDecimals) {
                return +randomDoubleNumber.toFixed(numberOfDecimals);
            }
            else {
                return randomDoubleNumber;
            }
        },
        resetRandom: function() {
            
        }*/
        next: function (min, max) {
            if (max === undef) {
                max = Number.MAX_SAFE_INTEGER;
            }

            if (min === undef) {
                min = 0;
            }

            return Random.integer(min, max - 1)(this.engine);
        },
        nextDouble: function (min, max) {
            if (min === undef) {
                min = 0;
            }

            if (max === undef) {
                max = 1;
            }

            return Random.real(min, max, true)(this.engine);
        },
        resetRandom: function (seed) {
            if (seed === undef) {
                seed = moment().valueOf();
            }

            this.engine = Random.engines.mt19937().seed(seed);
        },
        createNew: function(seed) {
            if (seed === undef) {
                seed = moment().valueOf();
            }

            var newEngine = Random.engines.mt19937().seed(seed);

            return new RandomNumberGenerator(newEngine);
        }
    });

    return new RandomNumberGenerator(engine);
});