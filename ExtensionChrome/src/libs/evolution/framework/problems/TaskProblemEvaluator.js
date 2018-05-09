define(["libs/evolution/framework/algorithms/Individual"], function (Individual) {
    "use strict";

    var defaultOptions = {
        maxEvaluations: 100000
    },
        TaskProblemEvaluator = function (options) {
            options = options || {};
            options = _.extend({}, defaultOptions, options);

            this._numberOfEvaluations = 0;
            this._generationNumberOfEvaluations = 0;
            this._problemToSolve = options.problem;
            this._maxEvaluations = options.maxEvaluations;
            this.precisionNumberOfDecimals = options.precisionNumberOfDecimals;
            this._stopCriteria = options.stopCriteria;
        };

    _.extend(TaskProblemEvaluator.prototype, {
        _incrementNumberOfEvaluations: function () {
            if (this._numberOfEvaluations >= this._maxEvaluations) {
                throw new Error("ProblemStopCriteriaException");
            }

            this._numberOfEvaluations++;
            this._generationNumberOfEvaluations++;

            if (this._numberOfEvaluations >= this._maxEvaluations) {
                this._isStopped = true;
            }
        },
        addToNumberOfEvaluations: function (evaluationsNumber, addToGenerationNumberOfEvaluations) {
            this._numberOfEvaluations += evaluationsNumber;

            if (addToGenerationNumberOfEvaluations) {
                this._generationNumberOfEvaluations += evaluationsNumber;
            }

            if (this._numberOfEvaluations >= this._maxEvaluations) {
                this._isStopped = true;
            }
        },
        getRandomSolution: function () {
            return this._problemToSolve.getRandomSolution();
        },
        getRandomIndividual: function () {
            return this.evaluate(this._problemToSolve.getRandomSolution());
        },
        getNumberOfEvaluations: function () {
            return this._numberOfEvaluations;
        },
        getGenerationNumberOfEvaluations: function() {
            return this._generationNumberOfEvaluations;
        },
        evaluateIndividual: function(individual) {
            this._incrementNumberOfEvaluations();

            var evaluation = this._problemToSolve.evaluate(individual.solution);

            if (this._problemToSolve.getOptimumEvaluation() == +evaluation.toFixed(this.precisionNumberOfDecimals)) {
                this._isGlobal = true;
            }

            individual.fitness = evaluation;
           
            return individual;
        },
        evaluate: function (solution) {
            this._incrementNumberOfEvaluations();

            var evaluation = this._problemToSolve.evaluate(solution);

            if (this._problemToSolve.getOptimumEvaluation() == +evaluation.toFixed(this.precisionNumberOfDecimals)) {
                this._isGlobal = true;
            }
           
            return new Individual({ fitness: evaluation, solution: solution });
        },
        isStopCriteriaReached: function () {
            return this._isStopped || this._isGlobal;
        },
        resetGenerationNumberOfEvaluations: function() {
            this._generationNumberOfEvaluations = 0;
        },
        resetToDefaults: function () {
            this._isStopped = false;
            this._isGlobal = false;

            this._numberOfEvaluations = 0;
            this._generationNumberOfEvaluations = 0;
        }
    });

    return TaskProblemEvaluator;
});