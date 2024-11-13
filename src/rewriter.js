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
        
        var rewrite = function (rules, strInput) {
            var input = Sexpression.parse (strInput.replaceAll ("_", "&lowbar;"));//.replaceAll ("\\", "&bsol;"));
            if (input.err) {
                return input;
            }
            else {
                var output = prove (rules, input, true)
                if (output.err) {
                    var msg = Sexpression.getNode (strInput, output.path);
                    return {err: output.err, found: msg.found, pos: msg.pos};
                }
                else {
                    return Sexpression.stringify (output).replaceAll ("&lowbar;", "_");//.replaceAll ("&bsol;", "\\");
                }
            }
        }

        var compile = function (rules) {
            var syntax = `
                (
                    REWRITE
                    (RULE (READ (EXP)) (WRITE (EXP start)))
                    
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
            var ret = prove (syntaxRules, undefined, expression);
            if (ret.err && ret.err !== "FAILURE") {
                var path = Sexpression.denormalizeIndexes (ret.path);
                var msg = Sexpression.getNode (rules, path);

                return {err: ret.err, found: msg.found, pos: msg.pos};
            }
            else if (ret.err) {
                var path = Sexpression.denormalizeIndexes (ret.path);
                var msg = Sexpression.getNode (rules, path);

                return msg;
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
                            if (-Ruler.getLevel (rule[1][j]) !== 0){
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
                    
                    for (var k = 0; k < v.length; k++) {
                        r.read = replaceInArr (r.read, v[k]);
                        r.write = replaceInArr (r.write, v[k]);
                        v[k] = "_" + v[k];
                    }
                    
                    r.read[0] = Ruler.levelOut (r.read[0], v, node.level);
                    r.write[0] = Ruler.levelOut (r.write[0], v, node.level);
                    
                    rules.push ({vars: v, rule: r, level: node.level, parents: node.parents});
                }
            }
            
            return rules;
        };
        
        var varIndex;
        var farthestPath;
        var prove = function (rules, top, bot) {
            varIndex = 0;
            farthestPath = [];
            var eager = (bot === true);
            var ret = undefined;
            var chart = [];
            memoF = [];
            memoT = [];
            chart.push ({
                state: "top",
                path: []
            });
            chart.push ({
                state: "cycle",
                wvars: [],
                rvars: [],
                write: top,
                read: bot,
                ret: top,
                path: [],
                dpath: 0
            });
            while (chart.length > 1) {
                if (chart.length >= 1024) {
                    return {err: "Stack out of space", path: getPath(chart)};
                }
                
                var item = chart[chart.length - 1];
                if (item.state === "cycle") {
                    var existsF = memoGet (item.succ, false, item.write, item.read, item.wvars, undefined, item.partialPath);
                    var existsT = memoGet (item.succ, true, item.write, item.read, item.wvars, item.ret);
                    if (item.succ === undefined && existsF) {
                        itemPop (chart, false, item.ret, item.wvars, existsF.partialPath);
                    }
                    else if (item.succ === undefined && existsT) {
                        itemPop (chart, true, existsT.ret, item.wvars);
                    }
                }
                
                var item = chart[chart.length - 1];
                if (item.state === "cycle") {
                    if (item.read === false) {
                        itemPop (chart, false, item.ret, item.wvars);
                    }
                    else if (item.succ === false) {
                        itemPop (chart, false, item.ret, item.wvars);
                    }
                    else if (item.succ === true) {
                        itemPop (chart, true, item.ret, item.wvars);
                    }
                    else {
                        var rv, wv;

                        if (typeof item.read === 'string') {
                            rv = Ruler.levelSplit (item.read).atom;
                        }
                        else {
                            rv = item.read;
                        }

                        if (typeof item.ret === 'string') {
                            wv = Ruler.levelSplit (item.ret).atom;
                        }
                        else {
                            wv = item.ret;
                        }

                        if (item.rvars.hasOwnProperty(rv) && item.wvars.hasOwnProperty(item.rvars[rv]) && item.wvars[item.rvars[rv]] === null) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (item.rvars.hasOwnProperty(rv) && item.rvars[rv] === null) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (item.rvars.hasOwnProperty(rv) && item.rvars[rv] !== undefined && arrayMatch (item.ret, item.rvars[rv], true)) {
                            itemPop (chart, true, item.ret, item.wvars, true);
                        }
                        else if (item.wvars.hasOwnProperty(wv) && item.wvars[wv] === null && item.read !== false) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (item.wvars.hasOwnProperty(wv) && item.wvars[wv] !== undefined && (item.wvars[wv] === true || arrayMatch (item.wvars[wv], item.read, true))) {
                            itemPop (chart, true, item.ret, item.wvars, true);
                        }
                        else {
                            var looping = false;
                            
                            for (var i = chart.length - 2; i >= 0; i--) {
                                var c = chart[i];
                                if (c.state === "cycle") {
                                    if (
                                        varsMatch (c.wvars, item.wvars) &&
                                        arrayMatch (c.write, item.write) &&
                                        arrayMatch (c.read, item.read)
                                    ) {
                                        if (c.dpath === item.dpath /*&& arrayMatch (c.path, item.path)*/) {
                                            return {err: "Infinite recursion error", path: item.path};
                                        }
                                        else {
                                            looping = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            if (!looping) {
                                chart.push ({
                                    state: "pbulk",
                                    phase: (Array.isArray (item.write) ? "arrayPhase" : "atomPhase"),
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    curRule: item.curRule,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write,
                                    path: item.path,
                                    dpath: item.dpath
                                });
                            }
                            else {
                                itemPop (chart, "infrec", item.ret, item.wvars);
                            }
                        }
                    }
                }
                else if (item.state === "pbulk") {
                    if (item.succ === "infrec") {
                        itemPop (chart, item.read === true, item.write, item.wvars);
                    }
                    else if ((item.read === true && item.succ === false) || (item.read !== true && item.succ === true)) {
                        itemPop (chart, true, item.ret, item.wvars);
                    }
                    else if (!item.pstepped && ((item.read === true && item.succ === true) || (item.read !== true && item.succ === false))) {
                        item.pstepped = true;
                        chart.push ({
                            state: "pstep",
                            ruleIndex: -1,
                            wvars: item.wvars,
                            rvars: item.rvars,
                            curRule: item.curRule,
                            write: item.ret,
                            read: item.read,
                            ret: item.ret,
                            path: item.path,
                            dpath: item.dpath
                        });
                    }
                    else if (item.pstepped) {
                        itemPop (chart, item.read === true, item.ret, item.wvars);
                    }
                    else {
                        chart.push ({
                            state: item.phase,
                            arrayIndex: -1,
                            wvars: item.wvars,
                            rvars: item.rvars,
                            curRule: item.curRule,
                            write: item.ret,
                            read: item.read,
                            ret: item.ret,
                            path: item.path,
                            dpath: item.dpath
                        });
                    }
                }
                else if (item.state === "atomPhase") {
                    if (item.write === "ATOMIC") {
                        itemPop (chart, item.read === true ? !Array.isArray (item.ret) : !Array.isArray (item.read),  item.read === true ? item.ret : item.read, item.wvars);
                    }
                    else if (item.write === "COMPOUND") {
                        itemPop (chart, item.read === true ? Array.isArray (item.ret) : Array.isArray (item.read), item.read === true ? item.ret : item.read, item.wvars);
                    }
                    else if (item.write === "ANY") {
                        itemPop (chart, true, item.read === true ? item.ret : item.read, item.wvars);
                    }
                    else {
                        itemPop (chart, item.read === true || item.ret === item.read, item.ret, item.wvars);
                    }
                }
                else if (item.state === "arrayPhase") {
                    if (item.succ === "infrec") {
                        itemPop (chart, item.succ, item.ret, item.wvars);
                    }
                    else if (item.succ === false || (item.read !== true && !(Array.isArray (item.read) && Array.isArray (item.write) && item.write.length === item.read.length))) {
                        itemPop (chart, false, item.write, item.wvars);
                    }
                    else {
                        if (item.arrayIndex === -1) {
                            item.ret = [];
                        }

                        item.arrayIndex++;
                        if (item.arrayIndex < item.write.length) {
                            chart.push ({
                                state: "cycle",
                                wvars: item.wvars,
                                rvars: item.rvars,
                                curRule: item.curRule,
                                write: item.write[item.arrayIndex],
                                read: (
                                    Array.isArray (item.read)
                                    ? item.read[item.arrayIndex]
                                    : item.read === true
                                ),
                                ret: item.write[item.arrayIndex],
                                path: item.path.concat ([item.arrayIndex]),
                                dpath: item.dpath
                            });
                        }
                        else {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                    }
                }
                else if (item.state === "pstep") {
                    if (item.succ === "infrec") {
                        itemPop (chart, item.succ, item.ret, item.wvars);
                    }
                    else if (item.succ === true) {
                        itemPop (chart, true, item.ret, item.wvars);
                    }
                    else {
                        while (true) {
                            item.ruleIndex++;
                            if (item.ruleIndex === rules.length) {
                                break;
                            }
                            
                            // level depth sensitivity
                            if (item.curRule !== undefined && rules[item.ruleIndex].rule.read[0] !== undefined /*&& item.curRule.parents[0] !== rules[item.ruleIndex].parents[0]*/) {
                                var cd = getComParDist (item.curRule.parents, rules[item.ruleIndex].parents);
                                var l1 = Ruler.getMaxLevel (item.curRule.rule.write, item.curRule.vars);
                                var l2 = Ruler.getMaxLevel (rules[item.ruleIndex].rule.read[0], rules[item.ruleIndex].vars);
                                var t1 = item.curRule.level;
                            }
                            else {
                                var cd = {d1: 0, d2: 0};
                                var l1 = Ruler.getMaxLevel (item.write, []) - 1;
                                var l2 = Ruler.getMaxLevel (rules[item.ruleIndex].rule.read[0], rules[item.ruleIndex].vars) - 1;
                                var t1 = 1;
                            }

                            if (l1 <= t1 + cd.d1 && l2 <= rules[item.ruleIndex].level + cd.d2) {
                                break;
                            }
                        }
                        
                        if (item.ruleIndex < rules.length) {
                            chart.push ({
                                state: "pstepPhase",
                                readIndex: -1,
                                rule: rules[item.ruleIndex],
                                wvars: item.wvars,
                                rvars: getVars(rules[item.ruleIndex].vars),
                                tmprvars: item.rvars,
                                curRule: item.curRule,
                                write: item.write,
                                read: item.read,
                                ret: item.write,
                                path: item.path,
                                dpath: item.dpath
                            });
                        } else {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                    }
                }
                else if (item.state === "pstepPhase") {
                    if (item.succ === "infrec") {
                        itemPop (chart, item.succ, item.ret, item.wvars);
                    }
                    else if (item.succ === false || (item.rule.rule.read.length === 0 && item.write !== undefined)) {
                        itemPop (chart, false, item.ret, item.wvars);
                    }
                    else if (item.succ === true && item.readIndex === item.rule.rule.read.length) {
                        itemPop (chart, true, item.ret, item.wvars);
                    }
                    else {
                        item.readIndex++;
                        if (item.readIndex < item.rule.rule.read.length) {
                            var skip = false;
                            
                            // speed optimization begin
                            if (
                            
                                (Array.isArray (item.write) !== Array.isArray (item.rule.rule.read[item.readIndex])) ||
                                (Array.isArray (item.write) && Array.isArray (item.rule.rule.read[item.readIndex]) && item.write.length !== item.rule.rule.read[item.readIndex].length)
                            ) {
                                skip = true;
                            }
                            // speed optimization end
                            
                            if (skip || item.write === "ATOMIC" || item.write === "COMPOUND" || item.write === "ANY") {
                                itemPop (chart, false, item.ret, item.wvars);
                            }
                            else {
                                chart.push ({
                                    state: "cycle",
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    curRule: item.curRule,
                                    write: item.write,
                                    read: item.rule.rule.read[item.readIndex],
                                    ret: item.write,
                                    path: [],
                                    dpath: item.dpath + 1
                                });
                            }
                        }
                        else {
                            var wvars = cloneVars (item.wvars);
                            var rvars = Ruler.getVars(item.rule.vars, varIndex);
                            if (Ruler.arrayMatch (item.ret, item.rule.rule.read[0], wvars, rvars, varIndex)) {
                                var tmpWrite = Ruler.substVars (wvars, Ruler.substVars (rvars, item.rule.rule.write[0], varIndex));
                                
                                // bug zone begin
                                var tmprvars = [];
                                for (var key in rvars) {
                                    if (findInArr (tmpWrite, key)) {
                                        tmprvars[key] = rvars[key];
                                    }
                                }
                                // bug zone end
                                
                                chart.push ({
                                    state: "cycle",
                                    //wvars: concat (item.wvars, concat (wvars, rvars)),
                                    wvars: concat (item.wvars, concat (wvars, tmprvars)),
                                    rvars: item.tmprvars,
                                    parents: item.parents,
                                    curRule: item.rule,
                                    write: tmpWrite,
                                    read: item.read,
                                    ret: tmpWrite,
                                    path: item.path,
                                    dpath: item.dpath
                                });
                                
                                if (rvars !== null) {
                                    varIndex++;
                                }
                            }
                            else {
                                itemPop (chart, false, item.ret, item.wvars); // skip unmatched
                            }
                        }
                    }
                }
            }
            
            return chart[0].succ
                ? (bot && bot !== true ? bot : chart[0].ret)
                : {err: "FAILURE", path: farthestPath};
        }
        
        var memoF, memoT;
        var memoGet = function (succ, bool, write, read, wvars, ret, partialPath) {
            var memo = bool ? memoT : memoF;
            if (succ !== !bool /*&& !Array.isArray (write)*/) {
                for (var i = 0; i < memo.length; i++) {
                    if (
                        arrayMatch (read, memo[i].read) && arrayMatch (write, memo[i].write) &&
                        ((wvars.indexOf (write) > -1) === (memo[i].wvars.indexOf (memo[i].write) > -1))
                    ) {
                        return memo[i];
                    }
                }
            }
            
            if (succ === bool /*&& !Array.isArray (write)*/) {
                memo.push ({
                    write: write,
                    read: read,
                    wvars: wvars,
                    ret: ret,
                    partialPath: partialPath
                });
            }
            
            return false;
        }
        
        var getPath = function (chart) {
            var fst = false;
            for (var i = chart.length - 1; i >= 0; i--) {
                if (chart[i].state === "cycle" && chart[i].dpath === 0) {
                    if (fst) {
                        return chart[i].path;
                    }
                    else {
                        fst = true;
                    }
                }
            }
            
            return [];
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
        
        var itemPop = function (chart, succ, itret, vars, fromMemo) {
            var olditem = chart[chart.length - 1];
            chart.pop ();
            var item = chart[chart.length - 1];
            item.succ = succ;

            if (item.succ === true) {
                if (item.state === "arrayPhase") {
                    item.ret[item.arrayIndex] = itret;
                }
                else {
                    item.ret = itret;
                }
                item.wvars = concat (item.wvars, vars);
            }
            else {
                if (!item.partialPath) {
                    item.partialPath = olditem.partialPath || [];
                }
                
                if (item.state === "arrayPhase" && olditem.path.length > 0) {
                    item.partialPath = [olditem.path[olditem.path.length - 1]].concat (item.partialPath);
                }
                
                if (fromMemo && olditem.path) {
                    olditem.path = (olditem.path.concat (fromMemo));
                }
                
                if (olditem.path !== false && compareArr(olditem.path, farthestPath) > 0) {
                    farthestPath = olditem.path;
                }
            }
        }

        var getVars = function (vars) {
            var ret = [];
            for (var i = 0; i < vars.length; i++) {
                ret[vars[i]] = null;
            }
            
            return ret;
        }

        var concat = function (arr1, arr2) {
            var ret = [];
            for (var i in arr1) {
            	ret[i] = arr1[i];
            }

            for (var i in arr2) {
            	ret[i] = arr2[i];
            }

            return ret;
        }

        var cloneVars = function (vars) {
            var ret = [];
            if (Array.isArray (vars)) {
                for (var i in vars) {
                	ret[i] = vars[i];
                }
            }
            
            return ret;
        }
        
        var varsMatch = function (s1, s2) {
            for (var i in s1) {
                if (!arrayMatch (s1[i], s2[i])) {
                    return false;
                }
            }
            
            for (var i in s2) {
                if (!arrayMatch (s1[i], s2[i])) {
                    return false;
                }
            }
            
            return true
        }
        
        var arrayMatch = function (s1, s2, checkTrue) {
            var stack = [[s1, s2]], item;
            while (stack.length > 0) {
                item = stack.pop ()
                s1 = item[0];
                s2 = item[1];
                if (Array.isArray (s1) && Array.isArray (s2)) {
                    if (s1.length === s2.length) {
                        for (var i = 0; i < s1.length; i++) {
                            stack.push ([s1[i], s2[i]]);
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (!((checkTrue ? s1 === true : false) || s1 === s2)) {
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        var findInArr = function (arr, str) {
            var stack = [arr], item;
            while (stack.length > 0) {;
                item = stack.pop ()
                if (!Array.isArray (item)) {
                    if (item === str) {
                        return true;
                    }
                }
                else {
                    for (var i = 0; i < item.length; i++) {
                        stack.push (item[i]);
                    }
                }
            }
            return false;
        }

        var replaceInArr = function (arr, str) {
            var stack = [{atom: arr}], item, result, atom, list = [];
            while (stack.length > 0) {
                item = stack.pop ()
                if (item.atom) {
                    arr = item.atom;
                    if (Array.isArray (arr)) {
                        stack.push ({list: list});
                        list = []
                        for (var i = arr.length - 1; i >= 0; i--) {
                            stack.push ({atom: arr[i]});
                        }
                    }
                    else {
                        if (arr === undefined) {
                            result = undefined;
                        }
                        else {
                            var spl = Ruler.levelSplit (arr);
                            if (spl.atom === str) {
                                if (spl.esc < 0) {
                                    result = "\\".repeat (-spl.esc) + "_" + spl.atom;
                                }
                                else {
                                    result = "_" + spl.atom + "\\".repeat (spl.esc);
                                }
                            }
                            else {
                                result = arr;
                            }
                        }
                        list.push (result)
                    }
                }
                else {
                    item.list.push (list)
                    list = item.list;
                }
            }
            
            return list[0];
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

