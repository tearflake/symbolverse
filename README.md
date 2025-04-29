# symbolverse term rewriting framework v0.3.9

_**tags:** s-expression, rewriting, term-rewriting, term-rewriting-systems_

## about the project

A **term rewriting system** is a tool for automating the transformation of expressions, enabling problem-solving in areas like formal verification, symbolic computation, and programming. By applying systematic rules, it ensures consistent and correct results in optimizing code, proving theorems, and simplifying complex expressions.

An **S-expression** (Symbolic Expression) is a simple and uniform way of representing nested data or code using parentheses to denote lists and atoms, commonly used in Lisp programming and symbolic computation.

_**Symbolverse**_ is a symbolic, rule-based programming framework built around pattern matching and term rewriting. It uses a Lisp-like syntax with S-expressions and transforms input expressions through a series of rewrite rules. Variables, scoping, and escaping mechanisms allow control over pattern matching and abstraction. With support for chaining, nested rule scopes, sub-structural operations, and modular imports, Symbolverse is well-suited for declarative data transformation and symbolic reasoning tasks.

## minimalistic approach

The entire grammar of *Symbolverse* code files fits into only five lines of relaxed BNF code:

```
     <start> := (REWRITE <expression>+)
              | (FILE <ATOMIC>)

<expression> := (RULE (VAR <ATOMIC>+)? (READ (EXP <ANY>)) (WRITE (EXP <ANY>)))
              | <start>
```

and there are only six builtin functions used only for sub-structural transformations:

```
(CONSL <ANY> <ANY>)       -> <RESULT>
(HEADL <ANY>)             -> <RESULT>
(TAILL <ANY>)             -> <RESULT>
(CONSA <ATOMIC> <ATOMIC>) -> <RESULT>
(HEADA <ATOMIC>)          -> <RESULT>
(TAILA <ATOMIC>)          -> <RESULT>
```

Given these elements, in spite of being very minimalistic framework, *Symbolverse* is computationally complete, witnessing the Turing completeness. However, while it is possible to use *Symbolverse* for any abstract programming task, it is best suited for data transformation and symbolic reasoning.

## example program code

To get a glimpse on how a *Symbolverse* program code looks like, we bring a simple example:

```
(
    REWRITE
    
    /expression addition/
    (
        RULE
        (VAR A)
        (READ  (EXP (\add \A \A)))
        (WRITE (EXP (\mul \2 \A)))
    )
    
    /reducible fraction/
    (
        RULE
        (VAR A B)
        (READ  (EXP (\div (\mul \A \B) \A)))
        (WRITE (EXP \B                    ))
    )
    (
        RULE
        (VAR A B)
        (READ  (EXP (\div (\mul \A \B) \B)))
        (WRITE (EXP \A                    ))
    )
)
```

By passing the input `(div (add x x) 2)` to this program code, the example outputs `x`. Also, by passing the input `(div (add x x) x)`, the example outputs `2`.

## resources

There are a few resources about *Symbolverse* to check out:

- Explore code examples at [online playground](https://tearflake.github.io/symbolverse/playground/).
- Read the [Symbolverse specification](https://tearflake.github.io/symbolverse/docs/symbolverse).
- Follow the [installation instructions](https://tearflake.github.io/symbolverse/docs/installation).

## licensing

This software is released under [MIT license](LICENSE).

