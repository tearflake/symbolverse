```
// work in progress //
```
---

# symbolverse v0.2.8

_**tags:** term rewriting, s-expression_

**project roadmap:**

- `[x]` v0.1.x basic rewrite rules
- `[x]` v0.2.x scoped rewrite rules
- `[ ]` v1.0.x finalizing the package

## project specifics

A **term rewriting system** is a tool for automating the transformation of expressions, enabling efficient problem-solving in areas like formal verification, symbolic computation, and programming. By applying systematic rules, it ensures consistent and correct results in optimizing code, proving theorems, and simplifying complex expressions.

An **S-expression** (Symbolic Expression) is a simple and uniform way of representing nested data or code using parentheses to denote lists and atoms, commonly used in Lisp programming and symbolic computation.

_**Symbolverse**_ is a term rewriting system. *Symbolverse* code functions like a set of mathematical formulas, but with a broader scope. It can transform not just mathematical expressions but any type of S-expressions. *Symbolverse* is a Turing complete system, which means it has the capability to perform any computation that can be done by any other known computational system.

To get a glimpse on how a *Symbolverse* program looks like, here's a simple example:

```
(
    REWRITE
    
    // expression addition
    (
        RULE
        (VAR A B)
        (READ  (EXP (\add                 A A)))
        (WRITE (EXP (\mul (((\0 \0) \1) \0) A)))
    )
    
    // reducible fraction
    (
        RULE
        (VAR A B)
        (READ  (EXP (\div (\mul A B) A)))
        (WRITE (EXP B                  ))
    )
)
```

Providing the input `(div (add x x) (((0 0) 1) 0))`, this example outputs `x`.

There are a couple resources about *Symbolverse* to check out:

- Explore examples at [online playground](https://tearflake.github.io/symbolverse/playground/).
- Read the [Symbolverse specification](https://tearflake.github.io/symbolverse/docs/symbolverse).

## building executables from source code

*Symbolverse* functions as a standalone executable operating on files. To build the executables from source code, do the following:

1. make sure you have git, Node.js, and npm installed in your system
2. enter OS command prompt
3. change to your project directory
4. clone this repository: `git clone https://github.com/tearflake/symbolverse`
5. change directory: `cd symbolverse`
6. install pkg: `sudo npm install -g pkg` on Linux, or `npm install -g pkg` on Windows
7. run pkg: `pkg . --out-path bin/`
8. if everything goes well, executables for Linux, Windows, and MacOS will be in `./bin/` directory

Executables are ran from command prompt, and take three parameters: rules-file, input-file, and output-file. If we omit the output-file parameter, the output is redirected to the terminal.

## javascript API access

*Symbolverse* may expose its functionality through javascript API, both in browser and in Node.js.

To access the API from Node.js, install this package: `npm i @tearflake/symbolverse`, and include the following line in your code:

```
const Rewriter = require('@tearflake/symbolverse');
```

To access the API from browser, clone this repository from GitHub: `git clone https://github.com/tearflake/symbolverse`, and include the following line in your code:

```
<script src="./src/sexpression.js"></script>
```

Below, regardless of using browser or Node.js, use the API as:

```
var strRules = `
    (
        REWRITE
        (
            RULE 
            (READ  (EXP (\\hello \\machine)))
            (WRITE (EXP (\\hello \\world)  ))
        )
    )
`;

var arrRules = Rewriter.compile (strRules);

var strInput = `
    (hello machine)
`;

var strOutput = Rewriter.rewrite (arrRules, strInput);

console.log (strOutput);
```

## further work

We are making efforts to reach the version 1.0.0.

---

```
// work in progress //
```

