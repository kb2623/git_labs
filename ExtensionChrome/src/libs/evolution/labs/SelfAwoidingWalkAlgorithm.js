define(["lodash", "moment", "libs/evolution/framework/algorithms/Algorithm", "libs/evolution/framework/algorithms/AlgorithmInfo", 
    "../framework/utilities/RandomNumberGenerator", "../framework/utilities/HashSet", "../framework/utilities/NumberHelper", 
    "../framework/utilities/Stopwatch", "./SequenceIndividual", "./SequenceType"],
    function (_, moment, Algorithm, AlgorithmInfo, RandomNumberGenerator, HashSet, NumberHelper, Stopwatch, SequenceIndividual, SequenceType) {
        "use strict";

        return Algorithm.extend({
            initialize: function (options) {
                this.bestSequenceCounter = 0;
                this.breakAtOptimum = false;
                this.lastSentServerLog = moment();
                this.runtimeLmt = 0;
                this.walkSegment = 0;
                this.seed = 42;
                this.L = 27;
                this.walkSegmentFactor = 8;
                this.stopwatch = new Stopwatch();

                this.info = new AlgorithmInfo({
                    author: "Borko Boškovič",
                    name: "Zmaj",
                    description: "Labs problem solving"
                });
            },
            initializeBeforeFirstRun: function (beforeFirstRunData) {
                var options = beforeFirstRunData || {};

                if (options.runtimeLmt) {
                    this.runtimeLmt = options.runtimeLmt;
                }

                if (options.seed) {
                    this.seed = options.seed;
                }

                if (options.L) {
                    this.L = options.L;
                }

                if (options.walkSegment) {
                    this.walkSegment = options.walkSegment;
                }

                if (options.walkSegmentFactor) {
                    this.walkSegmentFactor = options.walkSegmentFactor;
                }
            },
            run: function (isFirstRun) {
                this.stopwatch.start();

                var flipEnergy,
                    stepEnergy,
                    bits = 0,
                    iBefore = NumberHelper.maxUnsignedIntValue,
                    steps = 0,
                    seq = new SequenceIndividual({ L: this.L, seed: this.seed, type: SequenceType.skew }),
                    rand = RandomNumberGenerator.createNew(this.seed);

                this.targetEnergy = SequenceIndividual.getBestEnergy(this.L);
                SequenceIndividual.neighborhoodData(this.L, this.seed);

                var D = seq.getD();

                this.walkSegment = this.walkSegmentFactor * D;
                this.cntProbe = 1;
                this.totalCntProbe = 0;

                var bestBit = [];

                if(this.sseq && this.sseq.length > 0) {
                    seq = sseq;
                }
                else {
                    seq.random();
                }

                seq.neighborhood();
                this.best = seq.energy();

                this.printInfo(seq, true);   

                this.cntProbe = 1;

                var walk = new HashSet();

                //walk.reserve(walkSegment<<4);
                //this.printInfo(seq);  

                while(!this.stop) {
                    stepEnergy = NumberHelper.maxIntValue;

                    walk.add(seq.getKey());

                    bits = 0;

                    for (var i = 0; i < D; i++){
                        if (i === iBefore) {
                            continue;
                        }

                        flipEnergy = seq.flipEnergy(i,stepEnergy);

                        if (flipEnergy < stepEnergy){
                            if (walk.count(seq.getFlippedKey(i)) > 0) {
                                continue;
                            }

                            bestBit[0] = i;
                            bits = 1;
                            stepEnergy = flipEnergy;
                        }
                        else if (flipEnergy === stepEnergy){
                            if (walk.count(seq.getFlippedKey(i)) > 0) {
                                continue;
                            }

                            bestBit[bits] = i;
                            bits++;
                        }
                    }

                    if (iBefore === NumberHelper.maxUnsignedIntValue) {
                        this.cntProbe += D;
                    }
                    else { 
                        this.cntProbe += D - 1;
                    }

                    steps++;

                    if (bits > 0) {
                        if (steps === this.walkSegment){
                            if(stepEnergy <= this.best) {
                                var isBetter = stepEnergy < this.best;

                                iBefore = bestBit[rand.next() % bits];
                                seq.flip(iBefore, stepEnergy);

                                this.best = seq.energy();
                                this.printInfo(seq, isBetter); 

                                if (stepEnergy <= this.targetEnergy && this.breakAtOptimum) {
                                    break;
                                }
                            }

                            walk.clear();
                            iBefore = NumberHelper.maxUnsignedIntValue;
                            seq.random();
                            seq.neighborhood();
                            this.cntProbe ++;
                            steps = 0;

                            if (seq.energy() <= this.best){
                                var isBetter = seq.energy() < this.best;
                                
                                this.best = seq.energy(); 
                                this.printInfo(seq, isBetter);   

                                if (stepEnergy <= this.targetEnergy && this.breakAtOptimum) {
                                    break;
                                }
                            }
                        }
                        else {
                            iBefore = bestBit[rand.next() % bits];
                            seq.flip(iBefore, stepEnergy);
                            seq.updateNeighborhood(iBefore);

                            if (stepEnergy <= this.best) { 
                                var isBetter = stepEnergy < this.best;       

                                this.best = seq.energy();                 
                                this.printInfo(seq, isBetter);                                

                                if (stepEnergy <= this.targetEnergy && this.breakAtOptimum) {
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        walk.clear();
                        iBefore = NumberHelper.maxUnsignedIntValue;
                        seq.random();
                        seq.neighborhood();
                        this.cntProbe ++;
                        steps = 0;

                        if (seq.energy() <= this.best){
                            var foundOptimum = stepEnergy <= this.targetEnergy,
                                isBetter = seq.energy() < this.best;

                            this.best = seq.energy();
                            this.printInfo(seq, isBetter, foundOptimum);   

                            if (foundOptimum && this.breakAtOptimum) {
                                break;
                            }
                        }
                    }
                }

                return {
                    L: seq.L,
                    s: seq.s,
                }; 
            },
            getCurrentState: function () {
                var durationInMs = this.stopwatch.getDuration();

                var currentState = {
                    evaluator: {
                        evaluations: this.cntProbe,
                        totalEvaluations: this.totalCntProbe + this.cntProbe
                    },
                    result: {
                        bestEnergy: this.best
                    },
                    timestamp: moment().toISOString(),
                    statistics: {
                        duration: moment.utc(durationInMs).format("HH:mm:ss.SSS"), 
                        meritFactor: (this.L * this.L) / (2.0 * this.best),
                        speed: Math.round((this.totalCntProbe + this.cntProbe) / moment.duration(durationInMs).as("seconds"))
                    } 
                };

                this.totalCntProbe += this.cntProbe;
                this.cntProbe = 0;

                return currentState;
            },
            printInfo: function (seq, foundBetter, foundOptimalSolution) {
                var durationInMs = this.stopwatch.getDuration(),
                    logToSendToServer = { 
                        type: "save", 
                        message: {
                            evaluator: {
                                evaluations: this.cntProbe,
                                totalEvaluations: this.totalCntProbe + this.cntProbe
                            },
                            returnToServer: {
                                foundOptimum: false 
                            },
                            result: {
                                bestEnergy: this.best, 
                                bestSequence: seq.s  
                            },
                            timestamp: moment().toISOString(),
                            statistics: {
                                duration: moment.utc(durationInMs).format("HH:mm:ss.SSS"), 
                                meritFactor: (this.L * this.L) / (2.0 * this.best),
                                speed: Math.round((this.totalCntProbe + this.cntProbe) / moment.duration(durationInMs).as("seconds"))
                            }                          
                        }
                    },/*
                    optionsToSaveToServer = {
                        type: "save",
                        message: {
                            evaluator: {
                                evaluations: this.cntProbe
                            },
                            result: {
                                bestSequence: {
                                    s: seq.s  
                                }
                            }
                        }
                    },*/
                    bestEnergyGlobal = SequenceIndividual.getBestEnergy(this.L),
                    text = "L: " + this.L + " Best energy global: " + bestEnergyGlobal + ". Best energy: " + logToSendToServer.message.result.bestEnergy +
                    ". Merit factor: " + logToSendToServer.message.statistics.meritFactor + ". Speed: " + logToSendToServer.message.statistics.speed + 
                    ". Duration: " + logToSendToServer.message.statistics.duration + ". CntProbe: " + (this.totalCntProbe + this.cntProbe);

                this.postMessageToClient({ 
                    type: "log", 
                    message: _.extend({}, logToSendToServer.message, { text: text, solverRun: { L: this.L } }) 
                });

                if (foundOptimalSolution) {
                    logToSendToServer.message.returnToServer.foundOptimum = true;
                }

                if (foundBetter || moment().subtract(30, 's').isAfter(this.lastSentServerLog)) {
                    this.postMessageToServer(logToSendToServer);
                    //this.postMessageToServer(optionsToSaveToServer);

                    this.totalCntProbe += this.cntProbe;
                    this.cntProbe = 0;
                }
            }
        });
    }
);