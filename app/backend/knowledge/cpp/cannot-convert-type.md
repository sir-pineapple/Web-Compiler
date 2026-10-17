# C++ compiler error: cannot convert type

## Language
C++

## Category
Type conversion errors

## Diagnostic
A C++ compiler may report `cannot convert` or `cannot convert 'source_type' to 'target_type'` when an expression cannot be used where another type is required.

## Example: incorrect code

```cpp
int main() {
    int count = "42";
    return count;
}
```

A string literal cannot be implicitly converted to an integer in this initialization.

## Corrected code

```cpp
#include <string>

int main() {
    std::string input = "42";
    int count = std::stoi(input);
    return count;
}
```

## Explanation
C++ enforces type compatibility during initialization, assignment, and function calls. Converting textual digits into a number requires parsing rather than treating the text as an integer value.

## Troubleshooting guidance
- Read the diagnostic to identify the source and destination types.
- Check whether the expression is a string, pointer, reference, or numeric value.
- Use an appropriate conversion function when parsing text.
- Validate input and handle conversion failures when values may not contain valid numbers.
- Do not assume a cast makes an invalid conversion safe.