
# C++ compiler error: expected semicolon

## Language
C++

## Category
Syntax errors

## Diagnostic
A compiler may report an error such as `expected ';' before ...` when a statement or declaration is missing a required semicolon.

## Example: incorrect code

```cpp
#include <iostream>

int main() {
    int count = 5
    std::cout << count << '\n';
    return 0;
}
```

## Corrected code

```cpp
#include <iostream>

int main() {
    int count = 5;
    std::cout << count << '\n';
    return 0;
}
```

## Explanation
In C++, a declaration such as `int count = 5;` must end with a semicolon. Without it, the compiler may report the error at the next token rather than at the actual omission.

## Troubleshooting guidance
Inspect the statement immediately before the reported location. Check for missing semicolons, unmatched parentheses or braces, and other syntax errors that can cause cascading diagnostics.
