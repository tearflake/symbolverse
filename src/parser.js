// parser.js
// (c) tearflake, 2025
// MIT License

var Parser = (
    function (obj) {
        return {
            consumeCFG: obj.consumeCFG,
        };
    }
) (
    (function () {
        "use strict";

        var consumeCFG = function (rules, top, bot) {
            var stack, item;
            
            memoCFG = [];
            farthestPath = [];
            top = Sexpr.flatten(top);
            bot = Sexpr.flatten(bot);
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
                            if (Ruler.levelSplit (item.write[item.fromW]).atom === "ATOMIC" & item.toR - item.fromR === 1) {
                                stackPop (stack, true, item.read.slice (item.fromR, item.toR));
                            }
                            else if (Ruler.levelSplit (item.write[item.fromW]).atom === "ANY") {
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
                return Sexpr.parse (stack[0].resultData.join(" "));
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
            consumeCFG: consumeCFG,
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var Sexpr = require ("./s-expr.js");
    var Ruler = require ("./ruler.js");
    module.exports = Parser;
    
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

