// rewriter.js
// (c) tearflake, 2025
// MIT License

var Rewriter = (
    function (obj) {
        return {
            compile: obj.compile,
            compileFile: obj.compileFile,
            rewrite: obj.rewrite,
            stringify: obj.stringify
        };
    }
) (
    (function () {
        "use strict";
        
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
                    return output;
                }
            }
        }
        
        var compileFile = async function (fileName, level, parents, Files) {
            if (isNode ()) {
                var fi = Files.open (fileName);
                if (fi === false) {
                    return {err: 'Error reading file: "' + fileName + '"'};
                }
                else {
                    return compile (fi.toString (), fileName, level, parents, Files);
                }
            }
            else {
                let file;
                try {
                    file = await fetch(fileName);
                } catch (error) {
                    return {err: 'Error reading file: "' + fileName + '"'};
                }

                if (file?.ok) {
                    var rules = await (file.text());
                    return compile (rules, fileName, level, parents, Files);
                } else {
                    return {err: 'Error reading file "' + fileName + '"'};
                }                    
            }
        }
        
        var compile = async function (rules, file, level, parents, Files) {
            var syntax = `
                (
                    REWRITE
                    (RULE (READ (EXP start)) (WRITE (EXP (\\REWRITE expressions))))
                    
                    (RULE (READ (EXP expressions)) (WRITE (EXP (expression expressions))))
                    (RULE (READ (EXP expressions)) (WRITE (EXP (expression ())         )))
                    
                    (RULE (READ (EXP expression)) (WRITE (EXP start                         )))
                    
                    (RULE (READ (EXP expression)) (WRITE (EXP (\\FETCH (ATOMIC ()))        )))

                    (RULE (READ (EXP expression)) (WRITE (EXP (\\RULE rd-wt)                )))
                    (RULE (READ (EXP expression)) (WRITE (EXP (\\RULE ((\\VAR atoms) rd-wt)))))
                    
                    (RULE (READ (EXP rd-wt)) (WRITE (EXP (rd (wt ())))))
                    
                    (RULE (READ (EXP rd)) (WRITE (EXP (\\READ  ((\\EXP (ANY ())) ())))))
                    (RULE (READ (EXP wt)) (WRITE (EXP (\\WRITE ((\\EXP (ANY ())) ())))))
                    
                    (RULE (READ (EXP atoms)) (WRITE (EXP (ATOMIC atoms))))
                    (RULE (READ (EXP atoms)) (WRITE (EXP (ATOMIC ())   )))
                )
            `;
            
            var syntaxRules = await getRules (Sexpression.parse (syntax));
            var pRules = Sexpression.parse (rules/*.replaceAll ("_", "&lowbar;")*/);
            
            if (pRules.err) {
                return pRules;
            }
            
            var expression = Sexpression.normalizeSexpr (pRules);
            var ret = Parser.consumeCFG (syntaxRules, "start\\", expression);
            if (ret.err) {
                var path = Sexpression.denormalizeIndexes (ret.path);
                var msg = Sexpression.getNode (rules, path);

                return {err: msg.err, file: file, found: msg.found, pos: msg.pos};
            }
            else {
                var rls = await getRules (pRules, file, level, parents, Files);
                if (rls.err) {
                    if (rls.pos) {
                        if (!rls.file) {
                            rls.file = file;
                        }
                        
                        return rls;
                    }
                    else {
                        var msg = Sexpression.getNode (rules, rls.path);
                        return {err: rls.err, file: rls.file, found: msg.found, pos: msg.pos};
                    }
                }
                
                return rls;
            }
        };
        
        var getRules = async function (arr, file, level, parents, Files) {
            var rules = [];
            var stack = [];
            var p = [];
            if (level === undefined) {
                level = 0;
            }
            
            stack.push ({ast: arr, level: level, parents});
            while (stack.length > 0){
                var node = stack.pop ();
                if (node.ast[0] === "REWRITE") {
                    if (node.index) {
                        p.pop ();
                        p.push (node.index)
                    }
                    
                    for(var i = node.ast.length - 1; i >= 1 ; i--) {
                        stack.push ({parents: [node.ast, node.parents], ast: node.ast[i], level: node.level + 1, index: i});
                    }
                }
                else if (node.ast[0] === "FETCH") {
                    if (file) {
                        var fn = file.substring (0, file.lastIndexOf ("/")) + "/" + node.ast[1];
                        var arrRules = await compileFile (fn, node.level, node.parents, Files);
                        if (arrRules.err) {
                            if (arrRules.file) {
                                return arrRules;
                            }
                            else {
                                return {err: arrRules.err, file: file, path: arrRules.path ? arrRules.path : p.concat([node.index])}
                            }
                        }
                        
                        rules = [...rules, ...arrRules];
                    }
                    else {
                        return {err: "Fetching files is only allowed from command line or API", path: p.concat([node.index])};
                    }
                }
                else if (node.ast[0] === "RULE") {
                    var rule = node.ast;
                    var v = [];
                    var varsOffset = 0;
                    if (rule[1][0] === "VAR") {
                        varsOffset = 1;
                        for (var j = 1; j < rule[1].length; j++) {
                            if (-Ruler.getLvl (rule[1][j]) !== 0){
                                return {err: "Can not escape variable definition error", file: file, path: p.concat ([node.index, 1, j])};
                            }
                            v.push (rule[1][j]);
                        }
                    }
                    
                    var r = {read: [], write: []};
                    for (var j = 1; j < rule[1 + varsOffset][1].length; j++) {
                        r.read.push (rule[1 + varsOffset][1][j]);
                    }
                    
                    for (var j = 1; j < rule[2 + varsOffset][1].length; j++) {
                        r.write.push (rule[2 + varsOffset][1][j]);
                    }
                    
                    r.read = Sexpression.flatten (r.read[0]);
                    r.write = Sexpression.flatten (r.write[0]);
                    
                    r.read = Ruler.levelShift (r.read, node.level);
                    r.write = Ruler.levelShift (r.write, node.level);
                    
                    r.maxLvlR = Ruler.getMaxLvl (r.read, 0, r.read.length, v);
                    r.maxLvlW = Ruler.getMaxLvl (r.write, 0, r.write.length, v);
                    
                    rules.push ({vars: v, rule: r, level: node.level, parents: node.parents});
                }
            }
            
            return rules;
        };
        
        var produce = function (rules, top) {
            var stack, item, uvars = [];
            
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
                    
                    while (true) {
                        while (true) {
                            item.ruleIndex++;
                            if (item.ruleIndex === rules.length) {
                                break;
                            }
                            
                            if (item.curRule === undefined) {
                                if (rules[item.ruleIndex].rule.maxLvlR === 0) {
                                    break;
                                }
                            }
                            else {
                                var cpd = getCommonParDist (item.curRule.parents, rules[item.ruleIndex].parents);
                                if (cpd.d1 === 0 || (item.curRule.rule.maxLvlW <= item.curRule.level + cpd.d1 && rules[item.ruleIndex].rule.maxLvlR <= rules[item.ruleIndex].level + cpd.d2)) {
                                    break;
                                }
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
                                stackPop (stack, true, item.processData[0]); // for deterministic version
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
                            var v = Ruler.unify (item.write, item.fromW, item.toW, rules[item.ruleIndex].rule.read, 0, rules[item.ruleIndex].rule.read.length, rules[item.ruleIndex].level, rules[item.ruleIndex].vars);
                            if (v) {
                                var substed = Ruler.subst (rules[item.ruleIndex].rule.write, v.vars);
                                //substed = Ruler.subst (rules[item.ruleIndex].rule.write, v.vars);
                                stack.push ({
                                    phase: "test-whole",
                                    write: substed,
                                    fromW: 0,
                                    toW: substed.length,
                                    curRule: rules[item.ruleIndex],
                                    path: item.path
                                });
                                
                                for (var key in v.uvars) {
                                    uvars[key] = v.uvars[key];
                                }
                                
                                if (Object.keys(uvars).length > 0) {
                                    for (var si = 0; si < stack.length; si++) {
                                        if (stack[si].processData) {
                                            stack[si].processData = Ruler.usubst (stack[si].processData, uvars);
                                        }
                                        
                                        if (stack[si].resultData) {
                                            stack[si].resultData = Ruler.usubst (stack[si].resultData, uvars);
                                        }
                                        
                                        if (stack[si].write) {
                                            stack[si].write = Ruler.usubst (stack[si].write, uvars, stack[si]);
                                        }
                                    }
                                }
                                
                                break;
                            }
                        }
                    }
                }
            }
            
            var result = stack[0].resultData.join(" ");
            return Sexpression.parse (result);
        }
        
        var stackPop = function (stack, result, resultData) {
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
        
        var getCommonParDist = function (p1, p2) {
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
        
        var stringify = function (arr) {
            return Sexpression.stringify (arr);
        }
        
        return {
            compile: compile,
            compileFile: compileFile,
            rewrite: rewrite,
            stringify: stringify
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var Sexpression = require ("./sexpression.js");
    var Parser = require ("./parser.js");
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

