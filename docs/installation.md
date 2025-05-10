# symbolverse installation instructions

There may be two possible uses of *Symbolverse* regarding its installation: Javascript API access or command line access. In this document we cover both use cases.

## javascript API access

*Symbolverse* may expose its functionality through javascript API (Application Programming Interface), both in browser and in Node.js.

To access the API from Node.js, install it by: `npm install git+ssh://github.com/tearflake/symbolverse`, and include the following line in your code:

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

Along with `Rewriter.compile (...)` function, we also have `Rewriter.compileFile (...)` function available. The only difference is that `compileFile` reads a file from a server, and it enables possible use of file fetching system within the code files.

## command line access

*Symbolverse* may function as a standalone executable operating on files. To build the executables from source code, do the following:

1. make sure you have git, Node.js, and npm installed in your system
2. enter OS command prompt
3. install pkg: `sudo npm install -g pkg` on Linux, or `npm install -g pkg` on Windows
4. change to your project directory
5. clone this repository: `git clone https://github.com/tearflake/symbolverse`
6. change directory: `cd symbolverse`
7. run pkg: `pkg . --out-path bin/`
8. if everything goes well, executables for Linux, Windows, and MacOS will be in `./bin/` directory

Executables run from command prompt, and take three parameters: rules-file, input-file, and output-file. Rules-file and input-file are mandatory, but if we omit the output-file parameter, output is then redirected to the terminal.
