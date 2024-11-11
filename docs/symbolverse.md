---
title: false
---

```
// work in progress //
```

# Symbolverse specification

> **[about document]**  
> Introduction to *Symbolverse* term rewriting system
>
> **[intended audience]**  
> Advanced programmers and beginners in term rewriting
> 
> **[Short description]**  
> Symbolverse is a term rewriting system operating on S-expressions. It defines transformations on symbolic expressions by applying a set of rewriting rules to terms represented as S-expressions, which are tree-like structures of atoms or nested lists. These rules match patterns within the S-expressions and systematically replace them with new expressions, enabling recursive transformations. Such formal systems are widely used in symbolic computation, program transformation, and automated reasoning, offering a flexible method for expressing and analyzing transformations in structured symbolic data.

## table of contents

- [1. introduction](#1-introduction)  
- [2. theoretical background](#2-theoretical-background)  
    - [2.1. syntax](#21-syntax)  
    - [2.2. semantics](#22-semantics)  
        - [2.2.1. terms](#221-terms)  
        - [2.2.2. rewrite rules](#222-rewrite-rules)  
- [3. practical examples](#3-practical examples)  
- [4. conclusion](#3-conclusion)  

## 1. introduction

Term rewriting is a formal method used to systematically transform expressions or terms based on a set of rules. A term consists of symbols and variables arranged in a structured way, often represented as trees. Rewriting rules define how certain patterns in these terms can be replaced with other terms. The process typically involves pattern matching, where parts of a term are identified and replaced according to predefined rules, allowing terms to evolve into new forms. This transformation continues until a term reaches its final form, known as the normal form, where no further rules can be applied. Term rewriting is widely used in areas such as symbolic computation, automated theorem proving, algebraic data manipulation, and program optimization, providing a powerful tool for reasoning about and transforming structured data.

Using S-expressions as terms in a term rewriting system provides a simple and effective way to represent and manipulate symbolic expressions. S-expressions, with their uniform, tree-like structure of nested lists and atoms, naturally align with the hierarchical nature of terms in rewriting systems. This structure makes it easy to parse and apply rewriting rules, where patterns within the S-expressions can be matched and transformed according to specified rules.

Symbolverse is a term rewriting system that operates on S-expressions. Its main strength is in its simplicity while not compromising all the benefits of term rewriting. Its very simple syntax and semantics ensure a gradual learning curve where users are able to grasp the essence of term rewriting in a short time. However, further exploration of terms bound in rules may unleash a power granted by being a Turing complete system capable of computations of any complexity.

## 2. theoretical background

Term rewriting is a formal method used in computer science and mathematical logic to systematically transform expressions, or "terms," into other terms based on a set of predefined rules. It's a fundamental technique in areas such as automated theorem proving, symbolic computation, formal verification, and programming language semantics.

A term is a symbolic expression constructed from variables, constants, and function symbols. For example, `(f a x)` is a term where `f` is a function symbol, `a` is a constant, and `x` is a variable. Terms can be simple, like variables (`x`), or complex, involving nested function applications (`(f (g x) y)`).

A rewrite rule is typically written as `l -> r`, where `l` (left-hand side) and `r` (right-hand side) are terms. The rule states that whenever a term matches the pattern `l`, it can be replaced by `r`. Applying a rewrite rule involves finding a subterm in an expression that matches the pattern `l` and then replacing it with `r`. For example, using the rule  `(f x) -> x`, the term `(f a)` would be rewritten to `a`.

The act of applying rewrite rules to a term is called reduction. Repeated application of rules can reduce a term to a simpler form or a specific target form. A term is in normal form if no further rewrite rules can be applied to it. A term rewriting system is confluent if, whenever a term can be reduced in different ways (i.e., by applying different rules in different orders), all paths eventually lead to the same result. Confluence ensures that the final result is unique, regardless of the sequence of rule applications. A rewriting system is terminating if every sequence of rewrite steps eventually ends in a normal form, meaning the process doesn't go on indefinitely.

Term rewriting is a formal method for transforming expressions based on a set of predefined rules. Key concepts include terms, rewrite rules, reduction, confluence, and termination.

### 2.1. syntax

In computer science, the syntax of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language. *Symbolverse* language itself resembles a kind of S-expression. S-expressions consist of lists of atoms or other S-expressions where lists are surrounded by parenthesis. In *Symbolverse*, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of Backus-Naur form syntax rules:

```
         <start> := (REWRITE <expression>+)
    
    <expression> := <start>
                  | (RULE (VAR <ATOMIC>+)? (READ (EXP <ANY>)) (WRITE (EXP <ANY>)))
```

The above grammar defines the syntax of *Symbolverse*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Symbolverse* language.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//`, and reach to the end of line. Multiline comments begin with `/*` and end with `*/`, so that everything in between is considered as a comment.

### 2.2. semantics

Semantics is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expressions. To know what an expression means, it is enough to know how it translates to a form that is already understood by a target environment. In this section, we are dealing with the intuitive semantics of *Symbolverse*. Semantics of *Symbolverse* will be explained using various simplistic examples and defining what inputs and outputs the examples accept and generate.

#### 2.2.1. terms

S-expressions (Symbolic Expressions) are a fundamental concept in computer science and programming language theory. S-expressions are a simple, yet powerful notation for representing nested list data structures and code in a parenthesized form. They are commonly associated with the Lisp family of programming languages, where they serve both as a way to represent code and data uniformly.

The general form of an S-expression is either:

- An atom (e.g., `atom`), or
- A list of S-expressions (e.g., `(expr1 expr2 expr3)`).

Lists can be nested, allowing for the representation of complex hierarchical structures. For example:

`(eq (pow x 2) (mul x x))`

This S-expression represents equality between square and multiplication.

One of the most distinctive features of S-expressions is their uniform representation of code and data. In *Symbolverse*, code itself is written as S-expression, which means that programs can easily manipulate other programs as data, enabling powerful metaprogramming capabilities. S-expressions are a versatile and uniform notation for representing both code and data in a nested, list-based structure. Their simplicity and power make them a core feature of *Symbolverse*, facilitating symbolic computation, metaprogramming, and easy manipulation of hierarchical data structures.

Terms in *Symbolverse* are represented by S-expressions, and are written in `(EXP ...)` pattern. Let's take a look at couple of examples stating terms:

```
(EXP (hello world))
```

This example describes the term `(hello world)`.

The next example consists of only one atom:

```
(EXP "hello world")
```

The atom `hello world` is enclosed within quotes. Quoted atoms are interpreted as standard unicode strings, and we use them if we want to include special characters that have meaning in *Symbolverse* grammar syntax. The special characters are: `(`, `)`, ` `, `"`, `\`, `/*`, `*/` and `//`.

Although a great part of S-expressions power lies in its simplicity, let's introduce a couple of extensions in a hope of making expressed code more readable and functional, namely: strings and comments.

##### strings

Strings in *Sexpression* may be single-line or multi-line. Single-line strings are atoms enclosed within `"..."`, like in expression `"this is a single-line string"`, and represent Unicode format strings. Multi-line strings are enclosed between an odd number greater than 1 of `"` symbols in the following manner:

```
"""
this is a
multi-line
string
"""
```

Multi-line strings are indent sensitive.

##### comments

Comment expressions are ignored by the system, and they serve as notes to help programmers reading their code. They are parsed just like strings, only using the `/` instead of the `"` symbol. Thus, a single-line comment may be written as `/this is a single-line comment/`, and may appear repeatedly wherever a whitespace is expected. They can also be spanned over multiple lines, and an example of a multi-line comment may be:

```
///
this is a
multi-line
comment
///
```

Multi-line comments are also indent sensitive, just like strings.

#### 2.2.2. rewrite rules

A term rewrite rule is a directive in a formal system that specifies how to transform one term into another by matching a pattern (the left hand side) and replacing it with a new term (the right hand side). These rules are used to systematically manipulate and simplify expressions. The effectiveness and behavior of a set of rewrite rules depends on properties like confluence and termination, which determine the consistency and completeness of the rewriting process.

A system of term rewrite rules in *Symbolverse* is written in the following pattern:

```
(
    REWRITE
    
    <rule-1>
    <rule-2>
    ...
    <rule-N>
)
```

where each rule follows the pattern:

```
(RULE (READ ...) (WRITE ...))
```

There are also rules involving variables, which follow the pattern:

```
(RULE (VAR ...) (READ ...) (WRITE ...))
```

The left hand side of the rules is enclosed within `(READ ...)` section while the right hand side is enclosed within `(WRITE ...)` section.

##### single rules

The next example:

```
/*
    hello world example
    
     input: `(hello machine)`
    output: `(hello world)`
*/

(
    REWRITE

    (RULE (READ (EXP (\hello \machine))) (WRITE (EXP (\hello \world))))
)
```

reads `(hello machine)` from input, and outputs `(hello world)` instead of input. The rule also reaches arbitrary depth, so that input `(lft (hello machine) rgt)` turns into `(lft (hello world) rgt)`. Escape character `\` is used to denote terminal atoms (more about this later). By convention, we write constant atoms with lowercase first letter, but this is not necessary. 

The next example uses variables:

```
/*
    hello entity example
    
     input: `(greet Name)`
    output: `(hello Name)`
*/

(
    REWRITE

    (RULE (VAR Name) (READ (EXP (\greet \Name))) (WRITE (EXP (\hello \Name))))
)
```

In our case, variable name is `Name`. By convention, we write variables with uppercase first letter, but this is not necessary. When we pass `(greet human)` as input to this example, we get `(hello human)` as an output.

##### set of rules

Naturally, we can also have a set of rules defining the rewriting process. Thus, the next example:

```
/*
    toy making decision
    
     input: `(isGood girl/boy)`
    output: `(makeToy doll/car)`
*/

(
    REWRITE

    (RULE (READ (EXP (\isGood \girl))) (WRITE (EXP (\makeToy \doll))))
    (RULE (READ (EXP (\isGood \boy) )) (WRITE (EXP (\makeToy \car) )))
)
```

can in one case change `(isGood girl)` into `(makeToy doll)`, or in another `(isGood boy)` into `(makeToy car)`.

As an example of set of rules utilizing variables, we can consider:

```
/*
    job title decision
    
     input: `(isDoing Name drivingRocket/healingPeople)`
    output: `(isTitled Name astronaut/doctor)`
*/

(
    REWRITE

    (
        RULE
        (VAR Name)
        (READ (EXP (\isDoing \Name \drivingRocket)))
        (WRITE (EXP (\isTitled \Name \astronaut)))
    )
    (
        RULE
        (VAR Name)
        (READ (EXP (\isDoing \Name \healingPeople)))
        (WRITE (EXP (\isTitled \Name \doctor)))
    )
)
```

so that passing `(isDoing Jane drivingRocket)` as an input gets us the expression `(isTitled Jane astronaut)` as an output.

##### chaining rules

We can also repeatedly chain rules one onto another, from its right hand side to its left hand side.

```
/*
    shadows decision
    
     input: `(sunIs rising/falling)`
    output: `(shadowsDo expand/shrink)`
*/

(
    REWRITE

    (RULE (READ (EXP (\sunIs \rising) )) (WRITE (EXP (itIs morning)  )))
    (RULE (READ (EXP (\sunIs \falling))) (WRITE (EXP (itIs afternoon))))

    (RULE (READ (EXP (itIs morning)  )) (WRITE (EXP (shadowsLean west))))
    (RULE (READ (EXP (itIs afternoon))) (WRITE (EXP (shadowsLean east))))

    (RULE (READ (EXP (shadowsLean west))) (WRITE (EXP (\shadowsDo \shrink))))
    (RULE (READ (EXP (shadowsLean east))) (WRITE (EXP (\shadowsDo \expand))))
)
```

Thus, passing an input `(sunIs rising)` finally gets us an output `(shadowsDo shrink)` while passing an input `(sun is falling)` finally gets us an output `(shadowsDo expand)`. Rules automatically chain one onto another where their terms match.

Note the use of atoms without the escape `\` character. These atoms are used for internal computations, and do not refer to the outer world. These are called non-terminals. Since all terminals are required to be escaped with `\`, when we pass an input like `(itIs morning)`, it gets ignored by this ruleset. This grounds a basis for hiding internal code implementation from the input scope reach.

The similar chaining example, but with variables would be:

```
/*
    weighting decision
    
     input: `(orbitsAround object1 object2)`
    output: `(weigthtsMoreThan object2 object1)`
*/

(
    REWRITE

    (
        RULE
        (VAR P1 P2)
        (READ (EXP (\orbitsAround \P1 \P2)))
        (WRITE (EXP (attractsMoreThan P2 P1)))
    )
    (
        RULE
        (VAR P1 P2)
        (READ (EXP (attractsMoreThan P1 P2)))
        (WRITE (EXP (\weightsMoreThan \P1 \P2)))
    )
)
```

so that when we pass `(orbitsAround earth sun)`, we get `(weightsMoreThan sun earth)`. Again, if an input is `(attractsMoreThan sun earth)`, it remains unchanged. Note how we unescaped variables `P1` and `P2` in the first rule, and escaped them back in the second one.

##### scoped rules

With *Symbolverse*, it is possible or write layered code where each layer represents a certain depth of abstraction area. The objective of these layers is separating atoms and variables so we can use them as private entities not interacting between adjacent layers. New layers are denoted within `(REWRITE ...)` sections, and can be nested. Consider the following example:

```
(
    REWRITE
    
    /entry point/
    (RULE (VAR Fruit) (READ (EXP (\plantSeed \Fruit))) (WRITE (EXP (plantSeed Fruit))))
    
    /exit point/
    (RULE (VAR Fruit) (READ (EXP (fruitGrows Fruit))) (WRITE (EXP (\fruitGrows \Fruit))))
    
    (
        REWRITE
        
        (RULE (VAR Fruit) (READ (EXP (\plantSeed \Fruit)   )) (WRITE (EXP (treeForms Fruit)     )))
        (RULE (VAR Fruit) (READ (EXP (treeForms Fruit)     )) (WRITE (EXP (blooms Fruit)        )))
        (RULE (VAR Fruit) (READ (EXP (blooms Fruit)        )) (WRITE (EXP (getsPollinated Fruit))))
        (RULE (VAR Fruit) (READ (EXP (getsPollinated Fruit))) (WRITE (EXP (\fruitGrows \Fruit)  )))
    )
)
```

Here, in the first level, we used two rules only to pass the information down to and up from nested scope. Next, in the nested `(REWRITE ...)` section, we created a separate scope which represents a chained actions between seeding a plant and growing a fruit. To reach atoms and variables from the outer layers, we have to escape them with `\` character, like in `(READ (EXP (\plantSeed \Fruit)))` section. Similarly, atoms and variables created within that scope are not visible outside of that scope unless they are escaped with `\` character, like in `(WRITE (EXP (\fruitGrows \Fruit)))` section. It is also possible to reach more distant outer scopes by repeating a number of `\` characters where the number of repetitions denotes the depth difference to the parent scope we are referring to. Without escaping, it is not possible to refer to adjacent scopes or their children atoms and variables. Thus, without escaping, we are using scopes as private areas where their atoms and variables may interact.

Scopes represent a natural way to package and separate sets of rules where only escaped atoms and variables are exposed to the outer world. Unescaped atoms and variables are considered private members of scopes where they are defined and used.

---

In this section, we learned how to write syntactically correct rules, how to use variables, how to apply a set of rules, and how to chain rules one onto another. Along with a help of scopes using atom and variable escaping system to keep certain rules out of unwanted interfering with other rules, we get a fully functional Turing complete term rewriting platform.

## 3. practical examples

We assembled a number of practical examples covering programming examples (boolean operations, binary number arithmetic and comparison, operations on lists) and abstraction examples (lambda calculus, sequent calculus). These examples are covered in source code files in `examples/` directory. All the examples are paired with their example input, and can be performed from command line using *Symbolverse* executable.

## 4. conclusion

If properly performed, there could be numerous kinds of uses of the *Symbolverse* system. One use may be in editing input in sessions that produce some mathematical, logical, or other kinds of computations, while looping back to editing sessions until we are satisfied with the output. Some other, maybe industrial use may involve compiling a program source code to some assembly target code. In other situations, it is also included that we could form a personal, classical business, or even scientific knowledge base with relational algebra rules, so we can navigate, search, and extract wanted information. Ultimately, data from the knowledge base could mutually interact using on-demand learned inference rules, thus developing the entire logical reasoning system ready to draw complex decisions on general system behavior. And this partial sketch of possible uses is just a tip of the iceberg because with a kind of system like *Symbolverse*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.

```
// work in progress //
```

