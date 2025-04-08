```
// work in progress //
```
---

# symbolverse v0.3.7

_**tags:** s-expression, rewriting, term-rewriting, term-rewriting-systems_

**project roadmap:**

- `[x]` v0.1.x basic rewrite rules
- `[x]` v0.2.x scoped rewrite rules
- `[x]` v0.3.x sub-structural operations
- `[ ]` v1.0.x finalizing the package

## project specifics

A **term rewriting system** is a tool for automating the transformation of expressions, enabling efficient problem-solving in areas like formal verification, symbolic computation, and programming. By applying systematic rules, it ensures consistent and correct results in optimizing code, proving theorems, and simplifying complex expressions.

An **S-expression** (Symbolic Expression) is a simple and uniform way of representing nested data or code using parentheses to denote lists and atoms, commonly used in Lisp programming and symbolic computation.

_**Symbolverse**_ is an S-expression based term rewriting system. *Symbolverse* code functions like a set of mathematical formulas, but with a broader scope. It can transform not just mathematical expressions but any type of S-expressions, depending on rules we provide. *Symbolverse* is a Turing complete system, which means it has the capability to perform any computation that can be done by any other known computational system.

To get a glimpse on how a *Symbolverse* program looks like, here's a simple example:

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
)
```

Providing the input `(div (add x x) 2)`, the example outputs `x`.

There are a couple resources about *Symbolverse* to check out:

- Explore examples at [online playground](https://tearflake.github.io/symbolverse/playground/).
- Read the [Symbolverse specification](https://github.com/tearflake/symbolverse/blob/main/docs/symbolverse.md).

## building executables from source code

*Symbolverse* functions as a standalone executable operating on files. To build the executables from source code, do the following:

1. make sure you have git, Node.js, and npm installed in your system
2. enter OS command prompt
3. install pkg: `sudo npm install -g pkg` on Linux, or `npm install -g pkg` on Windows
4. change to your project directory
5. clone this repository: `git clone https://github.com/tearflake/symbolverse`
6. change directory: `cd symbolverse`
7. run pkg: `pkg . --out-path bin/`
8. if everything goes well, executables for Linux, Windows, and MacOS will be in `./bin/` directory

Executables run from command prompt, and take three parameters: rules-file, input-file, and output-file. If we omit the output-file parameter, the output is redirected to the terminal.

## javascript API access

*Symbolverse* may expose its functionality through javascript API (Application Programming Interface), both in browser and in Node.js.

To access the API from Node.js, install this package: `npm i @tearflake/symbolverse`, and include the following line in your code:

```
const Rewriter = require('@tearflake/symbolverse');
```

To access the API from browser, clone this repository from GitHub: `git clone https://github.com/tearflake/symbolverse`, and include the following line in your code:

```
<script src="path-to-symbolverse-package/symbolverse.js"></script>
```

Below, regardless of accessing from Node.js or browser, use the API as:

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

var arrRules = await Rewriter.compile (strRules);

if (!arrRules.err) {
    var strInput = `
        (hello machine)
    `;

    var arrOutput = Rewriter.rewrite (arrRules, strInput);

    if (!arrOutput.err) {
        console.log (Rewriter.stringify (arrOutput));
    }
}
```

Along with `Rewriter.compile (...)` function, we also have `Rewriter.compileFile (...)` function available. The only difference is that `compileFile` read a file from a server, and it enables possible use of file fetching system within the code files.

## further work

We are making efforts to reach the version 1.0.0.

---

```
// work in progress //
```

