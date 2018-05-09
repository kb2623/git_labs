define(["moment"], function(moment) {
    "use strict";

    var StopWatch = function () {
        this._running = false;
        this.reset();
    };

    _.extend(StopWatch.prototype, {
        start: function () {
            this._running = true;
            this._startDatetime = moment();
        },
        stop: function () {
            this._elapsedTime = this.getDuration();
            this._running = false;

            return this._elapsedTime;
        },
        getDuration: function () {
            if (this._running) {
                return moment().diff(this._startDatetime, "ms");
            }
            else {
                return this._elapsedTime;
            }
        },
        reset: function () {
            this._startDatetime = null;
        },
        restart: function () {
            this.reset();
            this.start();
        }
    });

    return StopWatch;
});