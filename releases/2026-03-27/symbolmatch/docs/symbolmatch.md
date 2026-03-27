# symbolmatch

> **[about document]**  
> Introduction to *Symbolmatch*, a symbol processing framework
>
> **[intended audience]**  
> Advanced programmers
> 
> **[abstract]**  
> Symbolmatch is a minimal parser combinator framework built on S-expressions. It defines grammars using the same notation it parses, making it self-describing and bootstrappable. By translating S-expressions into a meta-representation and applying deterministic, PEG-like semantics, Symbolmatch achieves predictable, structured parsing with no backtracking. Its compact design supports modular grammars and self-hosting within a unified formalism, ensuring that parsed expressions are suitable for further symbolic processing.

## table of contents

- [1. introduction](#1-introduction)  
- [2. theoretical background](#2-theoretical-background)
    - [2.1. formal syntax](#21-formal-syntax)
    - [2.2. informal semantics](#22-informal-semantics)  
- [3. examples](#3-examples)  
- [4. conclusion](#4-conclusion)  

## 1. introduction

Symbolmatch is a minimal parser combinator framework that operates on S-expressions. It defines grammars in the same notation that it parses, making the system self-describing and bootstrappable. Parsing is expressed as symbolic pattern matching, where rules match the meta-representation of S-expressions rather than raw text.

The framework adopts deterministic Parsing Expression Grammar (PEG) semantics without backtracking, ensuring predictable behavior and clear rule evaluation. Despite its minimal core, Symbolmatch supports recursion, modular composition, and self-hosting.

## 2. theoretical background

Symbolmatch combines elements of S-expression syntax and parsing production rules. It defines a small set of rules from which grammars for parsing formatted S-expressions can be built.

To make the parsing possible, one simple trick is being used. Prior to parsing, the input S-expression is being converted to its meta-form. The meta-form is inspired by the `cons` instruction from the Lisp family. Analogously to `cons`, Symbolmatch is using `LIST` and `ATOM` instructions, for constructing lists and atoms, respectively. That way, any S-expression is possible to be expressed by meta-rules that simply pattern matches against the meta S-expressions.

Each meta-rule is in fact a fixed length context free grammar rule that, on the meta level, is able to express even variable length meta S-expressions. However, following the minimalism we are set to fulfill, the rules are interpreted as parsed expression grammar rules, turning them to nondeterministic ordered choice matching expressions. We consciously choose to omit the backtracking to keep the minimalism constraints.

### 2.1. formal syntax

In computer science, the syntax of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language. Symbolmatch language itself resembles a kind of S-expression. S-expressions consist of lists of atoms or other S-expressions where lists are surrounded by parenthesis. In Symbolmatch, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of Backus-Naur form syntax rules:

```
<start> := <grammar>

<grammar> := (GRAMMAR <elem>+)

<elem> := (RULE <IDENTIFIER> <metaExp>)
        | (COMPUTE (NAME <ATOM>) <grammar>)

<metaExp> := (LIST <metaExp> <metaExp>)
           | <metaAtom>
         
<metaAtom> := (ATOM <ATOMIC> <metaAtom>)
            | <atomic>

<atomic> := <ATOMIC>
          | (RUN <ATOMIC>)
          | ()
```

The above grammar defines the syntax of Symbolmatch. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the Symbolmatch grammar.

Atoms may be enclosed between a pair of `'` characters if we want to include special characters used in the grammar. Strings are enclosed between a pair of `"` characters. Multiline atoms and strings are enclosed between an odd number of `'` or `"` characters.
 
In addition to the exposed grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//` and span to the end of line. Multiline comments begin with `/*` and end with `*/`.

### 2.2 informal semantics

Symbolmatch grammars are interpreted with PEG semantics without backtracking. Each rule matches deterministically, and choice is ordered (the first matching branch wins).

#### parsing mechanism

Before the algorithm starts parsing, the input expression is being translated into meta-expression in a translation phase. Any valid S-expression has a corresponding meta-representation. Meta-lists are right-recursive nested to form lists using `LIST` keyword, just like meta-atoms are right-recursive nested to form atoms using `ATOM` keyword. Meta-lists and meta-atoms recursive definitions are terminated by an empty list.

Algorithm then proceeds with the matching phase. As expected, the parsing entry point is the `START` rule that branches into matching depth. Finally, when the matching phase is done, the parser returns either input expression, or an error position.

Built-in constants are:

- `ATOMIC`: matches any S-expression atom.  
- `ANY`: matches any S-expression.  
- `()`: terminates `LIST` or `ATOM` meta-expressions

In addition to the above constants, it is possible to write `"..."` terminals in grammars. This represents a shortcut that automatically unfolds into nested `ATOM` meta-expression on character split basis, ready to match against translated meta-input.

#### packaging mechanism

In Symbolmatch, it is possible to isolate rules to build up independent packages which avoid name clashing. This is done by introducing `(COMPUTE (NAME ...) ...)` sections wherever a rule is expected. Such sections are then referred to from adjacent rules using `(RUN ...)` syntax. In this call, Symbolmatch automatically passes the current parsing sub-expression as a parameter to the package, expecting its rules to take over from the sub-expression starting point.

#### error reporting

If no error occurred during parsing, the exact input expression is returned as a result of the computation. However, if a parsing error is encountered, the error reporting appears structural: Symbolmatch returns the **furthest path of indexes into the S-expression tree** that led to the error.

## 3. examples

### example 1: list of atoms

Grammar:

```
(GRAMMAR
    (RULE START atoms)
   
    (RULE atoms (LIST atom atoms))
    (RULE atoms (LIST atom ()))
    
    (RULE atom ATOMIC))
```

Input S-expression:

```
(foo bar)
```

Result:

```
["foo", "bar"]
```

### example 2: nested lists

Grammar:

```
(GRAMMAR
    (RULE START (LIST "pairlist" pairs))
    
    (RULE pairs (LIST pair pairs))
    (RULE pairs (LIST pair ()))
    
    (RULE pair (LIST "pair" (LIST atom (LIST atom ()))))
    (RULE atom ATOMIC))
```

Input:
```
(pairlist
    (pair foo bar)
    (pair alpha beta)
    (pair one two))
```

Result
```
["pairlist", ["pair", "foo", "bar"], ["pair", "alpha", "beta"], ["pair", "one", "two"]]
```

### example 3: custom atoms and computing section

Grammar:

```
(GRAMMAR
    (RULE START binTree)
    
    (RULE binTree (LIST "bintree" (LIST binTree (LIST binTree ()))))
    (RULE binTree (LIST "leaf" (LIST (RUN binNum) ())))

    (COMPUTE
        (NAME binNum)
        (GRAMMAR
            (RULE START digits)
            
            (RULE digits (ATOM digit digits))
            (RULE digits (ATOM digit ()))
            
            (RULE digit "0")
            (RULE digit "1"))))
```

Input S-expression:

```
(bintree
    (bintree
        (leaf 01)
        (leaf 10))
        
    (leaf 11))
```

Result:

```
["bintree", ["bintree", ["leaf", "01"], ["leaf", "10"]], ["leaf", "11"]]
```

However, the input S-expression:

```
(bintree
    (leaf 01)
    (leaf (leaf 11)))
```

fails because it doesn't follow the binary tree grammar. The error report returns:

```
["Error", [2, 1]]
```

This path identifies the location inside the nested expression where the parser expects a number.

## 4. conclusion

Symbolmatch demonstrates how a minimal set of S-expression-based rules can define and parse complex grammars, including itself. Its design emphasizes:

- Minimal core rule types with clear semantics  
- Rule packaging using `(COMPUTE ...)` sections  
- Structural error reporting via index paths  
- Self-hosting through bootstrapping  

Future work may include optimization of parsing performance, as well as richer error diagnostics (e.g. expected tokens).
