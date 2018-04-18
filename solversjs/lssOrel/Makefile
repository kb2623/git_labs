CXX=em++
UNAME:=$(shell uname -s)
DATE:=$(shell date '+%d_%m_%G')
RAND:=$(shell /bin/bash -c "echo $$RANDOM")
DIR:=$(DATE)_$(RAND)
VERSION=004
NAME=lssOrel
BIN=$(NAME)

ifndef MAX_L
	MAX_L=512
endif

CXXFLAGS=-std=c++0x -DMAX_L=$(MAX_L) -DNAME='\"$(NAME)\"' -DVERSION='\"$(VERSION)\"'
EMFLAGS=-s VERBOSE=1 -s ASSERTIONS=1
EMFLAGSWASM=$(EMFLAGS) -s WASM=1
EMFLAGSJS=$(EMFLAGS) -s WASM=0
BINDCPPJS=--bind -DBINDCPPJS

ifeq ($(SSE4.2),true)
	CXXFLAGS:=$(CXXFLAGS) -msse4.2
endif

ifeq ($(M32),true)
	CXXFLAGS:=$(CXXFLAGS) -m32
	BIN:=$(NAME).32bit
endif

ifeq ($(M64),true)
	CXXFLAGS:=$(CXXFLAGS) -m64
endif

OBJ=sequence.o saw.o main.o

all:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -g0 -O3"

wasmall:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -g0 -O3"

jsall:
	make $(BIN) CXXFLAGS="$(EMFLAGSJS) $(CXXFLAGS) -DNDEBUG -g0 -O3"

cpp2jswasm:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(BINDCPPJS) $(CXXFLAGS) -DNDEBUG -g0 -O3"

cpp2jsjs:
	make $(BIN) CXXFLAGS="$(EMFLAGSJS) $(BINDCPPJS) $(CXXFLAGS) -DNDEBUG -g0 -O3"

debug:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -g3"

profile:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -pg -O3"

profile2:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -fprofile-arcs -ftest-coverage"

$(BIN): $(OBJ) *.h
	$(CXX) $(EMFLAGSWASM) $(CXXFLAGS) $(LDFLAGS) $(OBJ) -o $(BIN).html

$(BIN)B: $(OBJ) *.h
	$(CXX) $(EMFLAGSWASM) $(CXXFLAGS) $(LDFLAGS) $(OBJ) -o $(BIN)B

%.o : %.cpp *.h
	$(CXX) $(EMFLAGSWASM) $(CXXFLAGS) $< -o $@

clean:
	rm -f *.o $(BIN) *.gcda *.gcno *.gcov lssOrel.so 
	rm -f *.gch *.js *.html *.wasm

