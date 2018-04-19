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
EMFLAGS=-s VERBOSE=1 -s ASSERTIONS=1 -s DEMANGLE_SUPPORT=1
EMFLAGSWASM=$(EMFLAGS) -s WASM=1 -s BINARYEN_METHOD=\'native-wasm\'
EMFLAGSJS=$(EMFLAGS) -s WASM=0 -s BINARYEN_METHOD=\'asmjs\'
BINDCPPJS=--bind -DBINDCPPJS

OBJ=sequence.o saw.o main.o

all: wasmb

wasmb:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -g0 -O3"

wasmrun:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) --emrun $(CXXFLAGS) -DNDEBUG -g0 -O3"

jsb:
	make $(BIN) CXXFLAGS="$(EMFLAGSJS) $(CXXFLAGS) -DNDEBUG -g0 -O3"

jsrun:
	make $(BIN) CXXFLAGS="$(EMFLAGSJS) --emrun $(CXXFLAGS) -DNDEBUG -g0 -O3"

wasmb_cpp2js:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(BINDCPPJS) $(CXXFLAGS) -DNDEBUG -g0 -O3"

jsb_cpp2js:
	make $(BIN) CXXFLAGS="$(EMFLAGSJS) $(BINDCPPJS) $(CXXFLAGS) -DNDEBUG -g0 -O3"

debug:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -g3"

profile:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -pg -O3"

profile2:
	make $(BIN) CXXFLAGS="$(EMFLAGSWASM) $(CXXFLAGS) -DNDEBUG -fprofile-arcs -ftest-coverage"

$(BIN): $(OBJ) *.h
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $(OBJ) -o $(BIN).html

$(BIN)B: $(OBJ) *.h
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $(OBJ) -o $(BIN)B

%.o : %.cpp *.h
	$(CXX) $(CXXFLAGS) $< -o $@

run:
	emrun --no_browser --port 8800 $(BIN).html

allrun: all run

clean:
	rm -f *.o $(BIN) *.gcda *.gcno *.gcov lssOrel.so 
	rm -f *.gch *.js *.html *.wasm **.mem

