define(["lodash", "libs/evolution/framework/algorithms/Individual", "../framework/utilities/RandomNumberGenerator", "../framework/utilities/Helpers", 
	"../framework/utilities/NumberHelper", "./SequenceType", "./bestKnownEnergies"], function(_, Individual, RandomNumberGenerator, Helpers, NumberHelper, SequenceType, bestKnownEnergies) {
	"use strict";

	var SequenceIndividual = Individual.extend({
		initialize: function (parameters) {
			 if (_.isObject(parameters)) {
				this.L = parameters.L;

				if (parameters.type == SequenceType.skew) {
					this.D = ((this.L + 1) / 2) | 0;
				}
				else {
					this.D = this.L;
				}

				this.s = Helpers.fillArray(0, this.D);
				this.key = 0;
				this.value = NumberHelper.maxIntValue;

				this.seed = parameters.seed;			
			}
			else {
				this.L = this.D = 0;
				this.key = 0;
				this.value = NumberHelper.maxIntValue;
				this.s = null;
			}

			this.seed = this.seed || 42;
			this.rand = RandomNumberGenerator.createNew(this.seed);
			this.type = parameters.type;
		},
		getL: function () {
			return this.L;
		},
		getD: function () {
			return this.D;
		},
		getKey: function () {
			return this.key;
		},
		getFlippedKey: function (bit) {
			return this.key ^ SequenceIndividual.rkey[bit]; 
			//return NumberHelper.bitXor(this.key, SequenceIndividual.rkey[bit]);
		},
		isSkew: function () {
			return this.type === SequenceIndividual.type;
		},
		getBestEnergy: function (L) {
			if (L < SequenceIndividual.maxEnergies) {
				return SequenceIndividual.bestEnergy[L]; 
			}
			else {
				return 0; 
			}
		},
		getS: function () {
			return this.s;
		},
		setKey: function (key) {
			this.key = key;
		},
		setEnergy: function (energy) {
			this.value = energy;
		},
		energy: function () {
			return this.value;
		},
		setS: function (arr, size) {
			var bit = 0;

			this.key = 0;

			for (var i = 0; i < size; i++) {
				while (bit < this.D) {
					if (arr[i] & 1 << bit) {
						this.s[bit] = 1;
						this.key ^= SequenceIndividual.rkey[bit];
						//this.key = NumberHelper.bitXor(this.key, SequenceIndividual.rkey[bit]);
					}
					else {
						this.s[bit] = -1;
					}

					bit++;

					if (bit % 64 === 0) {
						break;
					}
				}
			}
		},
		copy: function () {
			var SequenceIndividual = new SequenceIndividual({ L: this.L, seed: this.seed }, this.type),
				i = 0;

			for (; i < this.D; i++) {
				SequenceIndividual.s[i] = this.s[i];
			}

			SequenceIndividual.key = this.key;
			SequenceIndividual.value = this.value;

			return SequenceIndividual;
		},
		setSkewS: function (localBestSequenceIndividual, newL) {
			if (this.type === SequenceType.skew) {
				throw new Error("Error: skew to full SequenceIndividual!");
			}

			if (this.D != newL) {
				this.D = newL;

				if (this.s !== null) {
					this.s = null;
				}

				this.s = Helpers.fillArray(0, this.D);
			}

			var localBestS = localBestSequenceIndividual.getS(),
				localBestD = localBestSequenceIndividual.getD(),
				i = 0;

			for (; i < localBestD; i++) {
				this.s[i] = localBestS[i];
			}

			if (localBestSequenceIndividual.getL() < newL) {
				this.L = this.D - 1;
			}
			else {
				this.L = this.D;
			}

			for (i = localBestD; i < this.L; i++) {
				if ((this.L - 1 - i) % 2 === ((L / 2) | 0) % 2) {
					this.s[i] = this.s[this.L - 1 - i];
				}
				else {
					this.s[i] = -this.s[this.L - 1 - i];
				}
			}

			if (localBest.getL() < newL){
		        this.L = this.D;
		        this.s[this.L - 1] = 1;
		    }

		    this.key = 0;

		    for (i = 0; i < this.L; i++) {
		        if(this.s[i] === 1) {
		        	this.key ^= SequenceIndividual.rkey[i];
		        	//this.key = NumberHelper.bitXor(this.key, SequenceIndividual.rkey[i]);
		        }
		    }
		},
		skewS: function (i) {
			if (this.type == SequenceType.skew) {
				if (i < this.D) {
					return this.s[i];
				}
				else {
					if (((((this.L - 1) - (i)) % 2 == (((this.L / 2) | 0) % 2)))) {
						return this.s[this.L - 1 - i];
					}
					else {
						return -this.s[this.L - 1 - i];
					}
				}
			}
			else {
				console.error("Error: skew concept is used under not skew SequenceIndividual!");
			}
		},
		evaluate: function () {
			var ck = 0,
				i, k;

			this.value = 0;

			if (this.type === SequenceType.skew) {
				for (k = 2; k < this.L; k += 2) {
					ck = 0;

					for (i = 0; i <= this.L - k - 1; i++) {
						ck += this.skewS(i) * this.skewS(i + k);
					}

					this.value += ck * ck;
				}
			}
			else {
				for (k = 1; k < this.L; k++) {
					ck = 0;

					for (i = 0; i <= this.L - k - 1; i++) {
						ck += this.s[i] * this.s[i + k];
					}

					this.value += ck * ck;
				}
			}
		},
		random: function () {
			this.key = 0;

			for (var i = 0; i < this.D; i++) {
				if (this.rand.next() % 2 === 0) {
					this.s[i] = 1;
					this.key ^= SequenceIndividual.rkey[i];
					//this.key = NumberHelper.bitXor(this.key, SequenceIndividual.rkey[i]);
				}
				else {
					this.s[i] = -1;
				}
			}

			//this.s = [1, 1, 1, -1, -1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, 1, -1, 1];
			//this.s = [1, -1, 1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1, 1];
		},
		toBinaryString: function () {
			var stringBuilder = [],
				i = 0;

			for (; i < this.D; i++) {
				if (this.s[i] === 1) {
					stringBuilder.push(1);
				}
				else {
					stringBuilder.push(0);
				}
			}

			return stringBuilder.join("");
		},
		toFullBinaryString: function () {
			var stringBuilder = [],
				i = 0;

			for (; i < this.D; i++) {
				if (this.s[i] === 1) {
					stringBuilder.push(1);
				}
				else {
					stringBuilder.push(0);
				}
			}

			if (this.type === SequenceType.skew) {
				for (i = 0; i < this.D; i++) {
					if (this.skewS(i) === 1) {
						stringBuilder.push("1");
					}
					else {
						stringBuilder.push("0");
					}
				}
			}

			return stringBuilder.join("");
		},
		toRunLengthString: function () {
			var bit = this.s[0],
				run,
				i = 0,
				stringBuilder = [];

			while (i < this.D) {
				run = 0;

				while (i < this.D && this.s[i] === bit) {
					i++;
					run++;
				}

				if (i < this.D) {
					stringBuilder.push(run, ",");
				}
				else {
					stringBuilder.push(run);
				}

				bit *= -1;
			}

			return stringBuilder.join("");
		},
		toFullRunLengthString: function () {
			var bit = this.skewS(0),
				run,
				i = 0,
				stringBuilder = [];

			while (i < this.D) {
				run = 0;

				while (i < this.D && this.skewS(i) === bit) {
					i++;
					run++;
				}

				if (i < this.D) {
					stringBuilder.push(run, ",");
				}
				else {
					stringBuilder.push(run);
				}

				bit *= -1;
			}

			return stringBuilder.join("");
		},
		toString: function () {
			return this.key + this.toFullBinaryString() + " " + this.value;
		},
		good: function () {
			var tmpKey = 0,
				i = 0;

			for (; i < this.D; i++) {
		        if (this.s[i] == 1) {
		        	tmpKey ^= SequenceIndividual.rkey[i];
		        	//tmpKey = NumberHelper.bitXor(tmpKey, SequenceIndividual.rkey[i]);
		        }
		        else if (this.s[i] != -1) {
		            console.error("Wrong SequenceIndividual (bit)!");

		            return false;
		        }
		    }
		  	
		    if (this.key != tmpKey) {
		    	console.error("Wrong SequenceIndividual (key)!");

		        return false;
		    }

		    var tmpValue = this.value;

		    this.evaluate();

		    if (tmpValue != this.value){
		        console.error("Wrong SequenceIndividual (energy)!");
		        console.error(tmpValue + " != " + this.value);

		        return false;
		    }

		    return true;
		},
		neighborhood: function () {
			this.value = 0;

			var i = 0;

			if (this.type !== SequenceType.skew) {
				var ptrC = 1, 
					ptrTau = this.L,
					ptrTau2,
					k = 1;

				for (; k <= this.L - 1; k++, ptrC++, ptrTau += this.L) {
		            SequenceIndividual.C[ptrC] = 0;

		            for (i = 0; i < this.L - k; i++) {
		                SequenceIndividual.Tau[ptrTau + i] = this.s[i] * this.s[i + k];
		                SequenceIndividual.C[ptrC] +=  SequenceIndividual.Tau[ptrTau + i];
		            }

		            this.value += SequenceIndividual.C[ptrC] * SequenceIndividual.C[ptrC];
		        }

		        for (i = 0, length = this.L * this.L; i < length; i++) {
		        	SequenceIndividual.Tau2[i] = 0;
		        }

		        for (i = 0; i < this.L; i++){
		            ptrTau2 = this.L + i;
		            ptrTau = this.L + i;

		            for (k = 1; ; k++, ptrTau2 += this.L, ptrTau += this.L) {
		                if (i + k < this.L) {
		                	SequenceIndividual.Tau2[ptrTau2] += 2 * SequenceIndividual.Tau[ptrTau];
		                }

		                if (k <= i) {
		                	SequenceIndividual.Tau2[ptrTau2] += 2 * SequenceIndividual.Tau[ptrTau - k];
		                }

		                if (i < k && this.L <= i + k) {
		                	break;
		                }
		            }
		        }
			}
			else {
				var j;

				for (; i < this.D - 1; i++) {
		            for (j = 0; j < this.D - 1 - i; j++) {
		            	SequenceIndividual.Tau[i * this.D + j] = 4 * this.s[j] * this.skewS(j + (2 * (i + 1)));
		            }
		        }

		        for (i = 0; i < this.D - 1; i++) {
		            SequenceIndividual.C[i] = (SequenceIndividual.Tau[i * this.D + (this.D - 2 - i)] / 4) | 0;

		            for (j = 0; j < this.D - 2 - i; j++) {
		                SequenceIndividual.C[i] += (SequenceIndividual.Tau[i * this.D + j] / 2) | 0;
		            }

		            this.value += SequenceIndividual.C[i] * SequenceIndividual.C[i];
		        }
			}
		},
		updateNeighborhood: function (bit) {
			var v;

			if (this.type !== SequenceType.skew) {
				var ptrTau = this.L + bit,
		        	ptrTau2 = this.L + bit,
		        	ptrTauP = this.L + (bit - 1),
		        	ptrC = 1;

		        for (var p = 1; p < this.L; p++, ptrC++, ptrTau2 += this.L) {
		            v = SequenceIndividual.C[ptrC];

		            if (bit + p < this.L) {
		                v -= 2 * SequenceIndividual.Tau[ptrTau];
		                SequenceIndividual.Tau2[ptrTau2] -= 4 * SequenceIndividual.Tau[ptrTau];
		                SequenceIndividual.Tau2[ptrTau2 + p] -= 4 * SequenceIndividual.Tau[ptrTau];
		                SequenceIndividual.Tau[ptrTau] *= -1;
		                ptrTau += this.L;
		            }

		            if (p <= bit) {
		                v -= 2 * SequenceIndividual.Tau[ptrTauP];
		                SequenceIndividual.Tau2[ptrTau2] -= 4 * SequenceIndividual.Tau[ptrTauP];
		                SequenceIndividual.Tau2[ptrTau2 - p] -= 4 * SequenceIndividual.Tau[ptrTauP];
		                SequenceIndividual.Tau[ptrTauP] *= -1;
		                ptrTauP += this.L - 1;
		            }

		            SequenceIndividual.C[ptrC] = v;
		        }
			}
			else {
				var i, 
					ptrTau, 
					ptrC, 
					ptrIEnd;

		        for (ptrC = 0, ptrTau = bit - 2, ptrIEnd = ptrC + ((bit / 2) | 0);
		            ptrC < ptrIEnd;
		            ptrTau += (this.D - 2),ptrC++) {
		                v = SequenceIndividual.Tau[ptrTau];
		                SequenceIndividual.Tau[ptrTau] = -v;
		                SequenceIndividual.C[ptrC] -= v;
		        }

		        if (this.L - 1 - bit != bit) {
		            for (i = this.D - 1 - bit, ptrC = i, ptrIEnd = ptrC + (bit / 2) | 0, ptrTau = i * this.D + (bit - 2);
		                ptrC < ptrIEnd;
		                ptrTau += (this.D - 2), ptrC++) {
		                    v = SequenceIndividual.Tau[ptrTau];
		                    SequenceIndividual.Tau[ptrTau] = -v;
		                    SequenceIndividual.C[ptrC] -= v;
		            }
		        }

		        for (ptrC = 0, ptrIEnd = ptrC + this.D - bit - 2, ptrTau = bit;
		            ptrC < ptrIEnd;
		            ptrTau += this.D, ptrC++) {
		                v = SequenceIndividual.Tau[ptrTau];
		                SequenceIndividual.Tau[ptrTau] = -v;
		                SequenceIndividual.C[ptrC] -= v;
		        }
			}
		},
		flipEnergy: function (bit, maxEnergy) {
			var energy = 0,
				ptrC;

			if (_.isUndefined(maxEnergy)) {
				maxEnergy = NumberHelper.maxIntValue;
			}

			if (this.type !== SequenceType.skew) {
				var ck,
		        	ptrTau2 = this.L + bit, 		        	
		        	ptrEnd1 = (this.L / 2) | 0, 
		        	ptrEnd2 = this.L;

		        ptrC = 1;

		        for(; ptrC != ptrEnd1; ptrTau2 += this.L, ptrC++) {
		            ck = SequenceIndividual.C[ptrC] - SequenceIndividual.Tau2[ptrTau2];
		            energy += ck * ck;
		        }
		        for (; ptrC != ptrEnd2; ptrTau2 += this.L, ptrC++) {
		            ck = SequenceIndividual.C[ptrC] - SequenceIndividual.Tau2[ptrTau2];
		            energy += ck * ck;

		            if (energy > maxEnergy) {
		            	break;
		            }
		        }
			}
			else {
				var ptrTau, 
					ptrIEnd,
		        	i = 0;

		        for (; i < this.D; i++) {
		        	SequenceIndividual.CC[i] = SequenceIndividual.C[i];
		        }
		      
		        for (ptrC = 0, ptrTau = bit - 2, ptrIEnd = ptrC + (bit * 0.5) | 0;
		            ptrC < ptrIEnd;
		            ptrTau += (this.D - 2), ptrC++) {
		                SequenceIndividual.CC[ptrC] -= SequenceIndividual.Tau[ptrTau];
		            }

		        for (ptrC = 0, ptrIEnd = ptrC + this.D - bit - 2, ptrTau = bit;
		            ptrC < ptrIEnd;
		            ptrTau += this.D, ptrC++) {
		                SequenceIndividual.CC[ptrC] -= SequenceIndividual.Tau[ptrTau];
		                energy += SequenceIndividual.CC[ptrC] * SequenceIndividual.CC[ptrC];
		        }

		        if (this.L - 1 - bit != bit) {
		            i = this.D - 1 - bit;

		            for (ptrIEnd = i; ptrC < ptrIEnd; ptrC++) {
		                energy += SequenceIndividual.CC[ptrC] * SequenceIndividual.CC[ptrC];

		                if (energy > maxEnergy) {
		                	return energy;
		                }
		            }

		            for (ptrC = i, ptrIEnd = ptrC + (bit * 0.5) | 0, ptrTau = i * this.D + (bit - 2);
		                ptrC < ptrIEnd;
		                ptrTau += (this.D - 2), ptrC++){
		                    SequenceIndividual.CC[ptrC] -= SequenceIndividual.Tau[ptrTau];
		                    energy += SequenceIndividual.CC[ptrC] * SequenceIndividual.CC[ptrC];

		                    if (energy > maxEnergy) {
		                    	return energy;
		                    }
		            }
		        }

		        for (ptrIEnd = this.D - 1; ptrC < ptrIEnd; ptrC++){
		            energy += SequenceIndividual.CC[ptrC] * SequenceIndividual.CC[ptrC];

		            if (energy > maxEnergy) {
		            	return energy;
		            }
		        }
			}

			return energy;
		},
		flip: function (i, energy) {
			this.key ^= SequenceIndividual.rkey[i];
			//this.key = NumberHelper.bitXor(this.key, SequenceIndividual.rkey[i]);
			this.s[i] = -this.s[i];
			this.value = energy;
		},
		symmetry: function () {
			var symm = [],
				i = 0,
				j = 0;

			for (; i < 4; ++i) {
				symm.push(this);
			}

		    if(this.type != SequenceType.skew) {
		        for (i = 0; i < this.L; i++){
		            symm[1].s[i] = this.s[i] * -1;

		            if (i % 2 === 0) {
		            	symm[2].s[i] = this.s[i];
		            }
		            else {
		            	symm[2].s[i] = -this.s[i];
		            }

		            symm[3].s[i] = symm[2].s[i] * -1;

		        }

		        if (this.L % 2 === 0) {
		            for (i = 4; i < 8; i++) {
		             	symm.push(this);
		            }

		            for (i =0; i < this.L; i++) {
		                for (j = 0; j < 3; j++) {
		                	symm[j + 4].s[i] = symm[j].s[L - i - 1];
		                }

		                symm[7].s[i] = this.s[L - i - 1];
		            }
		        }
		    }
		    else{
		        var n = this.D - 1;

		        for (i = 1; i <= n; i++) {
		            var x = n - i;

		            symm[1].s[x] = this.s[x]*-1;

		            if (i % 2 === 0) {
		            	symm[2].s[x] = this.s[x];
		           	}
		           	else {
		           		symm[2].s[x] = -this.s[x];
		           	}

		            symm[3].s[x] = symm[2].s[x] * -1;
		        }

		        symm[2].s[n] = this.s[n];
		        symm[1].s[n] = symm[3].s[n] = -this.s[n];
		    }

		    for (i = 1; i < symm.length; i++){
		        symm[i].key = 0;

		        for (j = 0; j < this.D; j++){
		            if(symm[i].s[j] === 1) {
		            	symm[i].key ^= SequenceIndividual.rkey[j];
		            	//symm[i].key = NumberHelper.bitXor(symm[i].key, SequenceIndividual.rkey[j]);
		            }
		        }
		    }

		    return symm;
		}
	});

	SequenceIndividual.maxEnergies = bestKnownEnergies.length;
	SequenceIndividual.bestEnergy = bestKnownEnergies;

	SequenceIndividual.neighborhoodData = function (L, seed) {
		var D,
			rand = RandomNumberGenerator.createNew(seed);

		if(this.type == SequenceType.skew) {
			D = ((L + 1) / 2) | 0;
		}
		else {
			D = L;
		}

		SequenceIndividual.Tau = Helpers.fillArray(0, D * D);
		SequenceIndividual.C = Helpers.fillArray(0, D);
		SequenceIndividual.CC = Helpers.fillArray(0, D);
		SequenceIndividual.Tau2 = Helpers.fillArray(0, D * D);
		SequenceIndividual.rkey = Helpers.fillArray(0, D);
	

		for (var i = 0; i < D; i++) {
			SequenceIndividual.rkey[i] = rand.next();
		}
	};

	SequenceIndividual.getBestEnergy = function (L) { 
		if (L < SequenceIndividual.maxEnergies) {
			return SequenceIndividual.bestEnergy[L]; 
		}
		else {
			return 0; 
		}
	};

	return SequenceIndividual;
});