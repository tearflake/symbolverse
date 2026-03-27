# Symbolmatch 0.7.4

Symbolmatch is a parser combinator framework that operates on **S-expressions**. It defines grammars in the same notation that it parses, making it **self-describing and bootstrappable**.  

## Features

- **Self-hosting grammar**: Symbolmatch defines its own grammar using Symbolmatch itself.  
- **PEG semantics**: Write rules in CFG-like environment having PEG semantics.
- **Structural error reporting**: along with raw character offsets, Symbolmatch reports errors as index paths into the S-expression tree.  

## Example

### Grammar

```
(GRAMMAR
    (RULE <start> <calc>)
    
    (RULE <calc> (LIST "add" <elems>))
    (RULE <calc> (LIST "mul" <elems>))
    (RULE <calc> ATOMIC)
    
    (RULE <elems> (LIST <calc> <elems>))
    (RULE <elems> ())
)
```

### Input

```
(mul (add 2 3 4) 5)
```

### Output

```
["mul", ["add", "2", "3" "4"], "5"]
```

## Getting Started

1. Review the [Symbolmatch Specification](https://tearflake.github.io/symbolmatch/docs/symbolmatch) for details of the grammar and semantics.  
2. Review the examples in [Symbolmatch Playground](https://tearflake.github.io/symbolmatch/playground/) as a guide to build your own grammars.  
3. Clone the repository.  
4. Refer to `./symbolmatch.js` in your javascript project  

## Javascript API  

```
let rules = Parser.parseGrammar ('(GRAMMAR (RULE <start> "Hello!"))');
if (!rules.err) {
    let output = Parser.parse (rules, "Hello!");
    if (!output.err) {
        console.log (output);
    }
}
```

## License

MIT License. See [LICENSE](LICENSE) for details.

