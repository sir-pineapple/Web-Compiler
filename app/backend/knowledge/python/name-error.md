# Python runtime error: NameError

## Language
Python

## Category
Name and scope errors

## Diagnostic
Python may raise `NameError: name 'variable_name' is not defined` when code refers to a name that cannot be resolved in the current execution context.

## Example: incorrect code

```python
print(total)
```

If `total` has not been defined, Python raises a `NameError`.

## Corrected code

```python
total = 42
print(total)
```

## Explanation
Python resolves names at runtime. A name must be defined or otherwise made available in the relevant scope before it can be used.

## Troubleshooting guidance
- Check the spelling and capitalization of the name.
- Confirm that the assignment or definition executes before the reference.
- Check whether the name is local, global, or imported from another module.
- Verify that a conditional branch or earlier function call actually creates the name.
- Distinguish `NameError` from `AttributeError`, which occurs when an object lacks an expected attribute.