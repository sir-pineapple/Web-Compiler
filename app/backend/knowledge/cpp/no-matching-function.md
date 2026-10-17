# C++ compiler error: no matching function

## Language
C++

## Category
Function overload and type errors

## Diagnostic
A C++ compiler may report `no matching function for call to` when none of the available function overloads accepts the supplied arguments.

## Example: incorrect code

```cpp
void printNumber(int value) {
    (void)value;
}

int main() {
    printNumber("hello");
    return 0;
}
```

The function expects an `int`, but the call supplies a string literal.

## Corrected code

```cpp
#include <iostream>

void printNumber(int value) {
    std::cout << value << '\n';
}

int main() {
    printNumber(42);
    return 0;
}
```

## Explanation
Overload resolution considers the available functions and whether the arguments can be converted to the required parameter types. If no viable overload exists, the call is rejected.

## Troubleshooting guidance
- Read the full diagnostic for the argument types and candidate functions.
- Compare each argument's type with the corresponding parameter type.
- Check whether the intended overload is declared and visible at the call site.
- Use an appropriate argument type or provide a suitable overload when the API requires one.
- Avoid adding casts until you understand why the types differ.