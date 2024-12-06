// compiler.js
// (c) tearflake, 2024
// MIT License

var Compiler = (
    function (obj) {
        return {
            compile: obj.compile,
        };
    }
) (
    (function () {
        "use strict";
        var compile = function (rules) {
            var syntax = `
                (
                    REWRITE
                    (RULE (READ (EXP start)) (WRITE (EXP (\\REWRITE expressions))))
                    
                    (RULE (READ (EXP expressions)) (WRITE (EXP (expression expressions))))
                    (RULE (READ (EXP expressions)) (WRITE (EXP (expression ())      )))
                    
                    (RULE (READ (EXP expression)) (WRITE (EXP start)))
                    (RULE (READ (EXP expression)) (WRITE (EXP (\\RULE rd-wt)                )))
                    (RULE (READ (EXP expression)) (WRITE (EXP (\\RULE ((\\VAR atoms) rd-wt)))))
                    
                    (RULE (READ (EXP rd-wt)) (WRITE (EXP (rd (wt ())))))
                    
                    (RULE (READ (EXP rd)) (WRITE (EXP (\\READ  ((\\EXP (ANY ())) ())))))
                    (RULE (READ (EXP wt)) (WRITE (EXP (\\WRITE ((\\EXP (ANY ())) ())))))
                    
                    (RULE (READ (EXP atoms)) (WRITE (EXP (ATOMIC atoms))))
                    (RULE (READ (EXP atoms)) (WRITE (EXP (ATOMIC ())   )))
                )
            `;

            var syntaxRules = getRules (Sexpression.parse (syntax));
            var pRules = Sexpression.parse (rules.replaceAll ("_", "&lowbar;"));

            if (pRules.err) {
                return pRules;
            }
            
            var expression = Sexpression.normalizeSexpr (pRules);
            var ret = consumeCFG (syntaxRules, "start\\", expression);
            if (ret.err) {
                var path = Sexpression.denormalizeIndexes (ret.path);
                var msg = Sexpression.getNode (rules, path);

                return {err: msg.err, found: msg.found, pos: msg.pos};
            }
            else {
                var rls = getRules (pRules);
                if (rls.err) {
                    var msg = Sexpression.getNode (rules, rls.path);
                    return {err: rls.err, found: msg.found, pos: msg.pos};
                }
                
                return rls;
            }
        };
        
        var getRules = function (arr) {
            var rules = [];
            var stack = [];
            var p = [];
            stack.push ({ast: arr, level: 0});
            while (stack.length > 0){
                var node = stack.pop ();
                if (node.ast[0] === "REWRITE") {
                    if (node.index) {
                        p.push (node.index)
                    }
                    
                    for(var i = node.ast.length - 1; i >= 1 ; i--) {
                        stack.push ({parents: [node.ast, node.parents], ast: node.ast[i], level: node.level + 1, index: i});
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
                                return {err: "Can not escape variable error", path: p.concat ([node.index, 1, j])};
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
        
        var consumeCFG = function (rules, top, bot) {
            var stack, item;
            
            memoCFG = [];
            farthestPath = [];
            top = Sexpression.flatten(top);
            bot = Sexpression.flatten(bot);
            stack = [{phase: "top"}];
            stack.push ({
                phase: "test-whole",
                write: top,
                fromW: 0,
                toW: top.length,
                read: bot,
                fromR: 0,
                toR: bot.length,
                path: []
            });
            while (stack.length > 1) {
                item = stack[stack.length - 1];
                if (item.phase === "test-whole") {
                    if (item.result === true) {
                        if (item.toW - item.fromW === 1) {
                            memoPutCFG (item.fromR, item.write[item.fromW], item.resultData);
                        }
                        
                        stackPop (stack, true, item.resultData);
                    }
                    if (item.result === false) {
                        stackPop (stack, false, item.resultData);
                    }
                    else if (item.toW - item.fromW === 1) {
                        var memo = memoGetCFG (item.fromR, item.write[item.fromW]);
                        if (memo && stack.length > 1) {
                            stackPop (stack, true, memo);
                        }
                        else {
                            if (item.write[item.fromW] === "ATOMIC" & item.toR - item.fromR === 1) {
                                stackPop (stack, true, item.read.slice (item.fromR, item.toR));
                            }
                            else if (item.write[item.fromW] === "ANY") {
                                stackPop (stack, true, item.read.slice (item.fromR, item.toR));
                            }
                            else if ((item.toR - item.fromR === 1 && Ruler.getLvl (item.write[item.fromW]) === 0 && item.write[item.fromW] === item.read[item.fromR])) {
                                stackPop (stack, true, [item.write[item.fromW]]);
                            }
                            else if (Ruler.getLvl (item.write[item.fromW]) > 0){
                                stack.push ({
                                    phase: "rewrite",
                                    ruleIndex: -1,
                                    write: [item.write[item.fromW]],
                                    fromW: 0,
                                    toW: 1,
                                    read: item.read,
                                    fromR: item.fromR,
                                    toR: item.toR,
                                    path: item.path
                                });
                            }
                            else {
                                stackPop (stack, false, item.path);
                            }
                        }
                    }
                    else if (item.read[item.fromR] === "(") {
                        stack.push ({
                            phase: "test-parts",
                            write: item.write,
                            fromW: item.fromW + 1,
                            toW: item.toW - 1,
                            idxW: item.fromW + 1,
                            read: item.read,
                            fromR: item.fromR + 1,
                            toR: item.toR - 1,
                            idxR: item.fromR + 1,
                            processData: [],
                            path: [...item.path, 0]
                        });
                    }
                    else {
                        stackPop (stack, false, item.path);
                    }
                }
                else if (item.phase === "test-parts") {
                    if (item.result === false) {
                        stackPop (stack, false, item.resultData);
                    }
                    else {
                        
                        if (item.result === true) {
                            item.processData = [...item.processData, ...item.resultData];
                            item.path[item.path.length - 1]++;
                        }
                        
                        if (item.idxW === item.toW && item.idxR === item.toR) {
                            stackPop (stack, true, ["(", ...item.processData, ")"]);
                        }
                        else if (item.idxW < item.toW && item.idxR < item.toR) {
                            var fromW = item.idxW;
                            var toW = getNextWhole (item.write, item.idxW);
                            item.idxW = toW;
                            var fromR = item.idxR;
                            var toR = getNextWhole (item.read, item.idxR);
                            item.idxR = toR;
                            stack.push ({
                                phase: "test-whole",
                                write: item.write,
                                fromW: fromW,
                                toW: toW,
                                read: item.read,
                                fromR: fromR,
                                toR: toR,
                                path: item.path
                            });
                        }
                        else {
                            stackPop (stack, false, item.resultData);
                        }
                    }
                }
                else if (item.phase === "rewrite") {
                    if (item.result === true) {
                        stackPop (stack, true, item.resultData);
                    }
                    else {
                        while (true) {
                            item.ruleIndex++;
                            if (item.ruleIndex === rules.length) {
                                stackPop (stack, false, item.resultData);
                                
                                break;
                            }
                            else {
                                if (rules[item.ruleIndex].rule.read[0] == item.write[0]) {
                                    stack.push ({
                                        phase: "test-whole",
                                        write: rules[item.ruleIndex].rule.write,
                                        fromW: 0,
                                        toW: rules[item.ruleIndex].rule.write.length,
                                        read: item.read,
                                        fromR: item.fromR,
                                        toR: item.toR,
                                        path: item.path
                                    });
                                    
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            if (stack[0].result === true) {
                return Sexpression.parse (stack[0].resultData.join(" "));
            }
            else {
                return {err: true, path: farthestPath};
            }
        }
        
        var memoCFG;
        var memoPutCFG = function (pos, key, value) {
            if (!memoCFG[pos]) {
                memoCFG[pos] = [];
            }
            
            if (memoCFG[pos][key] === undefined && !memoCFG[pos].hasOwnProperty(key)) {
                memoCFG[pos][key] = value;
            }
        }
        
        var memoGetCFG = function (pos, key) {
            if (memoCFG[pos] && memoCFG[pos][key] !== undefined && memoCFG[pos].hasOwnProperty(key)) {
                return memoCFG[pos][key];
            }
            else {
                return undefined;
            }
        }

        var farthestPath;
        var stackPop = function (stack, result, resultData) {
            if (compareArr(stack[stack.length - 1].path || [], farthestPath) > 0) {
                farthestPath = stack[stack.length - 1].path;
            }
            stack.pop ();

            stack[stack.length - 1].result = result;
            stack[stack.length - 1].resultData = resultData;
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

        var compareArr = function (arr1, arr2) {
            for (var i = 0; i < arr1.length; i++) {
                if (i < arr2.length) {
                    if (arr1[i] < arr2[i]) {
                        return -1;
                    }
                    else if (arr1[i] > arr2[i]) {
                        return 1;
                    }
                }
                else {
                    break;
                }
            }
            
            if (arr1.length < arr2.length) {
                return -1;
            }
            else if (arr1.length > arr2.length) {
                return 1;
            }
            else {
                return 0;
            }
        }

        return {
            compile: compile,
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var Sexpression = require ("./sexpression.js");
    var Ruler = require ("./ruler.js");
    module.exports = Compiler;
    
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

