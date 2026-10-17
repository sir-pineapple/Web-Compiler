# Java compiler error: cannot find symbol

## Language
Java

## Category
Symbol resolution errors

## Diagnostic
The Java compiler may report `cannot find symbol` when a referenced variable, method, or class cannot be resolved in the current scope or compilation context.

## Example: incorrect code

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(message);
    }
}
```

The variable `message` has not been declared.

## Corrected code

```java
public class Main {
    public static void main(String[] args) {
        String message = "Hello";
        System.out.println(message);
    }
}
```

## Explanation
Java resolves names during compilation. A referenced symbol must be declared, visible in the relevant scope, and available through the required imports or classpath.

## Troubleshooting guidance
- Read the diagnostic's symbol name and location.
- Check spelling and capitalization.
- Verify that the variable or method is declared in the correct scope.
- Check imports, package names, and classpath configuration when referencing external types.
- Confirm that the method call matches a declared method signature.