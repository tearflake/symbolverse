# symbolverse term rewriting framework v0.5.0

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
        (READ  (EXP (\add \A \0)))
        (WRITE (EXP \A          ))
    )
    
    /expression multiplication/
    (
        RULE
        (VAR A)
        (READ  (EXP (\mul \A \1)))
        (WRITE (EXP \A          ))
    )
)
```

By passing the input `(mul (add x 0) 1)` to this program code, the example outputs `x`.

## resources

There are a few resources about *Symbolverse* to check out:

- Explore code examples at [online playground](https://tearflake.github.io/proseverse/releases/2026-03-27/symbolverse/playground/).
- Read the [Symbolverse specification](https://tearflake.github.io/proseverse/releases/2026-03-27/symbolverse/docs/symbolverse).
- Follow the [installation instructions](https://tearflake.github.io/proseverse/releases/2026-03-27/symbolverse/docs/installation) (to-do: fix paths).

## licensing

This software is released under [MIT license](LICENSE).

