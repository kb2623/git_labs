############################################ COMPILE #############################################

$ make clean
$ make

###################################################################################################

$ bin/lMAts

usage: bin/lMAts <binary seq length> <random seed> <max time (secs)> <no. of threads> <valueTarget>

note1: The last argument is optional. If no <valueTarget> is specified,
        the "best known value", stored internally, will be accessed.
note2: This program stops either
        if runtime   >= <max time (secs)> or
        if valueBest <= <valueTarget>

Copyright 2012
*  José E. Gallardo, Carlos Cotta, and Antonio J. Fernández
*  Finding Low Autocorrelation Binary Sequences with Memetic Algorithms.
*  Applied Soft Computing. 9(4): 1252-1262 (2009).
*  ---------------------------------------------------------------------
*  Original source code was modified /instrumented for testing by Borko Boskovic.

#############################################################################################################33

$ bin/lRRts

usage: bin/lRRts <binary seq length> <random seed> <max time (secs)> <no. of threads> <valueTarget>

note1: The last argument is optional. If no <valueTarget> is specified,
        the "best known value", stored internally, will be accessed.
note2: This program stops either
        if runtime   >= <max time (secs)> or
        if valueBest <= <valueTarget>

Copyright 2012
*  José E. Gallardo, Carlos Cotta, and Antonio J. Fernández
*  Finding Low Autocorrelation Binary Sequences with Memetic Algorithms.
*  Applied Soft Computing. 9(4): 1252-1262 (2009).
*  ---------------------------------------------------------------------
*  Original source code was modified /instrumented for testing by Borko Boskovic.
