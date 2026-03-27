// sexpression.js
// (c) tearflake, 2025
// MIT License

"use strict"

var SExpr = (
    function (obj) {
        return {
            parse: obj.parse,
            getPosition: obj.getPosition,
            stringify: obj.stringify
        };
    }
) (
    (function () {

        function tokenize(input) {
          let i = 0, line = 1, col = 1;
          const tokens = [];

          function advance(n = 1) {
            while (n-- > 0) {
              if (input[i] === "\n") { line++; col = 1; }
              else col++;
              i++;
            }
          }

          function peek(n = 0) { return input[i + n]; }

          while (i < input.length) {
            const ch = peek();

            // whitespace
            if (/\s/.test(ch)) { advance(); continue; }

            // comments
            if (input.startsWith("//", i)) {
              while (i < input.length && peek() !== "\n") advance();
              continue;
            }
            if (input.startsWith("/*", i)) {
              advance(2);
              while (i < input.length && !input.startsWith("*/", i)) advance();
              if (input.startsWith("*/", i)) advance(2);
              continue;
            }

            // strings (single, double, or repeated)
            if (ch === '"' || ch === "'") {
              let quoteChar = ch;
              let startLine = line, startCol = col;
              let count = 0;
              while (peek(count) === quoteChar) count++;
              if (count === 1 || count % 2 === 0) {
                advance();
                let value = "";
                let success = false;
                while (i < input.length) {
                  if (input[i] === '\n')
                    return {
                      err: "String not terminated",
                      pos: {x: startCol - 1, y: startLine - 1}
                    };
                  if (input[i - 1] !== '\\' && input.startsWith(quoteChar, i)) {
                    success = true;
                    advance();
                    break;
                  }
                  value += peek();
                  advance();
                }
                if (quoteChar === '"') value = '"' + value + '"';
                if (!success)
                  return {
                    err: "String not terminated",
                    pos: {x: startCol - 1, y: startLine - 1}
                  };
                tokens.push({ type: "STRING", value, line: startLine, col: startCol });
                continue;
              } else {
                advance(count);
                var start, end;
                end = i;
                while (true) {
                  while (input[end] !== undefined && input[end] !== ' ') {
                      end--;
                  }
                  start = end;
                  while (input[start] !== undefined && input[start] === ' ') {
                      start--;
                  }
                  if (start === end) break;
                  if (start < 0 || input[start] === '\n') {
                    start++;
                    end++;
                    break;
                  } else {
                    end = start;
                  }
                }
                  
                if (!input.startsWith('\n', i)) {
                  return {err: "Expected newline", pos: {x: col - 1, y: line - 1}}
                }
                advance();

                let prefix = input.substring(start, end);
                let value = "";
                let success = false;
                while (i < input.length && input.startsWith(prefix, i)) {
                  advance(prefix.length);

                  if (input.startsWith(quoteChar.repeat(count), i)) {
                    if (ch === '"') {
                      value = '"""\n' + value + '"""';
                    }
                    success = true;
                    advance(count);
                    break;
                  }
                  
                  let lnStart = i;
                  while (i < input.length && input[i] !== '\n') advance();
                  value += input.substring(lnStart, i) + '\n';
                  advance();
                }

                if (!success) {
                  return {
                    err: "String not terminated",
                    pos: {x: startCol - 1, y: startLine - 1}
                  };
                }

                tokens.push({ type: "STRING", value, line: startLine, col: startCol });
                continue;
              }
            }

            // parens
            if (ch === "(") { tokens.push({ type: "LPAREN", line, col }); advance(); continue; }
            if (ch === ")") { tokens.push({ type: "RPAREN", line, col }); advance(); continue; }

            // atom
            if (/[^()\s]/.test(ch)) {
              let startLine = line, startCol = col;
              let value = "";
              while (i < input.length && !/[()\s]/.test(peek())) {
                if (input[i] === '/' && (input [i + 1] === '/' || input [i + 1] === '*'))
                  break;
                value += peek();
                advance();
              }
              tokens.push({ type: "ATOM", value, line: startLine, col: startCol });
              continue;
            }

            throw new Error(`Unexpected character '${ch}' at ${line}:${col}`);
          }
          return tokens;
        }

        function getAst(tokens) {
          let pos = 0;
          let positions = new Map();

          function parseExpr() {
            let tok = tokens[pos];

            if (!tok)
              return {err: "Unexpected end of s-expression", found: '""', pos: {x: 0, y: 0}}

            if (tok.type === "LPAREN") {
              pos++;
              let list = [];
              positions.set(list, { line: tok.line, col: tok.col });
              while (tokens[pos] && tokens[pos].type !== "RPAREN") {
                list.push(parseExpr());
              }
              if (!tokens[pos])
                return {err: "Unclosed parenthesis", pos: {x: tok.col - 1, y: tok.line - 1}};
              pos++; // consume RPAREN
              return list;
            }
            if (tok.type === "ATOM" || tok.type === "STRING") {
              pos++;
              positions.set(tok, { line: tok.line, col: tok.col });
              return tok;
            }
          }
          
          let ast = parseExpr();
          if (tokens[pos] !== undefined) {
            ast = {
              err: "Expected end of s-expression",
              found: tokens[pos].value,
              pos: {x: tokens[pos].col - 1, y: tokens[pos].line - 1}
            }
            positions = null;
          }

          return { ast, positions };
        }

        function getPosition(code, indexPath) {
          let tokens = tokenize(code);
          const { ast, positions } = getAst(tokens);

          let node = ast;
          for (let idx of indexPath) {
            if(!Array.isArray(node))
              return {
                err: "Syntax error",
                found: node.value,
                pos: {y: positions.get(node).line - 1, x: positions.get(node).col - 1}
              };
            
            if(idx >= node.length){
                if(node.length === 0) {
                  return {
                    err: "Missing list elements",
                    found: "empty list",
                    pos: {
                        y: positions.get(node).line - 1,
                        x: positions.get(node).col - 1
                    }
                  };
                } else {
                  return {
                    err: "Missing list elements",
                    found: "end of list",
                    pos: {
                        y: positions.get(node).line - 1,
                        x: positions.get(node).col - 1
                    }
                  };
                }
            }
            node = node[idx];
          }
          return {
            err: "Syntax error",
            found: (Array.isArray (node) ? "list" : node.value),
            pos: {y: positions.get(node).line - 1, x: positions.get(node).col - 1}
          };
        }
        
        function makeNodeTree(ast) {
          if(ast.value !== undefined) {
            return ast.value;
          } else {
            return ast.map (makeNodeTree);
          }
        }
        
        function parse(code) {
          let tokens = tokenize(code);
          if (tokens.err) return tokens;
          const { ast, positions } = getAst(tokens);
          if (ast.err)
            return ast;
            
          return makeNodeTree(ast);
        }

        function stringify (node) {
            const stack = [{ node, indent: "", index: 0, result: "" }];
            let output = "";

            while (stack.length > 0) {
                const current = stack.pop();
                const { node, indent, index, result } = current;

                if (index === 0) {
                    if (typeof node === "string") {
                        output += indent + quoteIfNecessary (node) + "\n";
                        continue;
                    }
                    output += indent + "(\n";
                }

                let i = index;
                for (; i < node.length; i++) {
                    if (Array.isArray (node[i])) {
                        stack.push ({ node, indent, index: i + 1, result });
                        stack.push ({ node: node[i], indent: indent + "    ", index: 0, result: "" });
                        break;
                    }
                    else {
                        let part;
                        if (node[i] === undefined) {
                            part = "UNDEFINED";
                        }
                        else if (node[i] === true) {
                            part = "TRUE";
                        }
                        else if (node[i] === null) {
                            part = "NIL";
                        }
                        else {
                            part = quoteIfNecessary (node[i]);
                        }
                        output += indent + "    " + part + "\n";
                    }
                }

                if (i === node.length) {
                    output += indent + ")\n";
                }
            }

            return output;
        }

        function quoteIfNecessary (str) {
            if (str.graph){
                return "[GRAPH]";
            }
            
            var quoted = false;
            if (str.charAt(0) !== '"' && str.charAt(str.length - 1) !== '"') {
                for (var i = 0; i < str.length; i++) {
                    if (str === "" || '() \t\n\r'.indexOf (str.charAt (i)) > -1) {
                        quoted = true;
                        break;
                    }
                }
            }
            
            if (quoted) {
                return "'" + str + "'";
            }
            else {
                return str;
            }
        }

        return {
            parse: parse,
            getPosition: getPosition,
            stringify: stringify
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support

    module.exports = SExpr;
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }

    // end of Node.js support
}

