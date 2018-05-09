define(["eventEmitter",  "libs/evolution/framework/algorithms/AlgorithmInfo", "libs/evolution/framework/utilities/Helpers"], function(EventEmitter, AlgorithmInfo, Helpers) {
    "use strict";

    var defaults = {
            info: new AlgorithmInfo()
        },
        Algorithm = function (parameters) {
            parameters = parameters || {};
            _.extend(this, defaults, parameters);
            this.initialize.apply(this, arguments);
        };

    Algorithm.extend = Helpers.extend;

    Algorithm.prototype = Object.create(EventEmitter.prototype);
    _.extend(Algorithm.prototype, {
        initialize: function () { },
        run: function (taskProblem) { },
        resetBeforeNewRun: function () { },
        setTaskProblemEvaluator: function (taskProblemEvaluator) {
            this._taskProblemEvaluator = taskProblemEvaluator;
        },
        getRandomIndividual: function () {
            return this._taskProblemEvaluator.getRandomIndividual();
        },
        evaluate: function (solution) {
            return this._taskProblemEvaluator.evaluate(solution);
        },
        addToNumberOfEvaluations: function (evaluationsNumber, addToGenerationNumberOfEvaluations) {
            this._taskProblemEvaluator.addToNumberOfEvaluations(evaluationsNumber, addToGenerationNumberOfEvaluations);
        },
        isStopCriteriaReached: function () {
            return this._taskProblemEvaluator.isStopCriteriaReached();
        },
        postMessageToServer: function(options) {
            options = options || {};
            options.message = options.message || {};

            switch (options.type) {
                case "log":
                    this.emit("log", options.message);
                    break;
                case "save":
                    this.emit("save", options.message);
                    break;
            }
            
            this.lastSentServerLog = moment();
        },
        /**
        * Post message to client with payload to proccess and optionally return the result
        * @param {string} methodName - Name of the method to execute on the client
        * @param {object} data - The data to be sent in the client method
        * @return {promise} - Returned promise to indicate the state of the posted message
        */
        postMessageToClient: function(options) {
            options = options || {};
            options.message = options.message || {};

            switch(options.type) {
                case 'log':
                    this.emit("client-log", options.message);
                    break;
            }
        },
        toString: function () {
            return this.info.name;
        }
    });

    return Algorithm;
});
