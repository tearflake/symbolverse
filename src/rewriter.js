// rewriter.js
// (c) tearflake, 2024
// MIT License

var Rewriter = (
    function (obj) {
        return {
            compile: obj.compile,
            rewrite: obj.rewrite
        };
    }
) (
    (function () {
        "use strict";
        
        var compile = function (strRules) {
            return Compiler.compile (strRules);
        }
        
        var rewrite = function (rules, strInput) {
            var input = Sexpression.parse (strInput);
            if (input.err) {
                return input;
            }
            else {
                var output = produce (rules, input)
                if (output.err) {
                    var msg = Sexpression.getNode (strInput, output.path);
                    return {err: output.err, found: msg.found, pos: msg.pos};
                }
                else {
                    return Sexpression.stringify (output);
                }
            }
        }
        
        var produce = function (rules, top) {
            var stack, item;
            
            Ruler.resetVarIdx ();
            top = Sexpression.flatten(top);
            stack = [{phase: "top"}];
            stack.push ({
                phase: "test-whole",
                write: top,
                fromW: 0,
                toW: top.length,
                curRule: undefined,
                path: []
            });
            while (stack.length > 1) {
                if (stack.length >= 1024) {
                    item = stack[stack.length - 2];
                    return {err: "Maximum call stack exceeded", path: item.phase === "test-parts" ? item.path.slice (0, item.path.length - 1) : item.path};
                }

                item = stack[stack.length - 1];
                if (item.phase === "test-whole") {
                    if (item.result === true || item.result === false) {
                        stackPop (stack, true, item.resultData);
                    }
                    else if (item.result === "rewrite") {
                        stack.push ({
                            phase: "rewrite",
                            ruleIndex: -1,
                            write: item.resultData,
                            fromW: 0,
                            toW: item.resultData.length,
                            processData: [],
                            curRule: item.curRule,
                            path: item.path
                        });
                    }
                    else if (item.toW - item.fromW === 1){
                        item.result = "rewrite";
                        item.resultData = [item.write[item.fromW]];
                    }
                    else {
                        stack.push ({
                            phase: "test-parts",
                            write: item.write,
                            fromW: item.fromW + 1,
                            toW: item.toW - 1,
                            idxW: item.fromW + 1,
                            processData: [],
                            curRule: item.curRule,
                            path: [...item.path, 0]
                        });
                    }
                }
                else if (item.phase === "test-parts") {
                    if (item.result === true) {
                        item.processData = [...item.processData, ...item.resultData];
                        item.path[item.path.length - 1]++;
                    }
                    
                    if (item.idxW === item.toW) {
                        stackPop (stack, "rewrite", ["(", ...item.processData, ")"]);
                    }
                    else if (item.idxW < item.toW) {
                        var fromW = item.idxW;
                        var toW = getNextWhole (item.write, item.idxW);
                        item.idxW = toW;
                        stack.push ({
                            phase: "test-whole",
                            write: item.write,
                            fromW: fromW,
                            toW: toW,
                            curRule: item.curRule,
                            path: item.path
                        });
                    }
                }
                else if (item.phase === "rewrite") {
                    if (item.result === true) {
                        item.processData.push (item.resultData);
                    }
                    
                    var tmpl1 = Ruler.getMaxLvl (item.write, item.fromW, item.toW, []) - 1;
                    while (true) {
                        while (true) {
                            item.ruleIndex++;
                            if (item.ruleIndex === rules.length) {
                                break;
                            }
                            
                            // level depth sensitivity
                            if (item.curRule !== undefined && rules[item.ruleIndex].rule.read !== undefined) {
                                var cd = getComParDist (item.curRule.parents, rules[item.ruleIndex].parents);
                                var l1 = item.curRule.rule.maxLvlW;
                                var l2 = rules[item.ruleIndex].rule.maxLvlR;
                                var t1 = item.curRule.level;
                            }
                            else {
                                var cd = {d1: 0, d2: 0};
                                var l1 = tmpl1;
                                var l2 = rules[item.ruleIndex].rule.maxLvlR - 1;
                                var t1 = 1;
                            }
                            
                            if (l1 <= t1 + cd.d1 && l2 <= rules[item.ruleIndex].level + cd.d2) {
                                break;
                            }
                        }
                        
                        //item.ruleIndex++;
                        if (item.ruleIndex === rules.length || item.result === true) { // `item.result === true` for deterministic version
                            if (item.processData.length > 1) {
                                var con = [];
                                for (var i = 0; i < item.processData.length; i++) {
                                    con = [...con, ...item.processData[i]];
                                }
                                //stackPop (stack, true, ["(", "CON", ...con, ")"]); // for nondeterministic version
                                stackPop (stack, true, item.processData[0]);
                            }
                            else if (item.processData.length === 1) {
                                stackPop (stack, true, item.processData[0]);
                            }
                            else {
                                stackPop (stack, false, item.write);
                            }
                            
                            break;
                        }
                        else {
                            var uvars = Ruler.unify (item.write, item.fromW, item.toW, rules[item.ruleIndex].rule.read, 0, rules[item.ruleIndex].rule.read.length, rules[item.ruleIndex].vars);
                            if (uvars) {
                                var substed = Ruler.subst (rules[item.ruleIndex].rule.write, uvars);
                                stack.push ({
                                    phase: "test-whole",
                                    write: substed,
                                    fromW: 0,
                                    toW: substed.length,
                                    curRule: rules[item.ruleIndex],
                                    path: item.path
                                });
                                
                                break;
                            }
                        }
                    }
                }
            }
            
            var result = stack[0].resultData.join(" ");//.replaceAll (/ (.*) /g, (matches, x) => {return '"' + x + '"'});
            return Sexpression.parse (result);
            //return Sexpression.parse (stack[0].resultData.join(" "));
        }
        
        //var farthestPath;
        var stackPop = function (stack, result, resultData) {
            //if (compareArr(stack[stack.length - 1].path || [], farthestPath) > 0) {
            //    farthestPath = stack[stack.length - 1].path;
            //}
            stack.pop ();

            stack[stack.length - 1].result = result;
            stack[stack.length - 1].resultData = resultData;
        }
        
        var isEqual = function (tok1, from1, to1, tok2, from2, to2) {
            if (Array.isArray (tok1) && Array.isArray (tok2) && to1 - from1 === to2 - from2) {
                for (var i = from1, j = from2; i < tok1.length && tok1[i] === tok2[j]; i++, j++);
                
                return (i === to1);
            }
        }

        var getNextWhole = function (tokens, idx) {
            var parens = 0;
            if (tokens[idx] === "(") {
                do {
                    if (tokens[idx] === "(") {
                        parens++;
                    }
                    else if (tokens[idx] === ")") {
                        parens--;
                    }
                    idx++;
                } while (parens > 0)
                
                return idx;
            }
            else {
                return idx + 1;
            }
        }
        
        var getComParDist = function (p1, p2) {
            var p1i = p1;
            var p2i = p2;
            var p1d = 1;
            var p2d = 1;
            while (p1 && p1[0] !== undefined) {
                p1d--;
                while (p2 && p2[0] !== undefined) {
                    p2d--;
                    if (p1[0] === p2[0]) {
                        return {d1: p1d, d2: p2d};
                    }
                    p2 = p2[1];
                }
                p2d = 1;
                p2 = p2i;
                p1 = p1[1];
            }
            
            throw "No common parent context";
        }
        
        return {
            compile: compile,
            rewrite: rewrite
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var Sexpression = require ("./sexpression.js");
    var Compiler = require ("./compiler.js");
    var Ruler = require ("./ruler.js");
    module.exports = Rewriter;
    
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

