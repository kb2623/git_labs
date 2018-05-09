define(["libs/evolution/framework/utilities/Helpers"], function(Helpers) {
    var Individual = function (options) {
            options = options || {};

            this.fitness = options.fitness || 0.0;
            this.solution = options.solution ? options.solution.slice() : [];
            
            this.initialize.apply(this, arguments);
        };

    Individual.extend = Helpers.extend;

     _.extend(Individual.prototype, {
        initialize: function () { },
        toString: function (onlyFitness, decimalPrecision) {
            decimalPrecision = decimalPrecision || 15;

            var returnString = "F: " + this.fitness.toFixed(decimalPrecision);

            if (!onlyFitness){
                returnString +" { " + this.solution.join(", ") + " }";
            }

            return returnString;
        }
    });

    return Individual;
});