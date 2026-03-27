// interpreter.js
// (c) tearflake, 2025
// MIT License

var Interpreter = (
    function (obj) {
        return {
            parse: obj.parse,
            run: obj.run,
        };
    }
) (
    (function () {
        "use strict";
        
        function parse (program) {
            let syntax = `
                (GRAMMAR
                    (RULE START graph)

                    (RULE graph (LIST "GRAPH" elements))
                    
                    (RULE elements (LIST element elements))
                    (RULE elements (LIST element ()))
                    
                    (RULE element
                        (LIST "EDGE"
                            (LIST (LIST "SOURCE" (LIST ATOMIC ()))
                                (LIST instr
                                    (LIST (LIST "TARGET" (LIST ATOMIC ()))
                                        ())))))
                                        
                    (RULE element
                        (LIST "EDGE"
                            (LIST (LIST "SOURCE" (LIST ATOMIC ()))
                                (LIST (LIST "TARGET" (LIST ATOMIC ()))
                                    ()))))
                                    
                    (RULE element
                        (LIST "COMPUTE"
                            (LIST (LIST "NAME" (LIST ATOMIC ()))
                                (LIST graph
                                    ()))))
                    
                    (RULE instr (LIST "INSTR" instructions))
                    
                    (RULE instructions (LIST instruction instructions))
                    (RULE instructions (LIST instruction ()))
                    
                    (RULE instruction (LIST "TEST" (LIST ANY (LIST ANY ()))))
                    (RULE instruction (LIST "ASGN" (LIST ATOMIC (LIST ANY ())))))
            `;
            
            let sSyntax = SExpr.parse (syntax);
            let sProgram = SExpr.parse (program);
            
            if (sProgram.err) {
                return sProgram;
            }
            
            let ast = Parser.parse (program, sSyntax);
            
            if (ast.err) {
                let msg = SExpr.getPosition (program, ast.path);
                return {err: msg.err, found: msg.found, pos: msg.pos};
            }
            else {
                return ast;
            }
        }
        
        function makeGraph (sexpr) {
            let graph = {item: [], children: [], parent: null};
            // GRAPH
            let grph = sexpr;
            for (let i = 1; i < grph.length; i++) {
                let elem = grph[i];
                // EDGE
                if (elem[0] === "EDGE") {
                    // SOURCE
                    let source = elem[1][1];
                    if (!graph.item[source] && !Object.prototype.hasOwnProperty.call(graph.item, source)) {
                        graph.item[source] = [];
                    }
                    
                    if (elem.length === 4) {
                        let instructionSet = [];
                        let instrs = elem[2];
                        // INSTR
                        for (let j = 1; j < instrs.length; j++) {
                            let instr = instrs[j];
                            var instruction;
                            // ASGN
                            if (instr[0] === "ASGN") {
                                instruction = {name: "ASGN", var: instr[1], value: instr [2]}
                            }
                            // TEST
                            else if (instr[0] === "TEST") {
                                instruction = {name: "TEST", lft: instr[1], rgt: instr [2]}
                            }
                            
                            instructionSet.push (instruction);
                        }
                        
                        // TARGET
                        graph.item[source].push ({instructions: instructionSet, target: elem[3][1]});
                    }
                    else if (elem.length === 3) {
                        // TARGET
                        graph.item[source].push ({instructions: [], target: elem[2][1]});
                    }
                }
                // COMPUTE
                else if (elem[0] === "COMPUTE") {
                    graph.children[elem[1][1]] = makeGraph (elem[2])
                    graph.children[elem[1][1]].parent = graph;
                }
            }
            
            return graph;
        }

        function run (program, params) {
            params = SExpr.parse (params);
            if (params.err) return params;
            let res = runLowLevel (makeGraph (program), quote (params));
            return res.err ? res : unquote (res);
        }

        function runLowLevel (graph, params) {
            const env = Object.create(null);
            env["PARAMS"] = params;
            env["RESULT"] = [];
            
            let node = "BEGIN";
            let idx = 0;
            let guard = 0, GUARD_LIMIT = 100000;
            try {
                let fallback = [];
                loop1: while (node !== "END") {
                    if (guard++ > GUARD_LIMIT) {
                        throw new Error ("Guard limit exceeded");
                    }
                    
                    let edges = graph.item[node];
                    if (!edges) {
                        throw new Error (`Uknown node: ${node}`);
                    }

                    loop2: for (let i = idx; i < edges.length; i++) {
                        let edge = edges[i];
                        for (let j = 0; j < edge.instructions.length; j++) {
                            let instruction = edge.instructions[j];
                            if (instruction.name === "ASGN") {
                                var res = evalExpr (instruction.value, graph, env);
                                if (res.err)
                                    return res;
                                    
                                env[instruction.var] = res;
                            }
                            else if (instruction.name === "TEST") {
                                const a = evalExpr (instruction.lft, graph, env);
                                if (a.err)
                                    return a;
                                    
                                const b = evalExpr (instruction.rgt, graph, env);
                                if (b.err)
                                    return b;
                                    
                                if (!deepEqual (a, b))
                                    continue loop2;
                            }
                        }
                        
                        fallback.push ([node, i + 1]);
                        node = edge.target;
                        idx = 0;
                        continue loop1;
                    }
                    
                    if (fallback.length > 0)
                        [node, idx] = fallback.pop ();

                    else
                        throw new Error ("Runtime error - no more fallback edges");
                }

                return env["RESULT"];
            }
            catch (e) {
                return {err: e.message};
            }
        }

        function evalExpr(expr, graph, env) {
            if (!Array.isArray (expr)) {
                if (Object.prototype.hasOwnProperty.call (env, expr)) {
                    return env[expr];
                }
                else {
                    return expr;
                }
            }

            expr = expr.map(e => evalExpr (e, graph, env));

            if (expr[0] === "RUN" && expr.length === 3) {
                if (Object.prototype.hasOwnProperty.call (env, expr[1])) {
                    expr[1] = env[expr[1]];
                }
                
                return compute (expr, graph, env);
            }
      
            return expr;
        }

        function compute (expr, graph, env) {
            let parent = graph;
            while (parent) {
                let child = parent.children[expr[1]];
                if (child) {
                    return runLowLevel (child, evalExpr (expr[2], graph, env));
                }
                parent = parent.parent;
            }
            
            if (expr[1] === "stdlib") {
                let fnName = expr[2][0];
                if (fnName.charAt (0) === '"' && fnName.charAt (fnName.length - 1) === '"') {
                    fnName = fnName.substring (1, fnName.length - 1);
                    if (BUILTINS[fnName]) {
                        return BUILTINS[fnName](["RUN", "stdlib", evalExpr (expr[2], graph, env)]);
                    }
                }
                else {
                    return {err: `Undefined stdlib function ${fnName}`};
                }
            }

            return {err: `Undefined function ${expr[1]}`};
        }

        function deepEqual(a, b) {
            if (a === b) return true;
            if (Array.isArray (a) && Array.isArray (b)) {
                if (a.length !== b.length) return false;
                for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
                return true;
            }
            return (Number.isNaN (a) && Number.isNaN (b)) ? true : false;
        }
        
        function unquote(expr) {
            if (!Array.isArray (expr)) {
                if (expr.charAt (0) === '"' && expr.charAt (expr.length - 1) === '"') {
                    return expr.substring (1, expr.length - 1);
                }
                else {
                    return `${expr}`;
                }
            }
      
            return expr.map(e => unquote (e));
        }

        function quote(expr) {
            if (!Array.isArray (expr)) {
                return `"${expr}"`;
            }
      
            return expr.map(e => quote (e));
        }

        return {
            parse: parse,
            run: run,
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var SExpr = require ("./s-expr.js");
    var SExpr = require ("./parser.js");
    module.exports = Interpreter;
    
    // end of Node.js support
}

