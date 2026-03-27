# symbolprose v0.7.0

_**tags:** s-expression, intermediate-representation, imperative-programming_

## about the project

**Imperative programming** is a programming paradigm of software that uses statements that change a program's state. Imperative programming focuses on describing how a program operates step by step rather than on high-level descriptions of its expected results.

An **S-expression** (Symbolic Expression) is a simple and uniform way of representing nested data or code using parentheses to denote lists and atoms, commonly used in Lisp programming and symbolic computation.

_**Symbolprose**_ is a S-expression based, imperative programming framework. Its main purpose is to serve as a compiling target for higher level programming languages. Symbolprose instruction control flow is inspired by finite state machines. The code in Symbolprose resembles a directed graph whose nodes represent checkpoints in program execution, while edges host variable accessing instructions.

## minimalistic approach

The entire grammar of Symbolprose code files fits into only nine lines of relaxed BNF code:

```
<start> := (GRAPH <element>+)

<element> := (EDGE (SOURCE <ATOMIC>) (INSTR <instruction>+)? (TARGET <ATOMIC>))
           | (COMPUTE (NAME <ATOMIC>) <start>)

<instruction> := (TEST <ANY> <ANY>)
               | (ASGN <ATOMIC> <ANY>)

<compute-call> := (RUN <ATOMIC> <ANY>)
```

Given these elements, in spite of being very minimalistic framework, Symbolprose is computationally complete.

## "Hello world!" example

To get a glimpse on how a Symbolprose program code looks like, we bring the "Hello world!" example:

```
(GRAPH
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT "Hello world!"))
        (TARGET END)))
```

## resources

There are a some resources about Symbolprose to check out:
- Explore code examples at [online playground](https://tearflake.github.io/symbolprose/playground/).
- Read the [Symbolprose specification](https://tearflake.github.io/symbolprose/docs/symbolprose).
- ...

## licensing

This software is released under [MIT license](LICENSE).

