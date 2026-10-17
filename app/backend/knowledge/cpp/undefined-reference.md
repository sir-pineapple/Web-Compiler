# C++ linker error: undefined reference

## Language
C++

## Category
Linker errors

## Diagnostic
A linker may report `undefined reference to 'function_name'` when code calls a function whose definition cannot be found during linking. Compilation of an individual source file may succeed even though the final executable cannot be linked.

## Example: incorrect code

`main.cpp`
```cpp
int add(int, int);

int main() {
    return add(2, 3);
}
```

The declaration tells the compiler that `add` exists, but no definition is provided to the linker.

## Corrected code

`main.cpp`
```cpp
int add(int, int);

int main() {
    return add(2, 3);
}
```

`add.cpp`
```cpp
int add(int a, int b) {
    return a + b;
}
```

Compile and link both source files:

```bash
g++ main.cpp add.cpp -o app
```

## Explanation
A function declaration provides its interface but does not provide its implementation. The definition must be linked into the final executable.

## Troubleshooting guidance
- Check that the function has a definition with a matching name, parameter types, and namespace.
- Make sure the source file containing the definition is included in the compilation and linking command.
- Check that the definition is not excluded by conditional compilation.
- When linking libraries, verify that the required library is supplied to the linker.
- Distinguish linker errors from compiler errors: `undefined reference` commonly appears during linking, not syntax analysis.