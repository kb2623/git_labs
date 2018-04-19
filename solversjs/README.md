# JavaScrip WebAssembly
## Namesti programe
* [binaryen](https://github.com/WebAssembly/binaryen)
* [emscripten](https://github.com/kripken/emscripten)

## BINARYEN
[Help](https://github.com/kripken/emscripten/wiki/WebAssembly)

## PTHREADS
[pthreads](https://github.com/kripken/emscripten/wiki/Pthreads-with-WebAssembly)

## JavaScrip C++ bindings
Original [embind](https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/embind.html).
 The binding block defines a chain of member function calls on the temporary class_ object (this same style is used in Boost.Python). The functions register the class, its constructor(), member function(), class_function() (static) and property().

### Example:
```
// Class in C++
class MyClass {
public:
	MyClass(int x, std::string y) : x(x), y(y) {}
	void incrementX() { ++x; }
	int getX() const { return x; }
	void setX(int x_) { x = x_; }
	static std::string getStringFromInstance(const MyClass& instance) { return instance.y; }
private:
	int x;
	std::string y;
};
```

### Binding code
```
EMSCRIPTEN_BINDINGS(my_class_example) {
	class_<MyClass>("MyClass")
		.constructor<int, std::string>()
		.function("incrementX", &MyClass::incrementX)
		.property("x", &MyClass::getX, &MyClass::setX)
		.class_function("getStringFromInstance", &MyClass::getStringFromInstance)
	;
}
````

### Usage in JavaScript:
```
var instance = new Module.MyClass(10, "hello");
instance.incrementX();
instance.x; // 11
instance.x = 20; // 20
Module.MyClass.getStringFromInstance(instance); // "hello"
instance.delete();
```
