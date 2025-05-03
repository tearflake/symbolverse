# Symbolverse Specification

> **[about document]**  
> Introduction to *Symbolverse* term rewriting framework operating on S-expressions
>
> **[intended audience]**  
> Advanced users in term rewriting
> 
> **[abstract]**  
> ... Symbolverse aims to be a minimalistic term rewriting system defined by very simple S-expression based syntax and semantics. It partially inherits its simplicity from operating on S-expressions, embracing them within only necessary rule components. In spite of the minimalistic rule appearance, all the benefits of term rewriting remain uncompromised in creating Symbolverse code. Such appearance empowers the programmer with a choice to introduce terms as simple or as complex as needed. This is corroborated by a gradual learning curve more focused on created content than on the underlying defining system. With further exploration of terms bound within rules, one may utilize various degrees of expressiveness driven by a computationally complete foundations...

## table of contents

- [1. introduction](#1-introduction)  
- [2. theoretical background](#2-theoretical-background)  
    - [2.1. syntax](#21-syntax)  
    - [2.2. semantics](#22-semantics)  
- [3. tutorial examples](#3-tutorial-examples)  
- [4. conclusion](#4-conclusion)  

## 1. introduction

Term rewriting is a formal method used to systematically transform expressions or terms based on a set of rules. A term consists of symbols and variables arranged in a structured way, often represented as trees. Rewriting rules define how certain patterns in these terms can be replaced with other terms. The process typically involves pattern matching, where parts of a term are identified and replaced according to predefined rules, allowing terms to evolve into new forms. This transformation continues until a term reaches its final form, known as the normal form, where no further rules can be applied. Term rewriting is widely used in areas such as symbolic computation, automated theorem proving, algebraic data manipulation, and program optimization, providing a tool for reasoning about and transforming structured data.

Using S-expressions as terms in a term rewriting system provides a simple and effective way to represent and manipulate expressions. S-expressions, with their uniform, tree-like structure of nested lists and atoms, naturally align with the hierarchical nature of terms in rewriting systems. This structure makes it easy to parse and apply rewriting rules, where patterns within the S-expressions can be matched and transformed according to specified rules.

*Symbolverse* aims to be a minimalistic term rewriting system defined by very simple S-expression based syntax and semantics. It partially inherits its simplicity from operating on S-expressions, embracing them within only necessary rule components. In spite of the minimalistic rule appearance, all the benefits of term rewriting remain uncompromised in creating Symbolverse code. Such appearance empowers the programmer with a choice to introduce terms as simple or as complex as needed. This is corroborated by a gradual learning curve more focused on created content than on the underlying defining system. With further exploration of terms bound within rules, one may utilize various degrees of expressiveness driven by a computationally complete foundations.

## 2. theoretical background

Terms in Symbolverse are formed by S-expressions. S-expressions (Symbolic Expressions) are a fundamental concept in computer science and programming language theory. S-expressions are a simple, yet powerful notation for representing nested list data structures and code in a parenthesized form. They are commonly associated with the Lisp family of programming languages, where they serve both as a way to represent code and data uniformly.

The general form of an S-expression is either:

- An atom (e.g., `atom`), or
- A list of S-expressions (e.g., `(expr1 expr2 expr3 ...)`).

Lists can be nested, allowing for the representation of complex hierarchical structures.

Term rewriting is a formal method used in computer science and mathematical logic to systematically transform expressions, or "terms," into other terms based on a set of predefined rules. It's a fundamental technique in areas such as automated theorem proving, symbolic computation, formal verification, and programming language semantics.

A term is a symbolic expression constructed from variables, constants, and function symbols. For example, `(f a x)` is a term where `f` is a function symbol, `a` is a constant, and `x` is a variable. Terms can be simple, like variables (`x`), or complex, involving nested function applications (`(f (g x) y)`).

A rewrite rule is typically written as `l -> r`, where `l` (left-hand side) and `r` (right-hand side) are terms. The rule states that whenever a term matches the pattern `l`, it can be replaced by `r`. Applying a rewrite rule involves finding a subterm in an expression that matches the pattern `l` and then replacing it with `r`. For example, using the rule  `(f x) -> x`, the term `(f a)` would be rewritten to `a`.

The act of applying rewrite rules to a term is called reduction. Repeated application of rules can reduce a term to a simpler form or a specific target form. A term is in normal form if no further rewrite rules can be applied to it. A term rewriting system is confluent if, whenever a term can be reduced in different ways (i.e., by applying different rules in different orders), all paths eventually lead to the same result. Confluence ensures that the final result is unique, regardless of the sequence of rule applications. A rewriting system is terminating if every sequence of rewrite steps eventually ends in a normal form, meaning the process doesn't go on indefinitely.

### 2.1. syntax

In computer science, the syntax of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language. Symbolverse language itself resembles a kind of S-expression. S-expressions consist of lists of atoms or other S-expressions where lists are surrounded by parenthesis. In Symbolverse, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of Backus-Naur form syntax rules:

```
         <start> := (RULESET <expression>+)
    <expression> := (RULE (VAR <ATOMIC>+)? (READ (EXP <ANY>)) (WRITE (EXP <ANY>)))
```

The above grammar defines the syntax of *Symbolverse*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Symbolverse* language.

As an intertwined part of the above grammar, anywhere inside `<ANY>` elements, there may be placed any of the six builtin functions:  

```
(CONSA <ATOMIC> <ATOMIC>) -> <RESULT>
(HEADA <ATOMIC>)          -> <RESULT>
(TAILA <ATOMIC>)          -> <RESULT>
(CONSL <ANY> <ANY>)       -> <RESULT>
(HEADL <ANY>)             -> <RESULT>
(TAILL <ANY>)             -> <RESULT>
```

In addition to the exposed grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments are embraced within a pair of `/` symbols. Multiline comments are embraced within an odd number of `/` symbols placed at the same whitespace distance from the beginning of line, so that everything in between is considered as a comment.

### 2.2. semantics

Semantics of Symbolverse, as a study of meaning, reference, or truth of Symbolverse, may be defined in different ways. For this occasion, we choose a nested bulleted list explanation of how different Symbolverse code elements behave:

- Program structure
    - A program starts with a top-level expression: `(RULESET <expression>+)`
    - Each `<expression>` is a rewrite rule: `(RULE (VAR <ATOMIC>+)? (READ (EXP <ANY>)) (WRITE (EXP <ANY>)))`
        - `VAR`: Declares pattern variables local to the rule. Variables are recommended to be named with `<` prefix and `>` suffix to differentiate them from other atoms.
        - `READ`: S-expression pattern to match.
        - `WRITE`: S-expression used for rewriting (may include builtins and unbound variables).
- Rewriting process
    - Input is an S-expression.
    - Rules are applied in declaration order, recursively, deterministically, and from the deepest input subexpressions to the shallowest ones.
    - Matching is based on unification against the READ pattern.
    - If `READ` matches a subexpression:
        - Variables are bound.
        - `WRITE` is instantiated with substitutions.
        - The matched subexpression is replaced.
        - Unbound variables in `WRITE` remain for further rewrites.
    - Rewriting process ends when there are no more rules match. Output is the rewritten S-expression.
- Built‑in functions
    - String (Atom) operations (operate on atomic values):
        - `(CONSA <a1> <a2>)` prepends atom `<a1> to atom `<a2>`
        - `(HEADA <a>)` returns the first character of the atom `<a>`
        - `(TAILA <a>)` returns the rest of the atom `<a>`
    - List (S‑expr) operations (operate on list values):
        - `(CONSL <l1> <l2>)` prepends element `<l1>` to the list `<l2>`
        - `(HEADL <l>)` returns the first element of the list `<l>`
        - `(TAILL <l>)` returns the remaining elements of the list `<l>`

Hopefully complete enough, the above structured explanation may serve as a semantic specification of Symbolverse. But since the theory is only one side of a medal in a learning process, the rest of this exposure deals with various examples of coding in Symbolverse, possibly completing the definition process.

## 3. tutorial examples

We selected a few representative examples to study how Symbolverse behaves in different situations. These examples should be simple enough even for novice programmers to follow, thus revealing the Symbolverse execution process in practice. Nevertheless, the examples serve merely as an indication to possibilities that can be brought to light by an eye of more experienced programmers.

#### single rules

The following example:

```
///
hello world example

 input: `(hello machine)`
output: `(hello world)`
///

(
    RULESET

    (RULE (READ (EXP (\hello \machine))) (WRITE (EXP (\hello \world))))
)
```

... reads `(hello machine)` from input, and outputs `(hello world)` instead of input. The rule also reaches arbitrary depth, so that input `(lft (hello machine) rgt)` turns into `(lft (hello world) rgt)`. The escape character `\` denotes terminal symbols.

The next example uses variables:

```
///
hello entity example

 input: `(greet Name)`
output: `(hello Name)`
///

(
    RULESET

    (RULE (VAR Name) (READ (EXP (\greet \Name))) (WRITE (EXP (\hello \Name))))
)
```

In our case, a variable name is `Name`, as stated in the `VAR` section. The first alphabetic character determines a type of expression it embraces. If it is a lower case, the variable accepts only atomic values. If it is an upper case, the variable accepts any value, including complex S-expressions. Thus, when we pass `(greet human)` as an input, we get `(hello human)` as an output.

#### set of rules

Naturally, we can also have a set of rules defining the rewriting process. Thus, the next example:

```
///
toy making decision

 input: `(isGood girl/boy)`
output: `(makeToy doll/car)`
///

(
    RULESET

    (RULE (READ (EXP (\isGood \girl))) (WRITE (EXP (\makeToy \doll))))
    (RULE (READ (EXP (\isGood \boy) )) (WRITE (EXP (\makeToy \car) )))
)
```

can in one case change `(isGood girl)` into `(makeToy doll)`, or in another `(isGood boy)` into `(makeToy car)`.

As an example of set of rules utilizing variables, we can consider:

```
///
job title decision

 input: `(isDoing Name drivingRocket/healingPeople)`
output: `(isTitled Name astronaut/doctor)`
///

(
    RULESET

    (
        RULE
        (VAR Name)
        (READ  (EXP (\isDoing \Name \drivingRocket)))
        (WRITE (EXP (\isTitled \Name \astronaut)   ))
    )
    (
        RULE
        (VAR Name)
        (READ  (EXP (\isDoing \Name \healingPeople)))
        (WRITE (EXP (\isTitled \Name \doctor)      ))
    )
)
```

so that passing `(isDoing Jane drivingRocket)` as an input gets us the expression `(isTitled Jane astronaut)` as an output.

#### chaining rules

We can also repeatedly chain rules one onto another, from its right hand side to its left hand side.

```
///
shadows decision

 input: `(sunIs rising/falling)`
output: `(shadowsDo expand/shrink)`
///

(
    RULESET

    (RULE (READ (EXP (\sunIs \rising) )) (WRITE (EXP (itIs morning)  )))
    (RULE (READ (EXP (\sunIs \falling))) (WRITE (EXP (itIs afternoon))))

    (RULE (READ (EXP (itIs morning)  )) (WRITE (EXP (shadowsLean west))))
    (RULE (READ (EXP (itIs afternoon))) (WRITE (EXP (shadowsLean east))))

    (RULE (READ (EXP (shadowsLean west))) (WRITE (EXP (\shadowsDo \shrink))))
    (RULE (READ (EXP (shadowsLean east))) (WRITE (EXP (\shadowsDo \expand))))
)
```

Thus, passing an input `(sunIs rising)` finally gets us an output `(shadowsDo shrink)` while passing an input `(sun is falling)` finally gets us an output `(shadowsDo expand)`. Rules automatically chain one onto another where their terms match.

Note the use of escaping characters. Unescaped atomic values are unreachable from the outside world, so they don't clash with inputs and outputs.

The similar chaining example, but with variables would be:

```
///
weighting decision

 input: `(orbitsAround Object1 Object2)`
output: `(weigthtsMoreThan Object2 Object1)`
///

(
    RULESET

    (
        RULE
        (VAR P1 P2)
        (READ  (EXP (\orbitsAround \P1 \P2) ))
        (WRITE (EXP (attractsMoreThan P2 P1)))
    )
    (
        RULE
        (VAR P1 P2)
        (READ  (EXP (attractsMoreThan P1 P2)))
        (WRITE (EXP (\weightsMoreThan \P1 \P2)))
    )
)
```

so that when we pass `(orbitsAround earth sun)`, we get `(weightsMoreThan sun earth)`. Again, the internal constant `attractsMoreThan` is unreachable from the outside world.

#### sub-structural term operations

Sometimes we have to construct variable length lists, or concatenate atoms to produce new lists or atoms. In these cases, we can use builtin functions `CONSL` for lists, and `CONSA` for atoms. In other cases, we want to extract elements of variable length lists, or characters from atoms. In these cases, we use `HEADL` and `TAILL` for lists, and `HEADA` and `TAILA` for atoms. These functions are depicted in the following example:

```
(
    RULESET
    
    /sub-atom/
    (RULE (VAR A) (READ (EXP (\headA A))) (WRITE (EXP (HEADA \A))))
    (RULE (VAR A) (READ (EXP (\tailA A))) (WRITE (EXP (TAILA \A))))
    (RULE (VAR H T) (READ (EXP (\consA \H \T))) (WRITE (EXP (CONSA \H \T))))
    
    /sub-list/
    (RULE (VAR A) (READ (EXP (\headL \A))) (WRITE (EXP (HEADL \A))))
    (RULE (VAR A) (READ (EXP (\tailL \A))) (WRITE (EXP (TAILL \A))))
    (RULE (VAR H T) (READ (EXP (\consL \H \T))) (WRITE (EXP (CONSL \H \T))))
)
```

Thus, we can pass an input to the previous example:

```
(
    (
        atoms
        (headA 123)
        (tailA 123)
        (consA 1 23)
    )
    (
        lists
        (headL (1 2 3))
        (tailL (1 2 3))
        (consL 1 (2 3))
    )
)
```

The output of this operation would be:

```
(
    (
        atoms
        1
        23
        123
    )
    (
        lists
        1
        (2 3)
        (1 2 3)
    )
)
```

Sub-structural operations may be used when we want to specifically format input or output according to our requests.

#### free variables

Variables we exposed by previous examples are all being used at the left hand rules sides. Such variables are called *bound variables*. However, we may place variables at the right hand rule side without being referenced at the left hand rule side. Such variables are called *free variables*, and they may be described in the following example:

```
(RULE (VAR F X Y) (READ (EXP (function F))) (WRITE (EXP (F X Y Y))))
```

Here, variable `F` represents a bound variable, while variables `X` and `Y` are free variables. Free variables are indicated by the `FREEVAR` keyword in the final output. Each rule that produces a free variable, attaches an unique index to a variable name, relative to applied rule. Free variables may be important in pattern matching, e.g. during computing proofs of theorems. They are given special care in this framework, being calculated using a standard unification algorithm. Thus, in the previous example, the output may be matched with some further chaining rules only if the first parameter equals the value of variable `F`, the second parameter matches any atomic value (variable `X`), while the third and the fourth elements match atomic values having the same appearance (variable `Y`). Of course, it is possible to have compound contents of free variables, even containing inherited free variables, while their behavior correctly follows the unification algorithm functionality.

## 4. conclusion

If properly performed, there could be numerous kinds of uses of the Symbolverse system. One use may be in editing input in sessions that produce some mathematical, logical, or other kinds of computations, while looping back to editing sessions until we are satisfied with the output. Some other, maybe industrial use may involve compiling a program source code to some assembly target code. In other situations, it is also included that we could form a personal, classical business, or even scientific knowledge base with relational algebra rules, so we can navigate, search, and extract wanted information. Ultimately, data from the knowledge base could mutually interact using on-demand learned inference rules, thus developing the entire logical reasoning system ready to draw complex decisions on general system behavior. And this partial sketch of possible uses is just a tip of the iceberg because with a kind of system like Symbolverse, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.

