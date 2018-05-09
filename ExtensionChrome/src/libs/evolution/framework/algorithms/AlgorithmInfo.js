define(["moment"], function(moment) {
    var AlgoritmInfo = function (options) {
        if (options) {
            this.name = options.name;
            this.description = options.description;
            this.author = options.author;
            this.url = options.url;

            if (options.release) {
                this.relase = moment(release);
            }
            else {
                this.release = moment();
            }
        }    
    };

    return AlgoritmInfo;
});